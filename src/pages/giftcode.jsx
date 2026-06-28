import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import Header from '../components/header';
import BottomNav from '../components/bottomnav';
import { FaGift, FaTicketAlt } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const GiftCode = () => {
  const { user, updateUser } = useAuth();
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/giftcode/redeem`, { code });
      if (res.data.success) {
        setResult({ success: true, message: res.data.message });
        updateUser({ ...user, balance: res.data.newBalance });
        setCode('');
      }
    } catch (error) {
      setResult({ success: false, message: error.response?.data?.message || 'Invalid code' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Gift Code" backLink="/activity" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <FaGift className="text-5xl text-purple-900" />
          </div>
          <h2 className="text-2xl font-bold">Redeem Gift Code</h2>
          <p className="text-purple-300 text-sm mt-2">Enter your gift code to claim bonus!</p>
        </div>

        <form onSubmit={handleRedeem} className="bg-purple-800/50 rounded-xl p-6 border border-purple-600 mb-6">
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">Gift Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                className="flex-1 p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white uppercase placeholder-purple-400/50 focus:outline-none focus:border-yellow-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-6 py-3 rounded-lg font-bold disabled:opacity-50"
              >
                {loading ? '...' : 'Redeem'}
              </button>
            </div>
          </div>
        </form>

        {result && (
          <div className={`p-4 rounded-xl mb-6 ${result.success ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'} border`}>
            <p className="text-center font-bold">{result.message}</p>
          </div>
        )}

        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-600">
          <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><FaTicketAlt /> How to get Gift Codes?</h3>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Follow us on social media</li>
            <li>Participate in special events</li>
            <li>Refer friends to earn codes</li>
            <li>Check your mail box for codes</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="activity" />
    </div>
  );
};

export default GiftCode;