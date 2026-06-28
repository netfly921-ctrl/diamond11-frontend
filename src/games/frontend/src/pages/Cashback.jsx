import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaPercent, FaRupeeSign } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const Cashback = () => {
  const { user, updateUser } = useAuth();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => { fetchInfo(); }, []);

  const fetchInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/cashback/info`);
      if (res.data.success) setInfo(res.data.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await axios.post(`${API_URL}/cashback/claim`);
      if (res.data.success) {
        alert(`🎉 ${res.data.message}`);
        updateUser({ ...user, balance: res.data.newBalance });
        fetchInfo();
      }
    } catch (error) { alert(error.response?.data?.message || 'Error claiming cashback'); }
    finally { setClaiming(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Cashback" backLink="/activity" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
            <FaPercent className="text-5xl text-white" />
          </div>
          <h2 className="text-2xl font-bold">Weekly Cashback</h2>
          <p className="text-purple-300 text-sm mt-2">Get 5% cashback on your weekly losses!</p>
        </div>

        <div className="bg-purple-800/50 rounded-xl p-6 mb-6 border border-purple-600">
          <div className="text-center mb-4">
            <p className="text-purple-300 text-sm">Total Loss (This Week)</p>
            <p className="text-3xl font-bold text-red-400">₹{info?.totalLoss?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-green-500/20 rounded-xl p-4 mb-4">
            <p className="text-center text-green-400 text-sm">Available Cashback</p>
            <p className="text-4xl font-bold text-center text-green-400">₹{info?.cashbackAmount?.toFixed(2) || '0.00'}</p>
          </div>
          {info?.canClaim ? (
            <button onClick={handleClaim} disabled={claiming} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50">
              {claiming ? 'Claiming...' : '🎉 Claim Cashback'}
            </button>
          ) : (
            <button disabled className="w-full bg-gray-600 text-gray-300 py-4 rounded-xl font-bold text-lg cursor-not-allowed">
              No Cashback Available
            </button>
          )}
        </div>

        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-yellow-400 mb-2">💡 How it works?</h3>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Play games throughout the week</li>
            <li>Get 5% cashback on total losses</li>
            <li>Maximum cashback: ₹1,000 per week</li>
            <li>Claim every Monday</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default Cashback;