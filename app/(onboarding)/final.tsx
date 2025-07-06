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
import { StorageService } from '../(tabs)/storage';
import OnboardingProgress from '@/components/OnboardingProgress';

const { width, height } = Dimensions.get('window');

export default function FinalScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleStart = async () => {
    try {
      // Mark onboarding as completed
      await StorageService.setOnboardingCompleted();
      
      // Navigate to auth for registration/login
      router.push('/(auth)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still navigate to auth even if storage fails
      router.push('/(auth)');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Progress Indicator */}
      <OnboardingProgress currentStep={8} totalSteps={8} />
      
      <View style={styles.content}>
        {/* Success Section */}
        <View style={styles.successSection}>
          <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
            <FontAwesome name="check" size={32} color="white" />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Perfect! You're ready to thrive 🚀
          </Text>
          
          <Text style={[styles.message, { color: colors.placeholder }]}>
            Your personalized wellness plan is ready! Sign up now to save your preferences and join thousands of developers building healthier habits.
          </Text>
          
          {/* Social Proof */}
          <View style={[styles.socialProofBox, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <FontAwesome name="users" size={16} color={colors.primary} />
            <Text style={[styles.socialProofText, { color: colors.text }]}>
              Join 10,000+ devs improving their wellbeing
            </Text>
          </View>
        </View>

        {/* Features Summary */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome name="clock-o" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>
              Smart break reminders
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.secondary + '20' }]}>
              <FontAwesome name="heart" size={18} color={colors.secondary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>
              Personalized wellness routines
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome name="bar-chart" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>
              Progress tracking & insights
            </Text>
          </View>
        </View>

        {/* Encouraging Message */}
        <View style={styles.encouragementSection}>
          <Text style={[styles.encouragementText, { color: colors.placeholder }]}>
            Remember: Small consistent actions lead to big changes. 
            You don't need to be perfect—just consistent.
          </Text>
        </View>

        {/* Start Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>
              Sign Up to Continue
            </Text>
            <FontAwesome name="arrow-right" size={16} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.placeholder }]}>
            Welcome to DevWell! 🌿
          </Text>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    fontWeight: '400',
    marginBottom: 20,
  },
  socialProofBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
  socialProofText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
  },
  encouragementSection: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  encouragementText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  buttonSection: {
    marginBottom: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  buttonIcon: {
    marginLeft: 2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 