import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://diamond11-backend.onrender.com/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ✅ USER LOGIN
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  // ✅ USER LOGIN API CALL
  const loginUser = async (phone, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        phone,
        password
      });

      if (res.data && res.data.success) {
        const token = res.data.token;
        const userData = res.data.user || res.data.data;
        
        login(userData, token);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: res.data?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login Error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Network error. Please try again.' 
      };
    }
  };

  // ✅ REGISTER FUNCTION (Ye missing tha!)
  const register = async (phone, password, referralCode = '') => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        phone,
        password,
        referralCode: referralCode || undefined
      });

      if (res.data && res.data.success) {
        const token = res.data.token;
        const userData = res.data.user || res.data.data;
        
        // Auto login after register
        login(userData, token);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: res.data?.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Register Error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Network error. Please try again.' 
      };
    }
  };

  // ✅ ADMIN LOGIN
  const adminLogin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    if (token) {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('token', token); // Both keys for compatibility
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  // ✅ ADMIN LOGOUT
  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/admin/login';
  };

  // ✅ UPDATE USER
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading: false,
        login,
        loginUser,       // ✅ NEW
        register,        // ✅ NEW - Ye missing tha!
        adminLogin,
        adminLogout,     // ✅ NEW
        logout,
        updateUser,
        setUser,
        setAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      admin: null,
      loading: false,
      login: () => {},
      loginUser: async () => ({ success: false, message: 'Auth not initialized' }),
      register: async () => ({ success: false, message: 'Auth not initialized' }),
      adminLogin: () => {},
      adminLogout: () => {},
      logout: () => {},
      updateUser: () => {},
      setUser: () => {},
      setAdmin: () => {}
    };
  }
  return context;
};

export default AuthContext;