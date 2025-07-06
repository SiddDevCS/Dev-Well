import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import OnboardingProgress from '@/components/OnboardingProgress';

type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const challengeOptions: Challenge[] = [
  {
    id: 'focus',
    title: 'Staying focused',
    description: 'Distractions and context switching break your flow',
    icon: 'bullseye',
    color: '#FF6B6B',
  },
  {
    id: 'breaks',
    title: 'Taking breaks',
    description: 'Forgetting to step away from the screen',
    icon: 'pause',
    color: '#4ECDC4',
  },
  {
    id: 'stress',
    title: 'Managing stress',
    description: 'Deadlines and bugs can be overwhelming',
    icon: 'heart',
    color: '#45B7D1',
  },
  {
    id: 'posture',
    title: 'Poor posture',
    description: 'Neck and back pain from long coding sessions',
    icon: 'user',
    color: '#FFA726',
  },
  {
    id: 'sleep',
    title: 'Sleep quality',
    description: 'Late night coding affects your rest',
    icon: 'moon-o',
    color: '#9C27B0',
  },
];

export default function ChallengesScreen() {
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleContinue = () => {
    console.log('Selected challenge:', selectedChallenge);
    router.push('./routine');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Progress Indicator */}
      <OnboardingProgress currentStep={5} totalSteps={6} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <FontAwesome name="crosshairs" size={24} color="white" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            What's your biggest challenge?
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            We'll prioritize solutions that address your main pain point
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {challengeOptions.map((challenge) => (
            <TouchableOpacity
              key={challenge.id}
              style={[
                styles.option,
                {
                  backgroundColor: selectedChallenge === challenge.id 
                    ? challenge.color 
                    : colors.surface,
                  borderColor: selectedChallenge === challenge.id 
                    ? challenge.color 
                    : colors.border,
                }
              ]}
              onPress={() => setSelectedChallenge(challenge.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.optionIcon,
                  { backgroundColor: selectedChallenge === challenge.id ? 'white' : challenge.color + '20' }
                ]}>
                  <FontAwesome 
                    name={challenge.icon as any} 
                    size={20} 
                    color={selectedChallenge === challenge.id ? challenge.color : challenge.color}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionTitle,
                    { color: selectedChallenge === challenge.id ? 'white' : colors.text }
                  ]}>
                    {challenge.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    { color: selectedChallenge === challenge.id ? 'white' : colors.placeholder }
                  ]}>
                    {challenge.description}
                  </Text>
                </View>
                {selectedChallenge === challenge.id && (
                  <View style={styles.checkmark}>
                    <FontAwesome name="check" size={16} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Helper Text */}
        <View style={[styles.helperBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="info-circle" size={16} color={colors.secondary} />
          <Text style={[styles.helperText, { color: colors.text }]}>
            Don't worry - we'll help you tackle this! Most developers face similar challenges.
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <FontAwesome name="chevron-left" size={16} color={colors.text} />
            <Text style={[styles.backButtonText, { color: colors.text }]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: colors.secondary },
              selectedChallenge === '' && { opacity: 0.5 }
            ]}
            onPress={handleContinue}
            disabled={selectedChallenge === ''}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue
            </Text>
            <FontAwesome name="chevron-right" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 32,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
}); 