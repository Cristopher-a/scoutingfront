import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          height: 80, 
          paddingVertical: 10, 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'DASHBOARD',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/dash.jpg')}
              style={{
                width: 36,
                height: 36,
               
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'PITS',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/pits.jpg')}
              style={{
                width: 36,
                height: 36,
              
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'MATCH',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/match.jpg')}
              style={{
                width: 36,
                height: 36,
               
              }}
            />
          ),
        }}
      />

  
    </Tabs>
  );
}
