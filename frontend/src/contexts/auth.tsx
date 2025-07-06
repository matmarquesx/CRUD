import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authService } from '../services/api.ts';
import { Usuario } from '../types';

interface AuthContextData {
  signed: boolean;
  user: Usuario | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedUser = localStorage.getItem('@App:user');
      const storedToken = localStorage.getItem('@App:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function login(username: string, password: string) {
    try {
      const response = await authService.login(username, password);
      
      setUser(response.user);
      
      localStorage.setItem('@App:user', JSON.stringify(response.user));
      localStorage.setItem('@App:token', response.token);
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:token');
    setUser(null);
  }

  function isAdmin() {
    return user?.tipo === '0';
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
