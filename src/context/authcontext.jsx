import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else if (adminToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
      setAdmin(JSON.parse(localStorage.getItem('adminData') || '{}'));
    }
    setLoading(false);

    const handleMessage = (event) => {
      if (event.data?.type === 'UPDATE_BALANCE') {
        const newBalance = event.data.payload?.newBalance;
        if (newBalance !== undefined) {
          setUser(prev => prev ? { ...prev, balance: newBalance } : null);
          localStorage.setItem('userBalance', newBalance.toString());
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/profile`);
      setUser(res.data.user);
      if (res.data.user?.balance !== undefined) {
        localStorage.setItem('userBalance', res.data.user.balance.toString());
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // ✅ refreshBalance function - ye missing tha!
  const refreshBalance = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/wallet/balance`);
      if (res.data.success) {
        const newBalance = res.data.data.balance;
        setUser(prev => prev ? { ...prev, balance: newBalance } : null);
        localStorage.setItem('userBalance', newBalance.toString());
        return newBalance;
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
    return null;
  }, []);

  const login = async (phone, password) => {
    try {
      const isPhone = /^\d{10}$/.test(phone);
      const body = isPhone ? { phone, password } : { uid: phone, password };
      const res = await axios.post(`${API_URL}/auth/login`, body);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        if (res.data.user?.balance !== undefined) {
          localStorage.setItem('userBalance', res.data.user.balance.toString());
        }
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Network error' };
    }
  };

  const register = async (phone, password, referralCode) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { phone, password, referralCode });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Network error' };
    }
  };

  const adminLogin = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { username, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminData', JSON.stringify(res.data.admin));
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userBalance');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser?.balance !== undefined) {
      localStorage.setItem('userBalance', newUser.balance.toString());
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      loading,
      login,
      register,
      adminLogin,
      logout,
      adminLogout,
      updateUser,
      refreshBalance  // ✅ Export kiya!
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);