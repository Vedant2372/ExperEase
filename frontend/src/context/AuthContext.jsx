import { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const workerData = localStorage.getItem('worker');
    if (workerData) {
      try {
        setWorker(JSON.parse(workerData));
      } catch {}
    }
    if (!token) {
      setLoading(false);
      return;
    }
    getUserInfo()
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setWorker(null);
    localStorage.removeItem('worker');
  };

  const loginWorker = (workerData) => {
    localStorage.removeItem('token');
    setUser(null);
    setWorker(workerData);
    localStorage.setItem('worker', JSON.stringify(workerData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('worker');
    setUser(null);
    setWorker(null);
  };

  return (
    <AuthContext.Provider value={{ user, worker, loading, login, loginWorker, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
