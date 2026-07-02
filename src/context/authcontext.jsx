import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://diamond11-backend.onrender.com';

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

  const [loading, setLoading] = useState(false); // ✅ false rakha - block nahi karega

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) localStorage.setItem('token', token);
  };

  // Admin login function
  const adminLogin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    if (token) localStorage.setItem('adminToken', token);
  };

  // Update user (balance etc.)
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  // Optional: Background mein user verify karo (block NAHI karega)
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success && res.data.data) {
          updateUser(res.data.data);
        }
      } catch (error) {
        // Token invalid - silently ignore, user will be redirected by ProtectedRoute
      }
    };
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        login,
        adminLogin,
        logout,
        updateUser,
        setUser,
        setAdmin
      }}
    >
      {children}  {/* ✅ HAMESHA render hoga - koi loading block nahi */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Agar context na mile toh crash mat karo, empty values do
    return {
      user: null,
      admin: null,
      loading: false,
      login: () => {},
      adminLogin: () => {},
      logout: () => {},
      updateUser: () => {},
      setUser: () => {},
      setAdmin: () => {}
    };
  }
  return context;
};

export default AuthContext;