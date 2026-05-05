import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, Package, LogOut } from 'lucide-react';

const DonorDashboard = () => {
  const { user, logout } = useAuth();
  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: 1,
    bestBefore: '',
    imageUrl: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    fetchMyDonations();
    // Auto-detect location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      });
    }
  }, []);

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get('http://localhost:8080/donations/my');
      setDonations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure date format is correct for backend (LocalDateTime)
      const dataToSubmit = {
        ...formData,
        bestBefore: new Date(formData.bestBefore).toISOString()
      };
      await axios.post('http://localhost:8080/donations', dataToSubmit);
      alert('Donation created successfully!');
      fetchMyDonations();
    } catch (e) {
      alert('Error creating donation');
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Donor Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <button onClick={logout} className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Donation Form */}
        <div className="card p-6 col-span-1 border-t-4 border-t-accent h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Package className="mr-2 text-accent" /> New Donation
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type / Description</label>
              <input
                type="text" className="input" required
                value={formData.foodType}
                onChange={e => setFormData({...formData, foodType: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Meals / kg)</label>
              <input
                type="number" className="input" required min="1"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Best Before Time</label>
              <input
                type="datetime-local" className="input" required
                value={formData.bestBefore}
                onChange={e => setFormData({...formData, bestBefore: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (Lat, Lng) - Auto-detected</label>
              <div className="flex space-x-2">
                <input type="number" readOnly className="input bg-gray-50 text-gray-500" value={formData.latitude} />
                <input type="number" readOnly className="input bg-gray-50 text-gray-500" value={formData.longitude} />
              </div>
            </div>
            <button type="submit" className="btn bg-accent text-white hover:bg-yellow-600 w-full mt-4">
              Publish Donation
            </button>
          </form>
        </div>

        {/* My Donations List */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">My Recent Donations</h2>
          {donations.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl border border-gray-100 border-dashed">
              <p className="text-gray-500">You haven't made any donations yet.</p>
            </div>
          ) : (
            donations.map(donation => (
              <div key={donation.id} className="card p-5 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{donation.foodType}</h3>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p className="flex items-center"><Package className="w-4 h-4 mr-1"/> {donation.quantity} units</p>
                    <p className="flex items-center text-red-500"><Clock className="w-4 h-4 mr-1"/> Best before: {new Date(donation.bestBefore).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    donation.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                    donation.status === 'PICKED_UP' ? 'bg-purple-100 text-purple-800' :
                    donation.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {donation.status}
                  </span>
                  {donation.status === 'ACCEPTED' && donation.pickupOtp && (
                    <div className="mt-3 bg-gray-100 p-2 rounded text-sm text-center font-mono font-bold tracking-widest border border-gray-200">
                      OTP: {donation.pickupOtp}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
