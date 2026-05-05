import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Users, Utensils, Award } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ totalMeals: 0, active: 0, completed: 0, expired: 0 });

  useEffect(() => {
    fetchAllDonations();
  }, []);

  const fetchAllDonations = async () => {
    try {
      const res = await axios.get('http://localhost:8080/donations/all'); // Need to create this endpoint if missing
      const data = res.data;
      setDonations(data);
      
      // Calculate stats (assuming 1 kg / unit = 4 meals roughly based on instructions)
      let meals = 0;
      let active = 0;
      let completed = 0;
      let expired = 0;

      data.forEach(d => {
        if (d.status === 'DELIVERED') {
          completed++;
          meals += d.quantity * 4;
        } else if (d.status === 'EXPIRED') {
          expired++;
        } else {
          active++;
        }
      });

      setStats({ totalMeals: meals, active, completed, expired });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Dashboard</h1>
          <p className="text-gray-500">Global overview and impact analytics</p>
        </div>
        <button onClick={logout} className="btn text-gray-500 hover:text-red-500 bg-white shadow-sm border border-gray-200">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 border-b-4 border-b-primary-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Meals Saved</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalMeals}</h3>
            </div>
            <div className="bg-primary-100 p-3 rounded-full"><Utensils className="text-primary-600" /></div>
          </div>
        </div>
        
        <div className="card p-6 border-b-4 border-b-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Requests</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.active}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full"><Activity className="text-blue-600" /></div>
          </div>
        </div>
        
        <div className="card p-6 border-b-4 border-b-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.completed}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full"><Award className="text-green-600" /></div>
          </div>
        </div>

        <div className="card p-6 border-b-4 border-b-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Expired (Lost)</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.expired}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full"><Activity className="text-red-600" /></div>
          </div>
        </div>
      </div>

      <div className="card p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Activity</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Food Type</th>
              <th className="p-4 font-medium">Quantity</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donations.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500">#{d.id}</td>
                <td className="p-4 font-medium text-gray-800">{d.foodType}</td>
                <td className="p-4 text-gray-600">{d.quantity} units</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    d.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    d.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                    d.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    d.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">{new Date(d.createdAt || Date.now()).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
