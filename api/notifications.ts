import apiClient from './client';
import { Notification } from '@/models/api';

/**
 * Fetches notifications for the current user with pagination.
 * Corresponds to GET /notifications/
 * @param page - The page number to fetch.
 * @param limit - The number of notifications per page.
 */
export const getMyNotifications = async (page = 1, limit = 15): Promise<Notification[]> => {
  try {
    const response = await apiClient.get<Notification[]>('/notifications/', {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch notifications for page ${page}:`, error.response?.data || error.message);
    throw error;
  }
};
