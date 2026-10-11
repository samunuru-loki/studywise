import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('studywise_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('studywise_token');
      const storedUser = localStorage.getItem('studywise_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend silently
          const res = await authApi.getCurrentUser();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('studywise_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to validate session with server:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      const authData = response.data;

      localStorage.setItem('studywise_token', authData.token);
      localStorage.setItem('studywise_user', JSON.stringify(authData));

      setToken(authData.token);
      setUser(authData);
      setIsLoading(false);
      return authData;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      const authData = response.data;

      localStorage.setItem('studywise_token', authData.token);
      localStorage.setItem('studywise_user', JSON.stringify(authData));

      setToken(authData.token);
      setUser(authData);
      setIsLoading(false);
      return authData;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('studywise_token');
    localStorage.removeItem('studywise_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
