import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  View,
  Text,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

type BreakType = {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  color: string;
};

type ScheduleOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  time: string;
};

const breakTypes: BreakType[] = [
  {
    id: 'stretch',
    title: 'Stretch Break',
    description: 'Release tension and improve posture',
    icon: 'body',
    duration: '2-5 min',
    color: '#4DB6AC',
  },
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    description: 'Calm your mind and reduce stress',
    icon: 'leaf',
    duration: '3 min',
    color: '#B39DDB',
  },
  {
    id: 'walk',
    title: 'Walking Break',
    description: 'Get moving and boost energy',
    icon: 'walking',
    duration: '5-10 min',
    color: '#4DB6AC',
  },
  {
    id: 'eyes',
    title: 'Eye Rest',
    description: 'Relieve eye strain from screens',
    icon: 'eye',
    duration: '2 min',
    color: '#B39DDB',
  },
  {
    id: 'hydration',
    title: 'Hydration Break',
    description: 'Stay refreshed and focused',
    icon: 'tint',
    duration: '1 min',
    color: '#4DB6AC',
  },
  {
    id: 'mindful',
    title: 'Mindful Moment',
    description: 'Quick meditation or reflection',
    icon: 'brain',
    duration: '3-5 min',
    color: '#B39DDB',
  },
];

const scheduleOptions: ScheduleOption[] = [
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    subtitle: '25 min focus, 5 min break',
    icon: 'clock-o',
    time: '25/5 min',
  },
  {
    id: 'hourly',
    title: 'Hourly Reminders',
    subtitle: 'Break every hour',
    icon: 'bell',
    time: '60 min',
  },
  {
    id: 'custom',
    title: 'Custom Schedule',
    subtitle: 'Set your own timing',
    icon: 'calendar',
    time: 'Custom',
  },
  {
    id: 'smart',
    title: 'Smart Breaks',
    subtitle: 'AI-powered suggestions',
    icon: 'magic',
    time: 'Adaptive',
  },
];

export default function WellnessScreen() {
  const [activeBreak, setActiveBreak] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('pomodoro');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleStartBreak = (breakType: BreakType) => {
    setActiveBreak(breakType.id);
    Alert.alert(
      `Starting ${breakType.title}`,
      `Enjoy your ${breakType.duration} ${breakType.title.toLowerCase()}! We'll guide you through it.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setActiveBreak(null) },
        { text: 'Start', onPress: () => console.log(`Starting ${breakType.title}`) }
      ]
    );
  };

  const handleScheduleChange = (scheduleId: string) => {
    setSelectedSchedule(scheduleId);
    Alert.alert(
      'Schedule Updated',
      `Your break schedule has been set to ${scheduleOptions.find(s => s.id === scheduleId)?.title}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Ready for a wellness break?
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Choose your moment of self-care
          </Text>
        </View>

        {/* Current Status */}
        <View style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statusHeader}>
            <FontAwesome name="heart" size={20} color={colors.primary} />
            <Text style={[styles.statusTitle, { color: colors.text }]}>
              Current Status
            </Text>
          </View>
          <Text style={[styles.statusText, { color: colors.placeholder }]}>
            {activeBreak ? 'Break in progress...' : 'Ready for your next break'}
          </Text>
          <View style={styles.statusMeta}>
            <Text style={[styles.statusTime, { color: colors.secondary }]}>
              Next break in 23 minutes
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: colors.success }]}>
                On Track
              </Text>
            </View>
          </View>
        </View>

        {/* Break Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Choose Your Break
          </Text>
          <View style={styles.breakGrid}>
            {breakTypes.map((breakType) => (
              <TouchableOpacity
                key={breakType.id}
                style={[
                  styles.breakCard,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: activeBreak === breakType.id ? breakType.color : colors.border,
                  },
                  activeBreak === breakType.id && {
                    backgroundColor: breakType.color + '10',
                    borderWidth: 2,
                  }
                ]}
                onPress={() => handleStartBreak(breakType)}
                activeOpacity={0.8}
              >
                <View style={[styles.breakIcon, { backgroundColor: breakType.color + '20' }]}>
                  <FontAwesome 
                    name={breakType.icon as any} 
                    size={24} 
                    color={breakType.color}
                  />
                </View>
                <Text style={[styles.breakTitle, { color: colors.text }]}>
                  {breakType.title}
                </Text>
                <Text style={[styles.breakDescription, { color: colors.placeholder }]}>
                  {breakType.description}
                </Text>
                <Text style={[styles.breakDuration, { color: breakType.color }]}>
                  {breakType.duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <FontAwesome name="play" size={16} color="white" />
              <Text style={styles.quickActionText}>Start Random Break</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.secondary }]}
              activeOpacity={0.8}
            >
              <FontAwesome name="pause" size={16} color="white" />
              <Text style={styles.quickActionText}>Pause Reminders</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Schedule Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Break Schedule
          </Text>
          <View style={styles.scheduleList}>
            {scheduleOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.scheduleCard,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: selectedSchedule === option.id ? colors.primary : colors.border,
                  },
                  selectedSchedule === option.id && {
                    backgroundColor: colors.primary + '10',
                    borderWidth: 2,
                  }
                ]}
                onPress={() => handleScheduleChange(option.id)}
                activeOpacity={0.8}
              >
                <View style={styles.scheduleContent}>
                  <View style={[
                    styles.scheduleIcon,
                    { backgroundColor: selectedSchedule === option.id ? colors.primary : colors.border }
                  ]}>
                    <FontAwesome 
                      name={option.icon as any} 
                      size={20} 
                      color={selectedSchedule === option.id ? 'white' : colors.placeholder}
                    />
                  </View>
                  <View style={styles.scheduleInfo}>
                    <Text style={[styles.scheduleTitle, { color: colors.text }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.scheduleSubtitle, { color: colors.placeholder }]}>
                      {option.subtitle}
                    </Text>
                  </View>
                  <Text style={[styles.scheduleTime, { color: colors.secondary }]}>
                    {option.time}
                  </Text>
                </View>
                {selectedSchedule === option.id && (
                  <View style={styles.selectedIndicator}>
                    <FontAwesome name="check" size={16} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  statusCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 12,
  },
  statusMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  breakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  breakCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  breakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  breakDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  breakDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  scheduleList: {
    paddingHorizontal: 24,
  },
  scheduleCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  scheduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  scheduleSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});
