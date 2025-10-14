// gm-dumago-resort-mobile/app/(admin)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function AdminLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scanner" options={{ presentation: 'modal' }}/>
      <Stack.Screen name="bookings" options={{ presentation: 'modal' }}/>
    </Stack>
  );
}
