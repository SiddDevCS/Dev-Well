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
    description: 'Find peace during busy coding sessions',
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
          style={[styles.notSureButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
          onPress={handleNotSure}
          activeOpacity={0.8}
        >
          <Text style={[styles.notSureButtonText, { color: colors.text }]}>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
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
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notSureButton: {
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notSureButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  continueButton: {
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
    textAlign: 'center',
  },
}); 