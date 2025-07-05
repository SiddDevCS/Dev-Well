import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

type PermissionFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const permissionFeatures: PermissionFeature[] = [
  {
    id: 'wellness',
    title: 'Wellness reminders',
    description: 'Gentle nudges for your break times and breathing exercises',
    icon: 'heart',
  },
  {
    id: 'streak',
    title: 'Streak celebrations',
    description: 'Celebrate your progress and maintain momentum',
    icon: 'trophy',
  },
  {
    id: 'insights',
    title: 'Weekly insights',
    description: 'Discover patterns in your work and wellness habits',
    icon: 'bar-chart',
  },
];

export default function PermissionsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you'd request push notification permissions here
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate permission granted
      console.log('Push notifications enabled');
      router.push('./final');
    } catch (error) {
      Alert.alert(
        'Notifications Not Enabled',
        'You can still use DevWell! You can enable notifications later in your device settings.',
        [
          { text: 'OK', onPress: () => router.push('./final') }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('./final');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <FontAwesome name="bell" size={24} color="white" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Stay connected
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            We'll only remind you about your wellness goals — no spam, ever.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {permissionFeatures.map((feature) => (
            <View
              key={feature.id}
              style={[
                styles.featureCard,
                { backgroundColor: colors.surface, borderColor: colors.border }
              ]}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
                  <FontAwesome 
                    name={feature.icon as any} 
                    size={18} 
                    color={colors.primary}
                  />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.placeholder }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Privacy Note */}
        <View style={[styles.privacyNote, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="shield" size={16} color={colors.secondary} />
          <Text style={[styles.privacyText, { color: colors.text }]}>
            We respect your privacy. You can customize or disable notifications anytime in settings.
          </Text>
        </View>

        {/* Enable Button */}
        <TouchableOpacity
          style={[
            styles.enableButton,
            { backgroundColor: colors.primary },
            isLoading && { opacity: 0.7 }
          ]}
          onPress={handleEnableNotifications}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.enableButtonText}>
            {isLoading ? 'Enabling...' : 'Enable Notifications'}
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={[styles.skipButtonText, { color: colors.placeholder }]}>
            Maybe later
          </Text>
        </TouchableOpacity>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={[styles.footerText, { color: colors.placeholder }]}>
            You can always enable notifications later in your device settings or within the app
          </Text>
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
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    paddingHorizontal: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
  },
  enableButton: {
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  enableButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerNote: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
}); 