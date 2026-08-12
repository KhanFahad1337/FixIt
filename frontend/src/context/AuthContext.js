import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

import API from '../config';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        const url = err.config?.url || '';
        const isAuthRoute = url.includes('/auth/');
        if (err.response?.status === 401 && !isAuthRoute) {
          setSessionExpired(true);
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
          setSessionExpired(true);
          setLoading(false);
          return;
        }
      } catch {}
    }
  }, [token, logout]);

  useEffect(() => {
    if (token && !sessionExpired) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/auth/me`)
        .then(res => setUser(res.data))
        .catch(() => { logout(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, sessionExpired, logout]);

  const clearSession = () => {
    setSessionExpired(false);
    logout();
  };

  const login = async (email, password, role) => {
    const endpoint = role === 'provider' ? 'auth/provider/login' : role === 'admin' ? 'auth/admin/login' : role === 'subadmin' ? 'auth/subadmin/login' : 'auth/user/login';
    const res = await axios.post(`${API}/${endpoint}`, { email, password });
    sessionStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (data, role) => {
    const endpoint = role === 'provider' ? 'auth/provider/register' : 'auth/user/register';
    const res = await axios.post(`${API}/${endpoint}`, data);
    sessionStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, sessionExpired, login, register, logout, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};
