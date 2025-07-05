import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StorageService, UserSettings } from './storage';

const BREAK_TYPES = [
  { id: 'stretch', name: 'Stretch Breaks', icon: 'stretch', description: 'Physical stretching exercises' },
  { id: 'breathing', name: 'Breathing Exercises', icon: 'lungs', description: 'Mindful breathing sessions' },
  { id: 'walking', name: 'Walking Breaks', icon: 'walking', description: 'Movement and walking breaks' },
  { id: 'eyes', name: 'Eye Rest', icon: 'eye', description: 'Screen break for your eyes' },
  { id: 'hydration', name: 'Hydration Reminders', icon: 'tint', description: 'Stay hydrated throughout the day' },
  { id: 'mindful', name: 'Mindful Moments', icon: 'peace', description: 'Meditation and mindfulness' },
];

const FREQUENCY_OPTIONS = [
  { value: 15, label: 'Every 15 minutes' },
  { value: 30, label: 'Every 30 minutes' },
  { value: 60, label: 'Every hour' },
  { value: 90, label: 'Every 1.5 hours' },
  { value: 120, label: 'Every 2 hours' },
];

const DAILY_GOALS = [
  { value: 4, label: '4 breaks per day' },
  { value: 6, label: '6 breaks per day' },
  { value: 8, label: '8 breaks per day' },
  { value: 10, label: '10 breaks per day' },
  { value: 12, label: '12 breaks per day' },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await StorageService.getUserSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      await StorageService.updateUserSettings(updates);
      setSettings(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };

  const toggleBreakType = (breakType: string) => {
    if (!settings) return;

    const enabledTypes = settings.enabledBreakTypes.includes(breakType)
      ? settings.enabledBreakTypes.filter(type => type !== breakType)
      : [...settings.enabledBreakTypes, breakType];

    updateSetting({ enabledBreakTypes: enabledTypes });
  };

  const resetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              await loadSettings();
              Alert.alert('Data Reset', 'All data has been cleared successfully.');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: Colors[colorScheme].background }]}>
        <Text style={[styles.loadingText, { color: Colors[colorScheme].text }]}>
          Loading settings...
        </Text>
      </View>
    );
  }

  if (!settings) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: Colors[colorScheme].background }]}>
        <Text style={[styles.errorText, { color: Colors[colorScheme].error }]}>
          Failed to load settings
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].placeholder }]}>
          Customize your wellness experience
        </Text>
      </View>

      {/* Notifications */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Notifications
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: Colors[colorScheme].text }]}>
              Break Reminders
            </Text>
            <Text style={[styles.settingDescription, { color: Colors[colorScheme].placeholder }]}>
              Get gentle reminders to take breaks
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) => updateSetting({ notificationsEnabled: value })}
            trackColor={{ 
              false: Colors[colorScheme].disabled, 
              true: Colors[colorScheme].primary + '40' 
            }}
            thumbColor={settings.notificationsEnabled ? Colors[colorScheme].primary : Colors[colorScheme].border}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: Colors[colorScheme].text }]}>
              Reminder Style
            </Text>
            <Text style={[styles.settingDescription, { color: Colors[colorScheme].placeholder }]}>
              Choose how you want to be reminded
            </Text>
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor: settings.reminderStyle === 'gentle' 
                    ? Colors[colorScheme].primary 
                    : Colors[colorScheme].surface,
                }
              ]}
              onPress={() => updateSetting({ reminderStyle: 'gentle' })}
            >
              <Text style={[
                styles.toggleButtonText,
                {
                  color: settings.reminderStyle === 'gentle' 
                    ? 'white' 
                    : Colors[colorScheme].text,
                }
              ]}>
                Gentle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor: settings.reminderStyle === 'persistent' 
                    ? Colors[colorScheme].primary 
                    : Colors[colorScheme].surface,
                }
              ]}
              onPress={() => updateSetting({ reminderStyle: 'persistent' })}
            >
              <Text style={[
                styles.toggleButtonText,
                {
                  color: settings.reminderStyle === 'persistent' 
                    ? 'white' 
                    : Colors[colorScheme].text,
                }
              ]}>
                Persistent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Break Frequency */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Break Frequency
        </Text>
        <Text style={[styles.sectionDescription, { color: Colors[colorScheme].placeholder }]}>
          How often would you like to be reminded to take breaks?
        </Text>
        
        <View style={styles.optionsContainer}>
          {FREQUENCY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                {
                  backgroundColor: settings.breakFrequency === option.value 
                    ? Colors[colorScheme].primary 
                    : Colors[colorScheme].surface,
                  borderColor: settings.breakFrequency === option.value 
                    ? Colors[colorScheme].primary 
                    : Colors[colorScheme].border,
                }
              ]}
              onPress={() => updateSetting({ breakFrequency: option.value })}
            >
              <Text style={[
                styles.optionButtonText,
                {
                  color: settings.breakFrequency === option.value 
                    ? 'white' 
                    : Colors[colorScheme].text,
                }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily Goal */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Daily Goal
        </Text>
        <Text style={[styles.sectionDescription, { color: Colors[colorScheme].placeholder }]}>
          Set your daily break goal to stay on track
        </Text>
        
        <View style={styles.optionsContainer}>
          {DAILY_GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.value}
              style={[
                styles.optionButton,
                {
                  backgroundColor: settings.dailyGoal === goal.value 
                    ? Colors[colorScheme].primary 
                    : Colors[colorScheme].surface,
                  borderColor: settings.dailyGoal === goal.value 
                    ? Colors[colorScheme].primary 
                    : Colors[colorScheme].border,
                }
              ]}
              onPress={() => updateSetting({ dailyGoal: goal.value })}
            >
              <Text style={[
                styles.optionButtonText,
                {
                  color: settings.dailyGoal === goal.value 
                    ? 'white' 
                    : Colors[colorScheme].text,
                }
              ]}>
                {goal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Working Hours */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Working Hours
        </Text>
        <Text style={[styles.sectionDescription, { color: Colors[colorScheme].placeholder }]}>
          Set your working hours to receive reminders only when you're working
        </Text>
        
        <View style={styles.workingHoursContainer}>
          <View style={styles.timeInput}>
            <Text style={[styles.timeLabel, { color: Colors[colorScheme].text }]}>
              Start Time
            </Text>
            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: Colors[colorScheme].surface }]}
              onPress={() => Alert.alert('Time Picker', 'Time picker not implemented in this demo')}
            >
              <FontAwesome5 name="clock" size={16} color={Colors[colorScheme].primary} />
              <Text style={[styles.timeButtonText, { color: Colors[colorScheme].text }]}>
                {settings.workingHours.start}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeInput}>
            <Text style={[styles.timeLabel, { color: Colors[colorScheme].text }]}>
              End Time
            </Text>
            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: Colors[colorScheme].surface }]}
              onPress={() => Alert.alert('Time Picker', 'Time picker not implemented in this demo')}
            >
              <FontAwesome5 name="clock" size={16} color={Colors[colorScheme].primary} />
              <Text style={[styles.timeButtonText, { color: Colors[colorScheme].text }]}>
                {settings.workingHours.end}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Break Types */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Break Types
        </Text>
        <Text style={[styles.sectionDescription, { color: Colors[colorScheme].placeholder }]}>
          Choose which types of breaks you want to receive
        </Text>
        
        <View style={styles.breakTypesContainer}>
          {BREAK_TYPES.map((breakType) => (
            <TouchableOpacity
              key={breakType.id}
              style={[
                styles.breakTypeRow,
                {
                  backgroundColor: settings.enabledBreakTypes.includes(breakType.id) 
                    ? Colors[colorScheme].primary + '10' 
                    : 'transparent',
                }
              ]}
              onPress={() => toggleBreakType(breakType.id)}
            >
              <View style={styles.breakTypeInfo}>
                <FontAwesome5 
                  name={breakType.icon} 
                  size={20} 
                  color={settings.enabledBreakTypes.includes(breakType.id) 
                    ? Colors[colorScheme].primary 
                    : Colors[colorScheme].placeholder
                  } 
                />
                <View style={styles.breakTypeText}>
                  <Text style={[styles.breakTypeName, { color: Colors[colorScheme].text }]}>
                    {breakType.name}
                  </Text>
                  <Text style={[styles.breakTypeDescription, { color: Colors[colorScheme].placeholder }]}>
                    {breakType.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enabledBreakTypes.includes(breakType.id)}
                onValueChange={() => toggleBreakType(breakType.id)}
                trackColor={{ 
                  false: Colors[colorScheme].disabled, 
                  true: Colors[colorScheme].primary + '40' 
                }}
                thumbColor={settings.enabledBreakTypes.includes(breakType.id) ? Colors[colorScheme].primary : Colors[colorScheme].border}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Data Management */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Data Management
        </Text>
        
        <TouchableOpacity
          style={[styles.dangerButton, { backgroundColor: Colors[colorScheme].error }]}
          onPress={resetData}
        >
          <FontAwesome5 name="trash-alt" size={16} color="white" />
          <Text style={styles.dangerButtonText}>Reset All Data</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          About DevWell
        </Text>
        <Text style={[styles.aboutText, { color: Colors[colorScheme].placeholder }]}>
          DevWell helps software developers maintain their health and productivity through regular wellness breaks.
        </Text>
        <Text style={[styles.versionText, { color: Colors[colorScheme].placeholder }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workingHoursContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  breakTypesContainer: {
    gap: 8,
  },
  breakTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  breakTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakTypeText: {
    marginLeft: 12,
    flex: 1,
  },
  breakTypeName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  breakTypeDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 