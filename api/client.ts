import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'gmdpr_jwt_token';

// change at prod
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.48:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to dynamically add the auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper functions for storing and clearing the token
export const storeToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const clearToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export default apiClient;
