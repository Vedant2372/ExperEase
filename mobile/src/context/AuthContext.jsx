import { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo, getStoredToken, setStoredToken } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoredToken().then((token) => {
      if (!token) {
        setLoading(false);
        return;
      }
      getUserInfo()
        .then((data) => setUser(data))
        .catch(() => {
          setStoredToken(null);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const login = async (token, userData) => {
    await setStoredToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await setStoredToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
