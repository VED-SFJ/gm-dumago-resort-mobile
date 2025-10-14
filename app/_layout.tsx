// gm-dumago-resort-mobile/app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { FeatureFlagProvider } from '@/context/FeatureFlagContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();

      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else if (!isAuthenticated) {
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated]);

  // While the AuthContext is loading, we render nothing.
  if (isLoading) {
    return null;
  }

  // Once loading is complete, render the stack navigator.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="adminLogin" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="menu" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="addPoints" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="usePoints" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="activities" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="adminScanner" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="cart" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="digitalKey" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="chat" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="map" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="productDetail" options={{ headerShown: false, presentation: 'modal' }} />

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <FeatureFlagProvider>
        <RootLayoutNav />
      </FeatureFlagProvider>
    </AuthProvider>
  );
}
