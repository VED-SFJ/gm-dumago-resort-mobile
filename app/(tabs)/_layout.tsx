import CustomTabBar from '@/components/CustomTabBar';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
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