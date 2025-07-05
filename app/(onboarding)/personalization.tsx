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

type ImprovementOption = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

const improvementOptions: ImprovementOption[] = [
  {
    id: 'stress',
    title: 'Reduce stress',
    icon: 'heart',
    description: 'Find calm during busy coding sessions',
  },
  {
    id: 'focus',
    title: 'Improve focus',
    icon: 'bullseye',
    description: 'Stay concentrated on your tasks',
  },
  {
    id: 'habits',
    title: 'Build healthier habits',
    icon: 'trophy',
    description: 'Create positive daily routines',
  },
  {
    id: 'sleep',
    title: 'Sleep better',
    icon: 'moon-o',
    description: 'Get quality rest for better performance',
  },
  {
    id: 'balance',
    title: 'Balance work & life',
    icon: 'balance-scale',
    description: 'Maintain healthy boundaries',
  },
];

export default function PersonalizationScreen() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleOptionPress = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleContinue = () => {
    // Store selected options for later use
    console.log('Selected improvements:', selectedOptions);
    router.push('./profiling');
  };

  const handleNotSure = () => {
    setSelectedOptions([]);
    router.push('./profiling');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            What do you want to improve?
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Select all that apply. We'll personalize your experience.
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {improvementOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: selectedOptions.includes(option.id) 
                    ? colors.primary 
                    : colors.border,
                },
                selectedOptions.includes(option.id) && {
                  backgroundColor: colors.primary + '10',
                  borderWidth: 2,
                }
              ]}
              onPress={() => handleOptionPress(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: selectedOptions.includes(option.id) ? colors.primary : colors.border }
                ]}>
                  <FontAwesome 
                    name={option.icon as any} 
                    size={24} 
                    color={selectedOptions.includes(option.id) ? 'white' : colors.placeholder}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.placeholder }]}>
                    {option.description}
                  </Text>
                </View>
                {selectedOptions.includes(option.id) && (
                  <View style={styles.checkmark}>
                    <FontAwesome name="check" size={16} color={colors.primary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Not Sure Button */}
        <TouchableOpacity
          style={[styles.notSureButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleNotSure}
          activeOpacity={0.8}
        >
          <Text style={[styles.notSureButtonText, { color: colors.placeholder }]}>
            I'm not sure yet
          </Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: colors.secondary },
            selectedOptions.length === 0 && { opacity: 0.5 }
          ]}
          onPress={handleContinue}
          disabled={selectedOptions.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Continue ({selectedOptions.length} selected)
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
  optionsContainer: {
    marginBottom: 32,
  },
  optionCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notSureButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notSureButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 16,
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
}); 