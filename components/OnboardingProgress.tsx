import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  title?: string;
}

export default function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  title 
}: OnboardingProgressProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Step counter */}
      <View style={styles.stepCounter}>
        <Text style={[styles.stepText, { color: colors.placeholder }]}>
          Step {currentStep} of {totalSteps}
        </Text>
        {title && (
          <Text style={[styles.titleText, { color: colors.text }]}>
            {title}
          </Text>
        )}
      </View>
      
      {/* Progress bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.primary,
              width: `${progressPercentage}%`
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  stepCounter: {
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
}); 