import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaGift } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const Coupon = () => {
  const { user, updateUser } = useAuth();
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/coupon/apply`, { code });
      if (res.data.success) {
        setResult({ success: true, message: res.data.message });
        updateUser({ ...user, balance: res.data.newBalance });
        setCode('');
      }
    } catch (error) { setResult({ success: false, message: error.response?.data?.message || 'Invalid coupon' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Coupons" backLink="/home" />
      <div className="p-4 text-white">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <FaGift className="text-4xl text-purple-900" />
          </div>
          <h2 className="text-2xl font-bold">Redeem Coupon</h2>
          <p className="text-purple-300 text-sm mt-2">Enter coupon code to claim bonus!</p>
        </div>

        <form onSubmit={handleApply} className="bg-purple-800/50 rounded-xl p-6 border border-purple-600 mb-6">
          <div className="flex gap-2">
            <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" className="flex-1 p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white uppercase focus:outline-none focus:border-yellow-400" />
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-6 py-3 rounded-lg font-bold disabled:opacity-50">{loading ? '...' : 'Apply'}</button>
          </div>
        </form>

        {result && <div className={`p-4 rounded-xl ${result.success ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'} border`}><p className="text-center font-bold">{result.message}</p></div>}

        <div className="bg-purple-800/30 rounded-xl p-4 mt-6">
          <h3 className="font-bold text-yellow-400 mb-2">💡 How to use?</h3>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Get coupon code from admin</li>
            <li>Enter code above</li>
            <li>Click Apply</li>
            <li>Bonus added instantly!</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="account" />
    </div>
  );
};

export default Coupon;