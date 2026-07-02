import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authcontext';

const API_URL = 'https://diamond11-backend.onrender.com';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { adminLogin } = useAuth(); // AuthContext se function le rahe hain

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 🚀 Direct Backend URL Pe Request
      const res = await axios.post(`${API_URL}/api/admin/login`, {
        username,
        password
      });

      // Agar login successful hai
      if (res && res.data && res.data.success) {
        // Token aur data save karo
        adminLogin(res.data.admin || res.data.data, res.data.token);
        
        // Dashboard pe redirect karo
        navigate('/admin/dashboard');
      } else {
        // Agar backend bole login fail hua
        setError(res?.data?.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      // 🔥 Crash hone se bachaane ke liye safe error handling
      setError(err.response?.data?.message || 'Invalid Username or Password / Server Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Panel</h2>
        
        {/* Error Message Dikhane Ke Liye */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg transition-colors ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;