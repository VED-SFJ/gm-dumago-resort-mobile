import apiClient from './client';

export interface FeatureFlags {
  food_ordering_enabled: boolean;
}

/**
 * Fetches the public feature flags from the backend.
 * Corresponds to GET /reservations/options/features
 */
export const getPublicFeatureFlags = async (): Promise<FeatureFlags> => {
  try {
    const response = await apiClient.get<FeatureFlags>('/reservations/options/features');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch feature flags:", error);
    return {
      food_ordering_enabled: false,
    };
  }
};
