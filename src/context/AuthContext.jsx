import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('voxflow_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Load user profile on startup if token is present
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getMe();
        if (data?.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data?.token) {
      localStorage.setItem('voxflow_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    if (data?.token) {
      localStorage.setItem('voxflow_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  };

  const logout = () => {
    localStorage.removeItem('voxflow_token');
    setToken(null);
    setUser(null);
    setProfileModalOpen(false);
  };

  const openAuth = (reason = '') => {
    setAuthModalReason(reason);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
    setAuthModalReason('');
  };

  const openProfile = () => {
    setProfileModalOpen(true);
  };

  const closeProfile = () => {
    setProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        authModalOpen,
        authModalReason,
        profileModalOpen,
        login,
        register,
        logout,
        openAuth,
        closeAuth,
        openProfile,
        closeProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
