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
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.secondary }]}>
            <FontAwesome name="magic" size={32} color="white" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Your first micro-habits
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Based on your answers, we've personalized these wellness routines for you
          </Text>
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
                      size={20} 
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
              </View>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="lightbulb-o" size={20} color={colors.secondary} />
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
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  routinesContainer: {
    marginBottom: 24,
  },
  routineCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  routineContent: {
    padding: 20,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routineInfo: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  routineFrequency: {
    fontSize: 14,
    fontWeight: '500',
  },
  routineDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 