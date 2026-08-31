import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  login as loginApi,
  verifyLogin2fa,
  getCurrentUser,
  getMe,
  isAuthenticated as hasToken,
  logout as logoutApi,
} from '../services/authService';
import { SESSION_EXPIRED_EVENT, forceSessionLogout } from '../utils/apiConfig';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  phone?: string;
  kycStatus?: string;
  profileImage?: string;
  bio?: string;
  isFullAdmin?: boolean;
  isStaffAdmin?: boolean;
  adminPermissions?: string[];
  totpEnabled?: boolean;
}

type LoginResult =
  | { success: true; requires2fa?: false }
  | { success: true; requires2fa: true; tempToken: string; message?: string }
  | { success: false; message?: string };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  complete2fa: (tempToken: string, code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onSessionExpired = () => setUser(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const storedUser = getCurrentUser();
        if (storedUser && hasToken()) {
          try {
            const me = await getMe();
            if (!cancelled && me?.user) {
              const nextUser = {
                ...me.user,
                kycStatus: (me.user as User).kycStatus || 'incomplete',
              } as User;
              setUser(nextUser);
              localStorage.setItem('user', JSON.stringify(nextUser));
            }
          } catch {
            // 401/403: interceptor clears token and redirects home
            if (!hasToken()) {
              if (!cancelled) setUser(null);
              return;
            }
            // Transient network errors: keep cached session
            if (!cancelled) setUser(storedUser as User);
          }
        } else if (storedUser && !hasToken()) {
          forceSessionLogout('/');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await loginApi({ email, password });
      if (response.requires2fa && response.tempToken) {
        return {
          success: true,
          requires2fa: true,
          tempToken: response.tempToken,
          message: response.message,
        };
      }
      if (response.success && response.user) {
        setUser(response.user as User);
        return { success: true };
      }
      return { success: false, message: response.message || 'Invalid email or password' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const complete2fa = async (tempToken: string, code: string) => {
    try {
      const response = await verifyLogin2fa({ tempToken, code });
      if (response.success && response.user) {
        setUser(response.user as User);
        return { success: true };
      }
      return { success: false, message: response.message || 'Invalid code' };
    } catch (error: any) {
      return { success: false, message: error.message || '2FA failed' };
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    complete2fa,
    logout,
    setUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
