import React, { createContext, useContext, useState } from 'react';

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

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) localStorage.setItem('token', token);
  };

  const adminLogin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    if (token) localStorage.setItem('adminToken', token);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading: false, // Always false to prevent blocking
        login,
        adminLogin,
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