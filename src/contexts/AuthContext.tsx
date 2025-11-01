import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { setAuthLogoutCallback } from '../api/index';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize token from localStorage on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setTokenState(storedToken);
    }
    setIsLoading(false);
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      // Clear all auth-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      // Clear any other auth-related data that might be stored
      localStorage.clear();
    }
  };

  const logout = () => {
    setToken(null);
  };

  // Register logout function with API interceptor for network error handling
  useEffect(() => {
    setAuthLogoutCallback(logout);
  }, []);

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth AuthProvider daxilində istifadə olunmalıdır');
  }
  return context;
};
