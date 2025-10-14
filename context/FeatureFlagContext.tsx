import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPublicFeatureFlags, FeatureFlags } from '@/api/features';

interface FeatureFlagContextType {
  flags: FeatureFlags | null;
  isLoading: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider = ({ children }: { children: React.ReactNode }) => {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const fetchedFlags = await getPublicFeatureFlags();
        setFlags(fetchedFlags);
      } catch (error) {
        console.error("Could not load feature flags", error);
        // Set to a default disabled state on error
        setFlags({ food_ordering_enabled: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const value = { flags, isLoading };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};
