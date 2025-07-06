import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import OnboardingProgress from '@/components/OnboardingProgress';

type Routine = {
  id: string;
  title: string;
  description: string;
  icon: string;
  frequency: string;
  enabled: boolean;
};

// Sample routine suggestions - in a real app, these would be based on user's profile
const suggestedRoutines: Routine[] = [
  {
    id: 'stretch',
    title: 'Take a 2-minute stretch',
    description: 'Simple desk stretches to relieve tension and improve posture',
    icon: 'body',
    frequency: 'Every 2 hours',
    enabled: true,
  },
  {
    id: 'breathing',
    title: 'Evening wind-down breathing',
    description: 'A calming breathing session to help you transition from work',
    icon: 'leaf',
    frequency: 'Daily at 6 PM',
    enabled: true,
  },
  {
    id: 'hydration',
    title: 'Stay hydrated',
    description: 'Gentle reminders to drink water throughout your coding day',
    icon: 'tint',
    frequency: 'Every hour',
    enabled: false,
  },
];

export default function RoutineScreen() {
  const [routines, setRoutines] = useState<Routine[]>(suggestedRoutines);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const toggleRoutine = (id: string) => {
    setRoutines(prev => 
      prev.map(routine => 
        routine.id === id ? { ...routine, enabled: !routine.enabled } : routine
      )
    );
  };

  const handleContinue = () => {
    const enabledRoutines = routines.filter(r => r.enabled);
    console.log('Selected routines:', enabledRoutines);
    router.push('./permissions');
  };

  const enabledCount = routines.filter(r => r.enabled).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Progress Indicator */}
      <OnboardingProgress currentStep={6} totalSteps={6} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.secondary }]}>
            <FontAwesome name="magic" size={24} color="white" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Your personalized habits
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Based on your answers, here are habits that will make the biggest impact
          </Text>
          
          {/* Social Proof */}
          <View style={[styles.socialProofBox, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <FontAwesome name="users" size={16} color={colors.primary} />
            <Text style={[styles.socialProofText, { color: colors.text }]}>
              Users with 2+ habits report 40% better focus
            </Text>
          </View>
        </View>

        {/* Routine Cards */}
        <View style={styles.routinesContainer}>
          {routines.map((routine) => (
            <View
              key={routine.id}
              style={[
                styles.routineCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: routine.enabled ? colors.primary : colors.border,
                },
                routine.enabled && {
                  backgroundColor: colors.primary + '10',
                  borderWidth: 2,
                }
              ]}
            >
              <View style={styles.routineContent}>
                <View style={styles.routineHeader}>
                  <View style={[
                    styles.routineIcon,
                    { backgroundColor: routine.enabled ? colors.primary : colors.border }
                  ]}>
                    <FontAwesome 
                      name={routine.icon as any} 
                      size={18} 
                      color={routine.enabled ? 'white' : colors.placeholder}
                    />
                  </View>
                  <View style={styles.routineInfo}>
                    <Text style={[styles.routineTitle, { color: colors.text }]}>
                      {routine.title}
                    </Text>
                    <Text style={[styles.routineFrequency, { color: colors.primary }]}>
                      {routine.frequency}
                    </Text>
                  </View>
                  <Switch
                    value={routine.enabled}
                    onValueChange={() => toggleRoutine(routine.id)}
                    trackColor={{ 
                      false: colors.border, 
                      true: colors.primary + '40' 
                    }}
                    thumbColor={routine.enabled ? colors.primary : colors.placeholder}
                  />
                </View>
                <Text style={[styles.routineDescription, { color: colors.placeholder }]}>
                  {routine.description}
                </Text>
                
                {/* Preview Button */}
                <TouchableOpacity
                  style={[styles.previewButton, { backgroundColor: colors.primary + '10', borderColor: colors.primary }]}
                  onPress={() => console.log('Preview', routine.id)}
                  activeOpacity={0.8}
                >
                  <FontAwesome name="play" size={12} color={colors.primary} />
                  <Text style={[styles.previewButtonText, { color: colors.primary }]}>
                    Preview
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="lightbulb-o" size={16} color={colors.secondary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            You can always adjust these routines later in your settings. Start small and build momentum!
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.secondary }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Continue with {enabledCount} habit{enabledCount !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('./permissions')}
          activeOpacity={0.8}
        >
          <Text style={[styles.skipButtonText, { color: colors.placeholder }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
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
    marginBottom: 16,
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
  routinesContainer: {
    marginBottom: 16,
  },
  routineCard: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  routineContent: {
    padding: 16,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routineInfo: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  routineFrequency: {
    fontSize: 13,
    fontWeight: '500',
  },
  routineDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  previewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
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
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 