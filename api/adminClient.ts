// gm-dumago-resort-mobile/api/adminClient.ts
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.48:8000';

const ADMIN_API_KEY = process.env.EXPO_PUBLIC_ADMIN_API_KEY;

if (!ADMIN_API_KEY) {
  console.error("CRITICAL ERROR: EXPO_PUBLIC_ADMIN_API_KEY is not set in the environment variables.");
}

const adminApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': ADMIN_API_KEY,
  },
});

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      'Admin API Request Failed:',
      {
        url: error.config.url,
        method: error.config.method,
        status: error.response?.status,
        data: error.response?.data,
      }
    );
    return Promise.reject(error);
  }
);


export default adminApiClient;
