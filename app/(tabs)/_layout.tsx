// gm-dumago-resort-mobile/app/(tabs)/_layout.tsx
import CustomTabBar from '@/components/CustomTabBar';
import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading spinner while the auth state is being determined
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If not authenticated and not loading, redirect to the guest login screen
  if (!isAuthenticated) {
    console.log("TabLayout Guard: Not authenticated. Redirecting to /login.");
    return <Redirect href="/login" />;
  }

  // If authenticated, render the tabs. The user is now "in" the main app.
  console.log("TabLayout Guard: Authenticated. Rendering tabs.");
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIconName: 'home'
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIconName: 'calendar-check-o'
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIconName: 'cutlery'
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIconName: 'user-circle-o'
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Or your app's background color
    }
});
