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

const { width, height } = Dimensions.get('window');

export default function FinalScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleStart = () => {
    // Navigate to the main app
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.content}>
        {/* Success Section */}
        <View style={styles.successSection}>
          <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
            <FontAwesome name="check" size={40} color="white" />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            You're all set!
          </Text>
          
          <Text style={[styles.message, { color: colors.placeholder }]}>
            You're all set. Let's build a healthier you, one line of code at a time.
          </Text>
        </View>

        {/* Features Summary */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome name="clock-o" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>
              Smart break reminders
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.secondary + '20' }]}>
              <FontAwesome name="heart" size={20} color={colors.secondary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>
              Personalized wellness routines
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <FontAwesome name="bar-chart" size={20} color={colors.primary} />
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
              Start Your Journey
            </Text>
            <FontAwesome name="arrow-right" size={20} color="white" style={styles.buttonIcon} />
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
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  featuresSection: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  encouragementSection: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  encouragementText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  buttonSection: {
    marginBottom: 20,
  },
  startButton: {
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
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 