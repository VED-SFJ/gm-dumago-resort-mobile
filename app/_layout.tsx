import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; 
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ presentation: 'modal', headerShown: false }} />
      
      
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="addPoints" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="usePoints" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="activities" options={{ presentation: 'modal', headerShown: false }} />

      <Stack.Screen name="adminLogin" options={{ headerShown: false, presentation: 'modal' }} />
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