import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaArrowDown, FaArrowUp, FaWallet, FaGift, FaHistory, FaChartLine, FaPiggyBank, FaCog, FaInfoCircle, FaCommentDots, FaSignOutAlt, FaBell, FaCrown, FaCalendarCheck, FaTrophy } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vipInfo, setVipInfo] = useState(null);
  const [dailyBonus, setDailyBonus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVIPInfo();
    fetchDailyBonus();
  }, []);

  const fetchVIPInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/vip/my`);
      if (res.data.success) {
        setVipInfo(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching VIP info:', error);
    }
  };

  const fetchDailyBonus = async () => {
    try {
      const res = await axios.get(`${API_URL}/vip/daily-bonus`);
      if (res.data.success) {
        setDailyBonus(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching daily bonus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const claimDailyBonus = async () => {
    try {
      const res = await axios.post(`${API_URL}/vip/claim-daily-bonus`);
      if (res.data.success) {
        alert(`🎉 Daily Bonus Claimed! ₹${res.data.bonusAmount} added to your balance!\nStreak: ${res.data.streak} days`);
        fetchDailyBonus();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to claim bonus');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900"><div className="text-white text-xl">Loading...</div></div>;
  }

  const menuItems = [
    { name: 'Deposit', icon: FaArrowDown, color: 'text-green-400', bg: 'bg-green-500/20', action: () => navigate('/wallet') },
    { name: 'Withdraw', icon: FaArrowUp, color: 'text-red-400', bg: 'bg-red-500/20', action: () => navigate('/wallet') },
    { name: 'Wallet', icon: FaWallet, color: 'text-yellow-400', bg: 'bg-yellow-500/20', action: () => navigate('/wallet') },
    { name: 'Bonus', icon: FaGift, color: 'text-pink-400', bg: 'bg-pink-500/20', action: () => navigate('/activity') },
    { name: 'Game History', icon: FaHistory, color: 'text-blue-400', bg: 'bg-blue-500/20', action: () => navigate('/transactions') },
    { name: 'Transaction', icon: FaChartLine, color: 'text-purple-400', bg: 'bg-purple-500/20', action: () => navigate('/transactions') },
    { name: 'Commission', icon: FaWallet, color: 'text-green-400', bg: 'bg-green-500/20', action: () => navigate('/promotion') },
    { name: 'VIP Benefits', icon: FaCrown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', action: () => alert('VIP Level: ' + (vipInfo?.vipLevel || 1) + '\nWithdrawal Limit: ₹' + (vipInfo?.withdrawalLimit || 10000) + '\nBonus: ' + (vipInfo?.bonusPercent || 0) + '%') },
    { name: 'Coupons', icon: FaGift, color: 'text-pink-400', bg: 'bg-pink-500/20', action: () => navigate('/coupon') },
    { name: 'Leaderboard', icon: FaTrophy, color: 'text-yellow-400', bg: 'bg-yellow-500/20', action: () => navigate('/leaderboard') },
    { name: 'Daily Bonus', icon: FaCalendarCheck, color: 'text-green-400', bg: 'bg-green-500/20', action: () => navigate('/daily-bonus') },
  ];

  const serviceItems = [
    { name: 'Daily Bonus', icon: FaCalendarCheck, action: () => dailyBonus?.canClaim ? claimDailyBonus() : alert('Already claimed today! Come back tomorrow!') },
    { name: 'Settings', icon: FaCog, action: () => alert('Settings coming soon!') },
    { name: 'About Us', icon: FaInfoCircle, action: () => alert('Diamond 11 - Best Gaming Platform\nVersion 1.0.0') },
    { name: 'Feedback', icon: FaCommentDots, action: () => alert('Feedback feature coming soon!') },
  ];

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="My Account" backLink="/home" />
      <div className="p-4 text-white">
        {/* VIP Card */}
        {vipInfo && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaCrown className="text-2xl text-purple-900" />
                <span className="text-purple-900 font-bold text-lg">VIP {vipInfo.vipLevel}</span>
              </div>
              <span className="text-purple-900 text-sm">{vipInfo.bonusPercent}% Bonus</span>
            </div>
            <div className="bg-purple-900/30 rounded-full h-3 mb-2">
              <div 
                className="bg-purple-900 h-3 rounded-full transition-all duration-500"
                style={{ width: `${vipInfo.progressToNext}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-purple-900">
              <span>Exp: {vipInfo.vipExp}</span>
              <span>Next: {vipInfo.nextLevelExp}</span>
            </div>
          </div>
        )}

        {/* Daily Bonus Card */}
        {dailyBonus && (
          <div 
            onClick={dailyBonus.canClaim ? claimDailyBonus : null}
            className={`rounded-xl p-4 mb-6 shadow-lg ${dailyBonus.canClaim ? 'bg-gradient-to-r from-green-500 to-emerald-500 cursor-pointer' : 'bg-gray-700'} transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaCalendarCheck className="text-2xl text-white" />
                <div>
                  <p className="text-white font-bold">Daily Bonus</p>
                  <p className="text-white/80 text-sm">Streak: {dailyBonus.currentStreak} days 🔥</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">₹{dailyBonus.todayBonus}</p>
                <p className="text-white/80 text-xs">{dailyBonus.canClaim ? 'Tap to claim!' : 'Claimed!'}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-purple-800/50 rounded-xl p-4 mb-6 border border-purple-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-purple-900 font-bold text-2xl">
                {user?.uid?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-white text-lg font-bold">UID: {user?.uid || 'N/A'}</p>
                <p className="text-purple-300 text-xs">Last login: {new Date(user?.lastLogin || Date.now()).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">VIP {user?.vipLevel || 1}</div>
          </div>
          <div className="flex items-center justify-between bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-300 text-sm">Total Balance</p>
            <p className="text-yellow-400 text-2xl font-bold">₹{user?.balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Main Options Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="flex flex-col items-center text-center p-2 hover:scale-105 transition-transform active:scale-95"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-2 ${item.color}`}>
                <item.icon className="text-xl" />
              </div>
              <span className="text-xs text-white">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Service Center */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
            <span className="text-yellow-400">🎧</span> Service Center
          </h3>
          <div className="bg-purple-800/50 rounded-xl border border-purple-600">
            {serviceItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 border-b border-purple-700/50 last:border-b-0 hover:bg-purple-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="text-xl text-purple-300" />
                  <span className="text-white">{item.name}</span>
                </div>
                <span className="text-purple-300">&gt;</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <FaSignOutAlt /> Logout
        </button>

        {/* App Info */}
        <div className="mt-6 text-center text-purple-300 text-xs">
          <p>Diamond 11 v1.0.0</p>
          <p className="mt-1">© 2024 All Rights Reserved</p>
        </div>
      </div>
      <BottomNav activeTab="account" />
    </div>
  );
};

export default Account;