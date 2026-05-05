import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Map, Navigation, CheckCircle, Package } from 'lucide-react';

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const { notifications } = useWebSocket();
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [activeClaim, setActiveClaim] = useState(null); // The donation this volunteer accepted
  const [otpInput, setOtpInput] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    // Get location and fetch nearby
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        fetchNearby(position.coords.latitude, position.coords.longitude);
      });
    } else {
      // default coordinates if no GPS
      fetchNearby(0, 0);
    }
  }, [notifications]); // refetch when there's a new websocket alert

  const fetchNearby = async (lat, lng) => {
    try {
      const res = await axios.get(`http://localhost:8080/donations/nearby?lat=${lat}&lng=${lng}&radius=10`);
      setNearbyDonations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaim = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8080/donations/${id}/claim`);
      setActiveClaim(res.data);
      alert('Successfully claimed donation!');
      fetchNearby(location.lat, location.lng);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to claim. Might be locked by another volunteer.');
    }
  };

  const handlePickup = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/donations/${activeClaim.id}/pickup`, { otp: otpInput });
      setActiveClaim(res.data);
      alert('Pickup confirmed via OTP!');
    } catch (e) {
      alert('Invalid OTP or error occurred.');
    }
  };

  const handleDeliver = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/donations/${activeClaim.id}/deliver`);
      setActiveClaim(null);
      alert('Successfully delivered!');
      fetchNearby(location.lat, location.lng);
    } catch (e) {
      alert('Failed to deliver.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Volunteer Dashboard</h1>
          <p className="text-gray-500">Find and claim nearby surplus food.</p>
        </div>
        <button onClick={logout} className="btn text-gray-500 hover:text-red-500 bg-white shadow-sm border border-gray-200">
          Logout
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="bg-primary-100 border-l-4 border-primary-500 p-4 mb-8 rounded-r-lg shadow-sm">
          <p className="text-primary-700 font-medium">Alert: {notifications[notifications.length - 1]}</p>
        </div>
      )}

      {activeClaim ? (
        <div className="card p-6 border-t-4 border-t-primary-500 bg-primary-50 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-primary-700">
            <CheckCircle className="mr-2" /> Active Claim
          </h2>
          <div className="space-y-4">
            <p className="text-lg font-medium">{activeClaim.foodType} - {activeClaim.quantity} units</p>
            <p className="text-gray-600 flex items-center">
              <Map className="w-5 h-5 mr-2 text-gray-400" />
              Location: {activeClaim.latitude.toFixed(4)}, {activeClaim.longitude.toFixed(4)}
            </p>
            
            {activeClaim.status === 'ACCEPTED' && (
              <div className="mt-6 border-t pt-4 border-gray-200">
                <p className="mb-2 text-sm text-gray-600 font-medium">Verify pickup with Donor's OTP:</p>
                <div className="flex space-x-2">
                  <input
                    type="text" className="input max-w-xs font-mono text-center tracking-widest text-lg"
                    placeholder="Enter 4-digit OTP"
                    value={otpInput} onChange={e => setOtpInput(e.target.value)}
                  />
                  <button onClick={handlePickup} className="btn btn-primary">Confirm Pickup</button>
                </div>
              </div>
            )}
            
            {activeClaim.status === 'PICKED_UP' && (
              <div className="mt-6 border-t pt-4 border-gray-200">
                <p className="mb-4 text-sm text-gray-600 font-medium">Food has been picked up. Please deliver it to the destination.</p>
                <button onClick={handleDeliver} className="btn bg-blue-600 text-white hover:bg-blue-700 w-full py-3 text-lg shadow-md">
                  Mark as Delivered
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Nearby Donations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyDonations.length === 0 ? (
              <div className="col-span-full text-center p-12 bg-white rounded-xl border border-gray-100 border-dashed">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No pending donations nearby.</p>
              </div>
            ) : (
              nearbyDonations.map(donation => {
                const isUrgent = new Date(donation.bestBefore) - new Date() < 3600000; // < 1 hour
                return (
                  <div key={donation.id} className={`card p-5 ${isUrgent ? 'border-t-4 border-t-urgent' : 'border-t-4 border-t-primary-500'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800 truncate pr-2">{donation.foodType}</h3>
                      {isUrgent && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold animate-pulse">URGENT</span>}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <p className="flex items-center"><Package className="w-4 h-4 mr-2 text-gray-400" /> {donation.quantity} units</p>
                      <p className="flex items-center text-red-500 font-medium"><CheckCircle className="w-4 h-4 mr-2 text-red-400" /> Exp: {new Date(donation.bestBefore).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 flex justify-center">
                        <Navigation className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleClaim(donation.id)} className={`btn flex-2 w-full ${isUrgent ? 'btn-danger' : 'btn-primary'}`}>
                        Claim Request
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
