import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  preferences: UserPreferences | null;
  stats: { completedLessons: number; overallMastery: number; achievementsUnlocked: number } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [stats, setStats] = useState<{ completedLessons: number; overallMastery: number; achievementsUnlocked: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setPreferences(null);
      setStats(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.get<{ user: User; preferences: UserPreferences; stats: any }>('/users/me');
      setUser(data.user);
      setPreferences(data.preferences);
      setStats(data.stats);
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      removeAuthToken();
      setUser(null);
      setPreferences(null);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
      setAuthToken(data.token);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<{ token: string; user: User }>('/auth/signup', { name, email, password });
      setAuthToken(data.token);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setPreferences(null);
    setStats(null);
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!user) return;
    const data = await api.put<{ user: User; preferences: UserPreferences }>('/users/me', newPrefs);
    setUser(data.user);
    setPreferences(data.preferences);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        stats,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
