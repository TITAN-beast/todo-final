import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      if (storage.getToken()) {
        await authService.logout();
      }
    } catch {
      // Ignore logout errors
    } finally {
      storage.clearAuth();
      setUser(null);
      setToken(null);
    }
  }, []);

  // Initialize and verify authentication on app load
  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      const storedToken = storage.getToken();
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (isMounted && response?.data?.user) {
          setUser(response.data.user);
          storage.setUser(response.data.user);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuthStatus();

    // Global listener for 401 unauthorized events
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { user: userData, token: authToken } = response.data;

    storage.setToken(authToken);
    storage.setUser(userData);
    setUser(userData);
    setToken(authToken);

    return response;
  };

  const register = async (credentials) => {
    const response = await authService.register(credentials);
    const { user: userData, token: authToken } = response.data;

    storage.setToken(authToken);
    storage.setUser(userData);
    setUser(userData);
    setToken(authToken);

    return response;
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
