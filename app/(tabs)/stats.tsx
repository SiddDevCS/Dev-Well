import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { StorageService, DailyStats, UserProgress } from './storage';

const { width } = Dimensions.get('window');

type StatPeriod = 'today' | 'week' | 'month';

type BreakStat = {
  type: string;
  count: number;
  totalMinutes: number;
  icon: string;
  color: string;
};

type DayData = {
  day: string;
  breaks: number;
  minutes: number;
};

// Mock data - in a real app, this would come from your backend/storage
const breakStats: BreakStat[] = [
  { type: 'Stretch', count: 8, totalMinutes: 32, icon: 'body', color: '#4DB6AC' },
  { type: 'Breathing', count: 5, totalMinutes: 15, icon: 'leaf', color: '#B39DDB' },
  { type: 'Walking', count: 3, totalMinutes: 25, icon: 'walking', color: '#4DB6AC' },
  { type: 'Eye Rest', count: 12, totalMinutes: 24, icon: 'eye', color: '#B39DDB' },
  { type: 'Hydration', count: 15, totalMinutes: 15, icon: 'tint', color: '#4DB6AC' },
  { type: 'Mindful', count: 4, totalMinutes: 16, icon: 'brain', color: '#B39DDB' },
];

const weekData: DayData[] = [
  { day: 'Mon', breaks: 8, minutes: 32 },
  { day: 'Tue', breaks: 12, minutes: 45 },
  { day: 'Wed', breaks: 6, minutes: 24 },
  { day: 'Thu', breaks: 15, minutes: 58 },
  { day: 'Fri', breaks: 10, minutes: 38 },
  { day: 'Sat', breaks: 4, minutes: 16 },
  { day: 'Sun', breaks: 7, minutes: 28 },
];

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<StatPeriod>('today');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const todayStats = {
    breaksToday: 12,
    minutesToday: 47,
    appOpens: 8,
    streakDays: 15,
    goalProgress: 85,
  };

  const maxBreaks = Math.max(...weekData.map(d => d.breaks));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Your Wellness Journey
          </Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Track your progress and celebrate your wins
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['today', 'week', 'month'] as StatPeriod[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period ? colors.primary : colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedPeriod(period)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.periodButtonText,
                { color: selectedPeriod === period ? 'white' : colors.text }
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewGrid}>
            <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.overviewIcon, { backgroundColor: colors.primary + '20' }]}>
                <FontAwesome5 name="heart" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.overviewNumber, { color: colors.text }]}>
                {todayStats.breaksToday}
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.placeholder }]}>
                Breaks Today
              </Text>
            </View>

            <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.overviewIcon, { backgroundColor: colors.secondary + '20' }]}>
                <FontAwesome5 name="clock" size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.overviewNumber, { color: colors.text }]}>
                {todayStats.minutesToday}
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.placeholder }]}>
                Minutes Today
              </Text>
            </View>

            <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.overviewIcon, { backgroundColor: colors.primary + '20' }]}>
                <FontAwesome5 name="mobile-alt" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.overviewNumber, { color: colors.text }]}>
                {todayStats.appOpens}
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.placeholder }]}>
                App Opens
              </Text>
            </View>

            <View style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.overviewIcon, { backgroundColor: colors.secondary + '20' }]}>
                <FontAwesome name="fire" size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.overviewNumber, { color: colors.text }]}>
                {todayStats.streakDays}
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.placeholder }]}>
                Day Streak
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Weekly Progress
          </Text>
          <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Breaks per Day
              </Text>
              <Text style={[styles.chartSubtitle, { color: colors.placeholder }]}>
                Last 7 days
              </Text>
            </View>
            <View style={styles.chart}>
              {weekData.map((data, index) => (
                <View key={data.day} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (data.breaks / maxBreaks) * 120,
                        backgroundColor: colors.primary,
                      }
                    ]}
                  />
                  <Text style={[styles.barValue, { color: colors.text }]}>
                    {data.breaks}
                  </Text>
                  <Text style={[styles.barLabel, { color: colors.placeholder }]}>
                    {data.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Break Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Break Breakdown
          </Text>
          <View style={styles.breakTypesList}>
            {breakStats.map((stat) => (
              <View
                key={stat.type}
                style={[styles.breakTypeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.breakTypeContent}>
                  <View style={[styles.breakTypeIcon, { backgroundColor: stat.color + '20' }]}>
                    <FontAwesome name={stat.icon as any} size={20} color={stat.color} />
                  </View>
                  <View style={styles.breakTypeInfo}>
                    <Text style={[styles.breakTypeName, { color: colors.text }]}>
                      {stat.type}
                    </Text>
                    <Text style={[styles.breakTypeDetails, { color: colors.placeholder }]}>
                      {stat.count} breaks • {stat.totalMinutes} min
                    </Text>
                  </View>
                  <View style={styles.breakTypeStats}>
                    <Text style={[styles.breakTypeCount, { color: stat.color }]}>
                      {stat.count}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${(stat.count / Math.max(...breakStats.map(s => s.count))) * 100}%`,
                        backgroundColor: stat.color,
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Goal Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Goal
          </Text>
          <View style={[styles.goalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIcon, { backgroundColor: colors.success + '20' }]}>
                <FontAwesome name="bullseye" size={20} color={colors.success} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={[styles.goalTitle, { color: colors.text }]}>
                  Daily Wellness Goal
                </Text>
                <Text style={[styles.goalSubtitle, { color: colors.placeholder }]}>
                  15 breaks • 60 minutes
                </Text>
              </View>
              <Text style={[styles.goalPercentage, { color: colors.success }]}>
                {todayStats.goalProgress}%
              </Text>
            </View>
            <View style={styles.goalProgressContainer}>
              <View style={[styles.goalProgressTrack, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.goalProgressFill,
                    {
                      width: `${todayStats.goalProgress}%`,
                      backgroundColor: colors.success,
                    }
                  ]}
                />
              </View>
            </View>
            <Text style={[styles.goalMessage, { color: colors.placeholder }]}>
              Great progress! You're {todayStats.goalProgress >= 100 ? 'exceeding' : 'on track for'} your daily goal.
            </Text>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Insights
          </Text>
          <View style={[styles.insightCard, { backgroundColor: colors.secondary + '10', borderColor: colors.secondary }]}>
            <View style={styles.insightHeader}>
              <FontAwesome name="lightbulb-o" size={20} color={colors.secondary} />
              <Text style={[styles.insightTitle, { color: colors.text }]}>
                Weekly Insight
              </Text>
            </View>
            <Text style={[styles.insightText, { color: colors.text }]}>
              You've been most consistent with eye rest breaks this week! Consider adding more walking breaks to boost your energy levels.
            </Text>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  overviewSection: {
    marginBottom: 32,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    textAlign: 'center',
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
  chartCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
  },
  breakTypesList: {
    paddingHorizontal: 24,
  },
  breakTypeCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  breakTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  breakTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  breakTypeInfo: {
    flex: 1,
  },
  breakTypeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  breakTypeDetails: {
    fontSize: 14,
  },
  breakTypeStats: {
    alignItems: 'flex-end',
  },
  breakTypeCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  goalCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalSubtitle: {
    fontSize: 14,
  },
  goalPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalProgressContainer: {
    marginBottom: 12,
  },
  goalProgressTrack: {
    height: 8,
    borderRadius: 4,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalMessage: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  insightCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 