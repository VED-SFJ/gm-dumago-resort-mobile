// gm-dumago-resort-mobile/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';
import { User } from '@/models/api';

// The API sends a user object with `_id`, but our app uses `id`.
// This interface represents the raw data from the server.
interface UserFromApi {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Define UserLogin here if not already correctly defined in models/api
interface UserLogin {
  email: string;
  password?: string;
}

const TOKEN_KEY = 'gmdpr_jwt_token';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: UserLogin) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- HELPER FUNCTION TO MAP BACKEND DATA TO FRONTEND MODEL ---
const transformUserData = (apiUser: UserFromApi): User => {
  return {
    id: apiUser._id,
    username: apiUser.username,
    email: apiUser.email,
    role: apiUser.role,
    created_at: apiUser.created_at,
    updated_at: apiUser.updated_at,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data: apiUser } = await apiClient.get<UserFromApi>('/users/me');

          // Transform the data before setting the state
          const appUser = transformUserData(apiUser);
          setUser(appUser);
          console.log(`AuthContext: Session restored for user "${appUser.username}" with ID: ${appUser.id}`);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('AuthContext: Failed to restore session.', error);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (credentials: UserLogin): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { access_token } = response.data;
      if (!access_token) throw new Error('No token from backend.');

      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const { data: apiUser } = await apiClient.get<UserFromApi>('/users/me');

      // Transform the data before setting the state
      const appUser = transformUserData(apiUser);
      setUser(appUser);
      console.log(`AuthContext: Login successful for "${appUser.username}" with ID: ${appUser.id}`);
      return appUser;
    } catch (error: any) {
      console.error('AuthContext: Login failed:', error.response?.data || error.message);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      delete apiClient.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('AuthContext: Logout failed:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
