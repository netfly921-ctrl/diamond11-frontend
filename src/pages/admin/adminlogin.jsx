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
  const { adminLogin } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // ✅ FIXED URL - /api/admin/login (backend route match)
      const res = await axios.post(`${API_URL}/api/admin/login`, {
        username,
        password
      });

      console.log('Login Response:', res.data); // Debug

      if (res && res.data && res.data.success) {
        const token = res.data.token;
        const adminData = res.data.admin || res.data.data || { username };
        
        // ✅ Token ko MULTIPLE keys me save karo (compatibility)
        localStorage.setItem('token', token);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('admin', JSON.stringify(adminData));
        
        // ✅ Axios default header set karo
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Context update
        if (adminLogin) {
          adminLogin(adminData, token);
        }
        
        // Dashboard redirect
        navigate('/admin/dashboard');
      } else {
        setError(res?.data?.message || 'Login failed');
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      setError(err.response?.data?.message || 'Invalid Username or Password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Panel</h2>
        
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