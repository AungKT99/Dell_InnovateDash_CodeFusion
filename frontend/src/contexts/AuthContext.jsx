<<<<<<< Updated upstream
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', userData);
      
      const { user, token } = response.data;
      setUser(user);
      setAuthToken(token);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', credentials);
      
      const { user, token } = response.data;
      setUser(user);
      setAuthToken(token);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  // Load user from token on app start
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setAuthToken(token);
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to load user:', error);
        // Token might be invalid, remove it
        setAuthToken(null);
      }
    }
    setLoading(false);
  };

  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/userApi';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const result = await authAPI.register(userData);
      
      if (result.success) {
        const { user, token } = result.data;
        setUser(user);
        authAPI.setAuthToken(token);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const result = await authAPI.login(credentials);
      
      if (result.success) {
        const { user, token } = result.data;
        setUser(user);
        authAPI.setAuthToken(token);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    authAPI.removeAuthToken();
  };

  // Load user from token on app start
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      authAPI.setAuthToken(token);
      
      const result = await authAPI.getCurrentUser();
      
      if (result.success) {
        setUser(result.data.user);
      } else {
        console.error('Failed to load user:', result.error);
        // Token might be invalid, remove it
        authAPI.removeAuthToken();
      }
    }
    
    setLoading(false);
  };

  // Refresh user data (useful for profile updates)
  const refreshUser = async () => {
    const result = await authAPI.getCurrentUser();
    
    if (result.success) {
      setUser(result.data.user);
      return result;
    } else {
      setError(result.error);
      return result;
    }
  };

  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshUser,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
>>>>>>> Stashed changes
};