import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FaLock, FaBell, FaLanguage, FaMoon, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      
      if (res.data.success) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900">
      <Header title="Settings" backLink="/account" />
      <div className="p-4 text-white">
        {/* Change Password */}
        <div className="bg-purple-800/50 rounded-xl p-4 mb-4 border border-purple-600">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaLock className="text-yellow-400" /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-sm text-purple-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-purple-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm text-purple-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-purple-900/50 border border-purple-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 py-3 rounded-xl font-bold text-purple-900 disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Other Settings (Placeholder) */}
        <div className="bg-purple-800/50 rounded-xl border border-purple-600 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-purple-700/50 hover:bg-purple-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <FaBell className="text-xl text-purple-300" />
              <span>Notifications</span>
            </div>
            <span className="text-purple-300">&gt;</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-purple-700/50 hover:bg-purple-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <FaLanguage className="text-xl text-purple-300" />
              <span>Language</span>
            </div>
            <span className="text-purple-300">&gt;</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-purple-700/50 hover:bg-purple-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <FaMoon className="text-xl text-purple-300" />
              <span>Dark Mode</span>
            </div>
            <span className="text-green-400">ON</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-purple-700/50 hover:bg-purple-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-xl text-purple-300" />
              <span>Privacy & Security</span>
            </div>
            <span className="text-purple-300">&gt;</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-purple-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <FaQuestionCircle className="text-xl text-purple-300" />
              <span>Help & Support</span>
            </div>
            <span className="text-purple-300">&gt;</span>
          </button>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center text-purple-300 text-xs">
          <p className="font-bold">Diamond 11</p>
          <p>Version 1.0.0</p>
          <p className="mt-2">© 2024 All Rights Reserved</p>
        </div>
      </div>
      <BottomNav activeTab="account" />
    </div>
  );
};

export default Settings;