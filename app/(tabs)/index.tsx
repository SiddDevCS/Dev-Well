import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StorageService, DailyStats, UserSettings } from './storage';
import BreakTimer from './BreakTimer';

type BreakType = 'stretch' | 'breathing' | 'walking' | 'eyes' | 'hydration' | 'mindful';

const BREAK_TYPES = [
  { id: 'stretch', name: 'Stretch', icon: 'stretch', color: '#4CAF50', duration: '5 min' },
  { id: 'breathing', name: 'Breathing', icon: 'lungs', color: '#2196F3', duration: '3 min' },
  { id: 'walking', name: 'Walking', icon: 'walking', color: '#FF9800', duration: '10 min' },
  { id: 'eyes', name: 'Eye Rest', icon: 'eye', color: '#9C27B0', duration: '2 min' },
  { id: 'hydration', name: 'Hydration', icon: 'tint', color: '#00BCD4', duration: '1 min' },
  { id: 'mindful', name: 'Mindful', icon: 'peace', color: '#795548', duration: '5 min' },
];

export default function WellnessScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  
  // State
  const [currentBreakType, setCurrentBreakType] = useState<BreakType | null>(null);
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [remindersPaused, setRemindersPaused] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
    // Record app open
    StorageService.recordAppOpen();
  }, []);

  const loadData = async () => {
    try {
      const [stats, settings] = await Promise.all([
        StorageService.getTodayStats(),
        StorageService.getUserSettings(),
      ]);
      setTodayStats(stats);
      setUserSettings(settings);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const startBreak = (breakType: BreakType) => {
    setCurrentBreakType(breakType);
  };

  const startRandomBreak = () => {
    if (!userSettings) return;
    
    const enabledBreaks = BREAK_TYPES.filter(breakType => 
      userSettings.enabledBreakTypes.includes(breakType.id)
    );
    
    if (enabledBreaks.length === 0) {
      Alert.alert('No Breaks Enabled', 'Please enable some break types in settings.');
      return;
    }
    
    const randomBreak = enabledBreaks[Math.floor(Math.random() * enabledBreaks.length)];
    startBreak(randomBreak.id as BreakType);
  };

  const handleBreakComplete = async () => {
    setCurrentBreakType(null);
    await loadData(); // Refresh data after break completion
    
    // Show completion message
    Alert.alert(
      'Break Complete! 🎉',
      'Great job taking care of yourself! Your progress has been saved.',
      [{ text: 'Continue', style: 'default' }]
    );
  };

  const handleBreakCancel = async () => {
    setCurrentBreakType(null);
    await loadData(); // Refresh data
  };

  const toggleReminders = async () => {
    if (!userSettings) return;
    
    const newNotificationState = !userSettings.notificationsEnabled;
    await StorageService.updateUserSettings({
      notificationsEnabled: newNotificationState,
    });
    
    setUserSettings(prev => prev ? { ...prev, notificationsEnabled: newNotificationState } : null);
    
    Alert.alert(
      newNotificationState ? 'Reminders Enabled' : 'Reminders Disabled',
      newNotificationState 
        ? 'You\'ll receive gentle reminders to take breaks.' 
        : 'Break reminders have been disabled.',
    );
  };

  const pauseReminders = () => {
    setRemindersPaused(!remindersPaused);
    Alert.alert(
      remindersPaused ? 'Reminders Resumed' : 'Reminders Paused',
      remindersPaused 
        ? 'Break reminders are now active.' 
        : 'Break reminders paused for 1 hour.',
    );
  };

  const updateBreakFrequency = async (frequency: number) => {
    if (!userSettings) return;
    
    await StorageService.updateUserSettings({
      breakFrequency: frequency,
    });
    
    setUserSettings(prev => prev ? { ...prev, breakFrequency: frequency } : null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusMessage = () => {
    if (!todayStats || !userSettings) return 'Loading...';
    
    const progress = (todayStats.breaksCompleted / userSettings.dailyGoal) * 100;
    
    if (progress >= 100) {
      return '🎉 Daily goal achieved! Amazing work!';
    } else if (progress >= 75) {
      return '🔥 Almost there! Keep up the great work!';
    } else if (progress >= 50) {
      return '💪 Halfway to your goal! You\'re doing great!';
    } else if (progress >= 25) {
      return '🌱 Good start! Remember to take regular breaks.';
    } else {
      return '✨ Ready to start your wellness journey?';
    }
  };

  const getProgressColor = () => {
    if (!todayStats || !userSettings) return Colors[colorScheme].border;
    
    const progress = (todayStats.breaksCompleted / userSettings.dailyGoal) * 100;
    
    if (progress >= 100) return Colors[colorScheme].success;
    if (progress >= 75) return Colors[colorScheme].primary;
    if (progress >= 50) return Colors[colorScheme].secondary;
    return Colors[colorScheme].border;
  };

  // Show break timer if active
  if (currentBreakType) {
    return (
      <BreakTimer
        breakType={currentBreakType}
        onComplete={handleBreakComplete}
        onCancel={handleBreakCancel}
      />
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Status Card */}
      <View style={[styles.statusCard, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.statusTitle, { color: Colors[colorScheme].text }]}>
          Today's Progress
        </Text>
        <Text style={[styles.statusMessage, { color: Colors[colorScheme].text }]}>
          {getStatusMessage()}
        </Text>
        
        {todayStats && userSettings && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors[colorScheme].primary }]}>
                {todayStats.breaksCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: Colors[colorScheme].text }]}>
                Breaks Today
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors[colorScheme].secondary }]}>
                {formatTime(todayStats.totalBreakTime)}
              </Text>
              <Text style={[styles.statLabel, { color: Colors[colorScheme].text }]}>
                Break Time
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors[colorScheme].accent }]}>
                {Math.round((todayStats.breaksCompleted / userSettings.dailyGoal) * 100)}%
              </Text>
              <Text style={[styles.statLabel, { color: Colors[colorScheme].text }]}>
                Daily Goal
              </Text>
            </View>
          </View>
        )}
        
        {/* Progress Bar */}
        {todayStats && userSettings && (
          <View style={[styles.progressContainer, { backgroundColor: Colors[colorScheme].border }]}>
            <View 
              style={[
                styles.progressBar,
                {
                  backgroundColor: getProgressColor(),
                  width: `${Math.min((todayStats.breaksCompleted / userSettings.dailyGoal) * 100, 100)}%`,
                }
              ]}
            />
          </View>
        )}
      </View>

      {/* Break Types */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Choose Your Break
        </Text>
        <View style={styles.breakGrid}>
          {BREAK_TYPES.map((breakType) => (
            <TouchableOpacity
              key={breakType.id}
              style={[styles.breakCard, { backgroundColor: Colors[colorScheme].surface }]}
              onPress={() => startBreak(breakType.id as BreakType)}
              activeOpacity={0.7}
            >
              <View style={[styles.breakIcon, { backgroundColor: breakType.color }]}>
                <FontAwesome5 name={breakType.icon} size={20} color="white" />
              </View>
              <Text style={[styles.breakName, { color: Colors[colorScheme].text }]}>
                {breakType.name}
              </Text>
              <Text style={[styles.breakDuration, { color: Colors[colorScheme].placeholder }]}>
                {breakType.duration}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: Colors[colorScheme].primary }]}
            onPress={startRandomBreak}
          >
            <FontAwesome5 name="random" size={16} color="white" />
            <Text style={styles.quickActionText}>Random Break</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: Colors[colorScheme].secondary }]}
            onPress={pauseReminders}
          >
            <FontAwesome5 name={remindersPaused ? "play" : "pause"} size={16} color="white" />
            <Text style={styles.quickActionText}>
              {remindersPaused ? 'Resume' : 'Pause'} Reminders
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Break Schedule
        </Text>
        
        {userSettings && (
          <View style={styles.settingsContainer}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: Colors[colorScheme].text }]}>
                Break Frequency
              </Text>
              <Text style={[styles.settingValue, { color: Colors[colorScheme].placeholder }]}>
                Every {userSettings.breakFrequency} minutes
              </Text>
            </View>
            
            <View style={styles.frequencyButtons}>
              {[30, 60, 90, 120].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    {
                      backgroundColor: userSettings.breakFrequency === freq 
                        ? Colors[colorScheme].primary 
                        : Colors[colorScheme].surface,
                    }
                  ]}
                  onPress={() => updateBreakFrequency(freq)}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    {
                      color: userSettings.breakFrequency === freq 
                        ? 'white' 
                        : Colors[colorScheme].text,
                    }
                  ]}>
                    {freq}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.settingRow}
              onPress={toggleReminders}
            >
              <Text style={[styles.settingLabel, { color: Colors[colorScheme].text }]}>
                Notifications
              </Text>
              <FontAwesome5 
                name={userSettings.notificationsEnabled ? "toggle-on" : "toggle-off"} 
                size={24} 
                color={userSettings.notificationsEnabled ? Colors[colorScheme].primary : Colors[colorScheme].disabled} 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Tips */}
      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          💡 Wellness Tip
        </Text>
        <Text style={[styles.tipText, { color: Colors[colorScheme].text }]}>
          Regular breaks improve focus, reduce eye strain, and boost overall productivity. 
          Even 2-minute breaks can make a significant difference!
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
  statusCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
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
    marginBottom: 16,
  },
  breakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  breakCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  breakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  breakName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  breakDuration: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsContainer: {
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
