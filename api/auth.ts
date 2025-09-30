// api/auth.ts
import * as SecureStore from 'expo-secure-store';

const ADMIN_TOKEN_KEY = 'admin_jwt_token';

// Simulates logging in an admin
export async function loginAdmin(username, password): Promise<string | null> {
  if (username.toLowerCase() === 'superadmin' && password === 'admin') {
    const fakeToken = `fake-jwt-token-for-${username}-${Date.now()}`;
    await SecureStore.setItemAsync(ADMIN_TOKEN_KEY, fakeToken);
    return fakeToken;
  }
  return null;
}

// Checks if a valid admin token is stored
export async function getAdminToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(ADMIN_TOKEN_KEY);
}

// Securely logs out the admin
export async function logoutAdmin(): Promise<void> {
  await SecureStore.deleteItemAsync(ADMIN_TOKEN_KEY);
}

// Simulates finding a customer booking
export async function findCustomerBooking(reservationId, lastName): Promise<boolean> {
    if (reservationId && lastName) {
        return true;
    }
    return false;
}