import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function AuthWelcome() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <FontAwesome name="leaf" size={40} color="white" />
        </View>
        
        <Text style={[styles.appTitle, { color: colors.text }]}>DevWell</Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Wellness breaks for productive developers
        </Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <FontAwesome name="clock-o" size={16} color={colors.secondary} />
            <Text style={[styles.featureText, { color: colors.placeholder }]}>
              Smart break reminders
            </Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="heart" size={16} color={colors.secondary} />
            <Text style={[styles.featureText, { color: colors.placeholder }]}>
              Mindful exercises
            </Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="bar-chart" size={16} color={colors.secondary} />
            <Text style={[styles.featureText, { color: colors.placeholder }]}>
              Productivity insights
            </Text>
          </View>
        </View>
      </View>

      {/* Auth Options */}
      <View style={styles.authSection}>
        {/* OAuth Buttons */}
        <TouchableOpacity 
          style={[styles.oauthButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <FontAwesome name="google" size={20} color="#4285F4" />
          <Text style={[styles.oauthText, { color: colors.text }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.oauthButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <FontAwesome name="apple" size={20} color={colors.text} />
          <Text style={[styles.oauthText, { color: colors.text }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.placeholder }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        {/* Email/Password Buttons */}
        <Link href="./login" asChild>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Sign in with Email</Text>
          </TouchableOpacity>
        </Link>

        <Link href="./signup" asChild>
          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: colors.secondary }]}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </Link>

        {/* Temporary Button - Test Onboarding */}
        <TouchableOpacity
          style={[styles.tempButton, { backgroundColor: colors.primary + '40', borderColor: colors.primary }]}
          onPress={() => router.push('/(onboarding)/welcome')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tempButtonText, { color: colors.primary }]}>
            🚀 Try Onboarding Flow (Temporary)
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.placeholder }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
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
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featureContainer: {
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
  },
  authSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  oauthText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    paddingHorizontal: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  tempButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tempButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 