import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import OnboardingProgress from '@/components/OnboardingProgress';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('./personalization');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Progress Indicator */}
      <OnboardingProgress currentStep={1} totalSteps={6} />
      
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <FontAwesome name="leaf" size={50} color="white" />
          </View>
          
          <Text style={[styles.appTitle, { color: colors.text }]}>DevWell</Text>
          <Text style={[styles.tagline, { color: colors.text }]}>
            Build better code. Live better.
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.description, { color: colors.placeholder }]}>
            We get it — dev life can be intense. Let's build sustainable habits that help you thrive, not just survive.
          </Text>
          
          {/* Expectation Setting */}
          <View style={[styles.expectationBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <FontAwesome name="clock-o" size={16} color={colors.secondary} />
            <Text style={[styles.expectationText, { color: colors.text }]}>
              Takes just 2 minutes to set up!
            </Text>
          </View>
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>
              Get Started
            </Text>
            <FontAwesome name="arrow-right" size={16} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 32,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
    marginBottom: 20,
  },
  expectationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  expectationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonSection: {
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonIcon: {
    marginLeft: 8,
  },
}); 