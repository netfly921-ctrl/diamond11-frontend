import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserFriends, FaUsers, FaLink, FaCopy, FaChartBar, FaReceipt, FaSitemap, FaGift, FaClock } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Promotion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoData, setPromoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ referralBonus: 10, commissionPercent: 5 });

  useEffect(() => {
    fetchPromoData();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/referral/settings`);
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchPromoData = async () => {
    try {
      const res = await axios.get(`${API_URL}/referral/info`);
      if (res.data.success) {
        setPromoData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching promotion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Promotion" backLink="/home" />
      <div className="p-4 text-white">
        {/* Referral Code Card */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col items-center justify-center mb-2 shadow-lg">
            <span className="text-xs text-purple-900 font-bold">YOUR CODE</span>
            <span className="text-lg font-bold text-purple-900">{promoData?.referralCode || 'N/A'}</span>
          </div>
          <p className="text-purple-300 text-sm">Share & Earn ₹{settings.referralBonus} per referral!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-800/50 p-4 rounded-xl text-center border border-purple-600">
            <FaUserFriends className="mx-auto text-2xl text-yellow-400 mb-2" />
            <p className="text-sm text-purple-300">Total Referrals</p>
            <p className="font-bold text-2xl text-white">{promoData?.referralCount || 0}</p>
          </div>
          <div className="bg-purple-800/50 p-4 rounded-xl text-center border border-purple-600">
            <FaChartBar className="mx-auto text-2xl text-green-400 mb-2" />
            <p className="text-sm text-purple-300">Total Earnings</p>
            <p className="font-bold text-2xl text-white">₹{promoData?.totalEarnings?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-purple-800/50 p-4 rounded-xl text-center border border-purple-600">
            <FaClock className="mx-auto text-2xl text-orange-400 mb-2" />
            <p className="text-sm text-purple-300">Pending</p>
            <p className="font-bold text-2xl text-white">₹{promoData?.pendingEarnings?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-purple-800/50 p-4 rounded-xl text-center border border-purple-600">
            <FaGift className="mx-auto text-2xl text-pink-400 mb-2" />
            <p className="text-sm text-purple-300">Commission</p>
            <p className="font-bold text-2xl text-white">{settings.commissionPercent}%</p>
          </div>
        </div>

        {/* Invitation Link */}
        <button
          onClick={() => copyToClipboard(promoData?.invitationLink || '')}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 py-3 rounded-xl font-bold text-purple-900 shadow-lg text-lg mb-6 flex items-center justify-center gap-2"
        >
          <FaLink /> COPY INVITATION LINK
        </button>

        {/* Quick Actions */}
        <div className="bg-purple-800/50 rounded-xl p-2 space-y-2 border border-purple-600 mb-6">
          <div 
            onClick={() => copyToClipboard(promoData?.referralCode || '')}
            className="flex justify-between items-center p-3 hover:bg-purple-700/50 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center">
              <FaCopy className="mr-3 text-yellow-400" />
              <span>Copy Invitation Code</span>
            </div>
            <div className="flex items-center">
              <span className="text-purple-300 mr-2 font-mono">{promoData?.referralCode || 'N/A'}</span>
              <FaCopy className="cursor-pointer text-yellow-400" />
            </div>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-purple-700/50 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center">
              <FaChartBar className="mr-3 text-green-400" />
              <span>Promotion Data</span>
            </div>
            <span className="text-purple-300">&gt;</span>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-purple-700/50 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center">
              <FaReceipt className="mr-3 text-blue-400" />
              <span>Commission Detail</span>
            </div>
            <span className="text-purple-300">&gt;</span>
          </div>
          <div className="flex justify-between items-center p-3 hover:bg-purple-700/50 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center">
              <FaSitemap className="mr-3 text-pink-400" />
              <span>Referred Users ({promoData?.referredUsers?.length || 0})</span>
            </div>
            <span className="text-purple-300">&gt;</span>
          </div>
        </div>

        {/* Referred Users List */}
        {promoData?.referredUsers && promoData.referredUsers.length > 0 && (
          <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-600 mb-6">
            <h3 className="font-bold text-lg mb-3 text-yellow-400">Referred Users</h3>
            <div className="space-y-2">
              {promoData.referredUsers.slice(0, 5).map((u, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-purple-900/30 rounded-lg">
                  <span className="text-sm text-white">{u.phone}</span>
                  <span className="text-xs text-purple-300">{new Date(u.joinedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-600">
          <h4 className="font-bold text-yellow-400 mb-3">How Referral Works:</h4>
          <ul className="text-sm text-purple-200 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">1.</span>
              <span>Share your referral code with friends</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">2.</span>
              <span>When they register & deposit, you earn {settings.commissionPercent}% commission</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">3.</span>
              <span>Commission is automatically added to your balance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">4.</span>
              <span>No limit on referrals - earn unlimited!</span>
            </li>
          </ul>
        </div>
      </div>
      <BottomNav activeTab="promotion" />
    </div>
  );
};

export default Promotion;