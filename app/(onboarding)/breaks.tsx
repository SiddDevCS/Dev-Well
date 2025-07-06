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

export default function BreaksScreen() {
  const [takesBreaks, setTakesBreaks] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleContinue = () => {
    console.log('Takes breaks:', takesBreaks);
    router.push('./challenges');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Progress Indicator */}
      <OnboardingProgress currentStep={4} totalSteps={6} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
            <FontAwesome name="pause" size={24} color="white" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Do you take regular breaks?
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Understanding your current habits helps us create better reminders
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.option,
              {
                backgroundColor: takesBreaks === true 
                  ? colors.success 
                  : colors.surface,
                borderColor: takesBreaks === true 
                  ? colors.success 
                  : colors.border,
              }
            ]}
            onPress={() => setTakesBreaks(true)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionIcon,
                { backgroundColor: takesBreaks === true ? 'white' : colors.success + '20' }
              ]}>
                <FontAwesome 
                  name="check" 
                  size={20} 
                  color={takesBreaks === true ? colors.success : colors.success}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionTitle,
                  { color: takesBreaks === true ? 'white' : colors.text }
                ]}>
                  Yes, I take breaks
                </Text>
                <Text style={[
                  styles.optionDescription,
                  { color: takesBreaks === true ? 'white' : colors.placeholder }
                ]}>
                  I already have a break routine
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              {
                backgroundColor: takesBreaks === false 
                  ? colors.primary 
                  : colors.surface,
                borderColor: takesBreaks === false 
                  ? colors.primary 
                  : colors.border,
              }
            ]}
            onPress={() => setTakesBreaks(false)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionIcon,
                { backgroundColor: takesBreaks === false ? 'white' : colors.primary + '20' }
              ]}>
                <FontAwesome 
                  name="times" 
                  size={20} 
                  color={takesBreaks === false ? colors.primary : colors.primary}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionTitle,
                  { color: takesBreaks === false ? 'white' : colors.text }
                ]}>
                  No, I forget to break
                </Text>
                <Text style={[
                  styles.optionDescription,
                  { color: takesBreaks === false ? 'white' : colors.placeholder }
                ]}>
                  I get lost in code and forget to rest
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Helper Text */}
        <View style={[styles.helperBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="lightbulb-o" size={16} color={colors.secondary} />
          <Text style={[styles.helperText, { color: colors.text }]}>
            No worries! We'll help you build this habit. Regular breaks can improve focus by up to 40%.
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
              takesBreaks === null && { opacity: 0.5 }
            ]}
            onPress={handleContinue}
            disabled={takesBreaks === null}
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
    marginBottom: 16,
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
    padding: 20,
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