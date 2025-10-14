import apiClient from './client';
import { Reservation } from '@/models/api';

/**
 * Fetches all reservations for the currently authenticated user.
 * Corresponds to GET /reservations/
 */
export const getMyReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await apiClient.get<Reservation[]>('/reservations/');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch reservations:", error.response?.data || error.message);
    // Re-throw the error so the UI component can handle it
    throw error;
  }
};
