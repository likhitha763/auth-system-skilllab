import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, getProfile } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // On mount: restore session from localStorage token
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await getProfile();
          setUser(data.user);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const register = useCallback(async (formData) => {
    setError(null);
    const { data } = await registerUser(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(async (formData) => {
    setError(null);
    const { data } = await loginUser(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await getProfile();
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
