import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function OnboardingLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
      }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="personalization" />
      <Stack.Screen name="profiling" />
      <Stack.Screen name="routine" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="final" />
    </Stack>
  );
} 