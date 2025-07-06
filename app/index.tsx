import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { StorageService } from './(tabs)/storage';
import auth from '@react-native-firebase/auth';

export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check onboarding and authentication status
  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check if it's first time user
        const firstTime = await StorageService.isFirstTimeUser();
        setIsFirstTime(firstTime);

        // Check if onboarding is completed
        const onboardingCompleted = await StorageService.isOnboardingCompleted();
        setIsOnboardingCompleted(onboardingCompleted);

        setIsInitializing(false);
      } catch (error) {
        console.error('Error checking app state:', error);
        setIsInitializing(false);
      }
    };

    checkAppState();
  }, []);

  // Listen to authentication state changes
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return subscriber;
  }, []);

  // Show loading while initializing
  if (isInitializing || isFirstTime === null || isOnboardingCompleted === null || isAuthenticated === null) {
    return null;
  }

  // Determine which screen to redirect to
  if (isFirstTime || !isOnboardingCompleted) {
    // First time user or onboarding not completed -> go to onboarding
    return <Redirect href="/(onboarding)/welcome" />;
  }
  
  if (isOnboardingCompleted && !isAuthenticated) {
    // Onboarding completed but not authenticated -> go to auth
    return <Redirect href="/(auth)" />;
  }
  
  if (isAuthenticated) {
    // Authenticated -> go to main app
    return <Redirect href="/(tabs)" />;
  }

  // Fallback to onboarding
  return <Redirect href="/(onboarding)/welcome" />;
} 