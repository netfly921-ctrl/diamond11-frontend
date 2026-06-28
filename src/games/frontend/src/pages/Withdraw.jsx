import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaBuilding, FaWallet } from 'react-icons/fa';  // ✅ FaBank ki jagah FaBuilding use karo

const API_URL = 'https://diamond11-backend.onrender.com';

const Withdraw = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    upiId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) < 200) {
      alert('Minimum withdraw amount is ₹200');
      return;
    }
    if (parseFloat(formData.amount) > (user?.balance || 0)) {
      alert('Insufficient balance');
      return;
    }
    if (!formData.accountName || !formData.accountNumber || !formData.ifsc) {
      alert('Please fill all bank details');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/withdraw/create`, formData);
      if (res.data.success) {
        alert('Withdraw request submitted successfully! Please wait for admin approval.');
        navigate('/wallet');
      } else {
        alert(res.data.message || 'Failed to submit withdraw');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Withdraw Money" backLink="/wallet" />
      <div className="p-4 text-white">
        {/* Balance Card */}
        <div className="bg-purple-800/50 rounded-xl p-4 mb-6 border border-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaWallet className="text-yellow-400 text-xl" />
              <span className="text-purple-300">Available Balance</span>
            </div>
            <span className="text-2xl font-bold text-yellow-400">₹{user?.balance?.toFixed(2) || '0.00'}</span>
          </div>
          <p className="text-xs text-purple-300 mt-2">Min Withdraw: ₹200 | Max Withdraw: ₹10,000</p>
        </div>

        {/* Withdraw Form */}
        <form onSubmit={handleSubmit} className="bg-purple-800/50 rounded-xl p-4 border border-purple-600">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaBuilding className="text-yellow-400" /> Bank Details  {/* ✅ FaBank ki jagah FaBuilding */}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">Withdraw Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount (min ₹200)"
              className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400"
              required
              min="200"
              max="10000"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">Account Holder Name</label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Enter account holder name"
              className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">IFSC Code</label>
            <input
              type="text"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              placeholder="Enter IFSC code"
              className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-2">UPI ID (Optional)</label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="example@upi"
              className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 py-3 rounded-xl font-bold text-purple-900 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Withdraw Request'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-4 p-4 bg-purple-800/30 rounded-xl border border-purple-600">
          <h4 className="font-bold mb-2 text-yellow-400">Withdrawal Info:</h4>
          <ul className="text-sm text-purple-200 space-y-1 list-disc list-inside">
            <li>Minimum withdraw: ₹200</li>
            <li>Maximum withdraw: ₹10,000 per day</li>
            <li>Processing time: 5-30 minutes</li>
            <li>Withdrawals are processed by admin manually</li>
            <li>Make sure bank details are correct</li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="wallet" />
    </div>
  );
};

export default Withdraw;