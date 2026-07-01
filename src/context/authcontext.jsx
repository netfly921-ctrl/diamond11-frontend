import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Agar Provider ke bahar use ho raha hai, toh empty object return karo (crash nahi hoga)
    return {
      user: {},
      updateUser: () => {},
      login: () => {},
      logout: () => {},
      isAuthenticated: false
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : {};
    } catch {
      return {};
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser({});
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;