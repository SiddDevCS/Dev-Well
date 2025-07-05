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

type ProfileData = {
  codingHours: number;
  takesBreaks: boolean | null;
  mainChallenge: string;
};

const codingHourOptions = [
  { hours: 2, label: '1-2 hours' },
  { hours: 4, label: '3-4 hours' },
  { hours: 6, label: '5-6 hours' },
  { hours: 8, label: '7-8 hours' },
  { hours: 10, label: '9+ hours' },
];

const challengeOptions = [
  { id: 'focus', label: 'Staying focused', icon: 'bullseye' },
  { id: 'breaks', label: 'Taking breaks', icon: 'pause' },
  { id: 'stress', label: 'Managing stress', icon: 'heart' },
];

export default function ProfilingScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    codingHours: 6,
    takesBreaks: null,
    mainChallenge: '',
  });
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleContinue = () => {
    console.log('Profile data:', profileData);
    router.push('./routine');
  };

  const isFormComplete = profileData.takesBreaks !== null && profileData.mainChallenge !== '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            How do you work?
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Help us understand your coding routine
          </Text>
        </View>

        {/* Question 1: Coding Hours */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { color: colors.text }]}>
            How many hours do you usually code each day?
          </Text>
          <View style={styles.hoursContainer}>
            {codingHourOptions.map((option) => (
              <TouchableOpacity
                key={option.hours}
                style={[
                  styles.hourOption,
                  {
                    backgroundColor: profileData.codingHours === option.hours 
                      ? colors.primary 
                      : colors.surface,
                    borderColor: profileData.codingHours === option.hours 
                      ? colors.primary 
                      : colors.border,
                  }
                ]}
                onPress={() => setProfileData({ ...profileData, codingHours: option.hours })}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.hourOptionText,
                  { color: profileData.codingHours === option.hours ? 'white' : colors.text }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Question 2: Regular Breaks */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { color: colors.text }]}>
            Do you take regular breaks?
          </Text>
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={[
                styles.booleanOption,
                {
                  backgroundColor: profileData.takesBreaks === true 
                    ? colors.success 
                    : colors.surface,
                  borderColor: profileData.takesBreaks === true 
                    ? colors.success 
                    : colors.border,
                }
              ]}
              onPress={() => setProfileData({ ...profileData, takesBreaks: true })}
              activeOpacity={0.8}
            >
              <FontAwesome 
                name="check" 
                size={20} 
                color={profileData.takesBreaks === true ? 'white' : colors.placeholder}
              />
              <Text style={[
                styles.booleanOptionText,
                { color: profileData.takesBreaks === true ? 'white' : colors.text }
              ]}>
                Yes, I take breaks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.booleanOption,
                {
                  backgroundColor: profileData.takesBreaks === false 
                    ? colors.error 
                    : colors.surface,
                  borderColor: profileData.takesBreaks === false 
                    ? colors.error 
                    : colors.border,
                }
              ]}
              onPress={() => setProfileData({ ...profileData, takesBreaks: false })}
              activeOpacity={0.8}
            >
              <FontAwesome 
                name="times" 
                size={20} 
                color={profileData.takesBreaks === false ? 'white' : colors.placeholder}
              />
              <Text style={[
                styles.booleanOptionText,
                { color: profileData.takesBreaks === false ? 'white' : colors.text }
              ]}>
                No, I forget to break
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Question 3: Main Challenge */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { color: colors.text }]}>
            What's your main challenge?
          </Text>
          <View style={styles.challengeContainer}>
            {challengeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.challengeOption,
                  {
                    backgroundColor: profileData.mainChallenge === option.id 
                      ? colors.secondary 
                      : colors.surface,
                    borderColor: profileData.mainChallenge === option.id 
                      ? colors.secondary 
                      : colors.border,
                  }
                ]}
                onPress={() => setProfileData({ ...profileData, mainChallenge: option.id })}
                activeOpacity={0.8}
              >
                <FontAwesome 
                  name={option.icon as any} 
                  size={16} 
                  color={profileData.mainChallenge === option.id ? 'white' : colors.placeholder}
                />
                <Text style={[
                  styles.challengeOptionText,
                  { color: profileData.mainChallenge === option.id ? 'white' : colors.text }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: colors.primary },
            !isFormComplete && { opacity: 0.5 }
          ]}
          onPress={handleContinue}
          disabled={!isFormComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Continue
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
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
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
  questionContainer: {
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hourOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    flex: 0.48,
    alignItems: 'center',
  },
  hourOptionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  booleanContainer: {
    gap: 10,
  },
  booleanOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  booleanOptionText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
  challengeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  challengeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  challengeOptionText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
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
}); 