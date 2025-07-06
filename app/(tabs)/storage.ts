import AsyncStorage from '@react-native-async-storage/async-storage';

// Data Types
export interface BreakSession {
  id: string;
  type: 'stretch' | 'breathing' | 'walking' | 'eyes' | 'hydration' | 'mindful';
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  completed: boolean;
  date: string; // YYYY-MM-DD format
}

export interface DailyStats {
  date: string;
  breaksCompleted: number;
  totalBreakTime: number; // in seconds
  appOpens: number;
  streakDay: boolean;
  breaksByType: Record<string, number>;
}

export interface UserSettings {
  breakFrequency: number; // minutes
  notificationsEnabled: boolean;
  dailyGoal: number; // number of breaks
  reminderStyle: 'gentle' | 'persistent';
  workingHours: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
  enabledBreakTypes: string[];
}

export interface UserProgress {
  totalBreaks: number;
  currentStreak: number;
  longestStreak: number;
  lastBreakDate: string;
  totalBreakTime: number; // in seconds
  achievementsUnlocked: string[];
}

export interface OnboardingPreferences {
  improvementGoals: string[];
  codingHours: number;
  takesBreaks: boolean;
  mainChallenge: string;
  enabledRoutines: string[];
  completedAt: string;
  personalizedMessage?: string;
}

// Storage Keys
const STORAGE_KEYS = {
  BREAK_SESSIONS: 'break_sessions',
  DAILY_STATS: 'daily_stats',
  USER_SETTINGS: 'user_settings',
  USER_PROGRESS: 'user_progress',
  LAST_APP_OPEN: 'last_app_open',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FIRST_TIME_USER: 'first_time_user',
  ONBOARDING_PREFERENCES: 'onboarding_preferences',
} as const;

// Storage Service
export class StorageService {
  // Break Sessions
  static async saveBreakSession(session: BreakSession): Promise<void> {
    try {
      const existingSessions = await this.getBreakSessions();
      const updatedSessions = [...existingSessions, session];
      await AsyncStorage.setItem(STORAGE_KEYS.BREAK_SESSIONS, JSON.stringify(updatedSessions));
      
      // Update daily stats
      await this.updateDailyStats(session);
      await this.updateUserProgress(session);
    } catch (error) {
      console.error('Error saving break session:', error);
    }
  }

  static async getBreakSessions(): Promise<BreakSession[]> {
    try {
      const sessions = await AsyncStorage.getItem(STORAGE_KEYS.BREAK_SESSIONS);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error getting break sessions:', error);
      return [];
    }
  }

  static async getBreakSessionsForDate(date: string): Promise<BreakSession[]> {
    const allSessions = await this.getBreakSessions();
    return allSessions.filter(session => session.date === date);
  }

  static async getBreakSessionsForDateRange(startDate: string, endDate: string): Promise<BreakSession[]> {
    const allSessions = await this.getBreakSessions();
    return allSessions.filter(session => 
      session.date >= startDate && session.date <= endDate
    );
  }

  // Daily Stats
  static async updateDailyStats(session: BreakSession): Promise<void> {
    try {
      const today = this.getTodayString();
      const dailyStats = await this.getDailyStats();
      
      let todayStats = dailyStats.find(stats => stats.date === today);
      if (!todayStats) {
        todayStats = {
          date: today,
          breaksCompleted: 0,
          totalBreakTime: 0,
          appOpens: await this.getTodayAppOpens(),
          streakDay: false,
          breaksByType: {},
        };
        dailyStats.push(todayStats);
      }

      if (session.completed) {
        todayStats.breaksCompleted++;
        todayStats.totalBreakTime += session.duration;
        todayStats.breaksByType[session.type] = (todayStats.breaksByType[session.type] || 0) + 1;
        todayStats.streakDay = todayStats.breaksCompleted >= await this.getUserSettings().then(s => s.dailyGoal);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(dailyStats));
    } catch (error) {
      console.error('Error updating daily stats:', error);
    }
  }

  static async getDailyStats(): Promise<DailyStats[]> {
    try {
      const stats = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STATS);
      return stats ? JSON.parse(stats) : [];
    } catch (error) {
      console.error('Error getting daily stats:', error);
      return [];
    }
  }

  static async getTodayStats(): Promise<DailyStats> {
    const today = this.getTodayString();
    const dailyStats = await this.getDailyStats();
    let todayStats = dailyStats.find(stats => stats.date === today);
    
    if (!todayStats) {
      todayStats = {
        date: today,
        breaksCompleted: 0,
        totalBreakTime: 0,
        appOpens: await this.getTodayAppOpens(),
        streakDay: false,
        breaksByType: {},
      };
    }
    
    return todayStats;
  }

  // User Settings
  static async getUserSettings(): Promise<UserSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      const defaultSettings: UserSettings = {
        breakFrequency: 60, // every hour
        notificationsEnabled: true,
        dailyGoal: 8,
        reminderStyle: 'gentle',
        workingHours: {
          start: '09:00',
          end: '17:00',
        },
        enabledBreakTypes: ['stretch', 'breathing', 'eyes', 'hydration'],
      };
      
      return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return {
        breakFrequency: 60,
        notificationsEnabled: true,
        dailyGoal: 8,
        reminderStyle: 'gentle',
        workingHours: { start: '09:00', end: '17:00' },
        enabledBreakTypes: ['stretch', 'breathing', 'eyes', 'hydration'],
      };
    }
  }

  static async updateUserSettings(updates: Partial<UserSettings>): Promise<void> {
    try {
      const currentSettings = await this.getUserSettings();
      const newSettings = { ...currentSettings, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  }

  // User Progress
  static async updateUserProgress(session: BreakSession): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      
      if (session.completed) {
        progress.totalBreaks++;
        progress.totalBreakTime += session.duration;
        progress.lastBreakDate = session.date;
        
        // Update streak
        const yesterday = this.getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
        const today = this.getTodayString();
        
        if (session.date === today) {
          const todayStats = await this.getTodayStats();
          if (todayStats.streakDay && (progress.lastBreakDate === yesterday || progress.currentStreak === 0)) {
            progress.currentStreak++;
            if (progress.currentStreak > progress.longestStreak) {
              progress.longestStreak = progress.currentStreak;
            }
          }
        }
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  static async getUserProgress(): Promise<UserProgress> {
    try {
      const progress = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      const defaultProgress: UserProgress = {
        totalBreaks: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastBreakDate: '',
        totalBreakTime: 0,
        achievementsUnlocked: [],
      };
      
      return progress ? { ...defaultProgress, ...JSON.parse(progress) } : defaultProgress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {
        totalBreaks: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastBreakDate: '',
        totalBreakTime: 0,
        achievementsUnlocked: [],
      };
    }
  }

  // App Usage Tracking
  static async recordAppOpen(): Promise<void> {
    try {
      const today = this.getTodayString();
      const lastOpen = await AsyncStorage.getItem(STORAGE_KEYS.LAST_APP_OPEN);
      
      if (lastOpen !== today) {
        // New day, reset counter
        await AsyncStorage.setItem(`app_opens_${today}`, '1');
      } else {
        // Increment today's counter
        const todayOpens = await AsyncStorage.getItem(`app_opens_${today}`);
        const count = todayOpens ? parseInt(todayOpens) + 1 : 1;
        await AsyncStorage.setItem(`app_opens_${today}`, count.toString());
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_APP_OPEN, today);
    } catch (error) {
      console.error('Error recording app open:', error);
    }
  }

  static async getTodayAppOpens(): Promise<number> {
    try {
      const today = this.getTodayString();
      const opens = await AsyncStorage.getItem(`app_opens_${today}`);
      return opens ? parseInt(opens) : 0;
    } catch (error) {
      console.error('Error getting today app opens:', error);
      return 0;
    }
  }

  // Utility Methods
  static getTodayString(): string {
    return this.getDateString(new Date());
  }

  static getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Onboarding Management
  static async isFirstTimeUser(): Promise<boolean> {
    try {
      const firstTimeFlag = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_TIME_USER);
      return firstTimeFlag === null; // If no flag exists, it's a first-time user
    } catch (error) {
      console.error('Error checking first-time user:', error);
      return true; // Default to first-time user on error
    }
  }

  static async setFirstTimeUserCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_TIME_USER, 'false');
    } catch (error) {
      console.error('Error setting first-time user completed:', error);
    }
  }

  static async isOnboardingCompleted(): Promise<boolean> {
    try {
      const onboardingFlag = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return onboardingFlag === 'true';
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      return false; // Default to not completed on error
    }
  }

  static async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  }

  // Onboarding Preferences Management
  static async saveOnboardingPreferences(preferences: OnboardingPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving onboarding preferences:', error);
    }
  }

  static async getOnboardingPreferences(): Promise<OnboardingPreferences | null> {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_PREFERENCES);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Error getting onboarding preferences:', error);
      return null;
    }
  }

  static async updateOnboardingPreferences(updates: Partial<OnboardingPreferences>): Promise<void> {
    try {
      const currentPreferences = await this.getOnboardingPreferences();
      if (currentPreferences) {
        const newPreferences = { ...currentPreferences, ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_PREFERENCES, JSON.stringify(newPreferences));
      }
    } catch (error) {
      console.error('Error updating onboarding preferences:', error);
    }
  }

  static async exportOnboardingPreferences(): Promise<string | null> {
    try {
      const preferences = await this.getOnboardingPreferences();
      if (preferences) {
        return JSON.stringify(preferences, null, 2);
      }
      return null;
    } catch (error) {
      console.error('Error exporting onboarding preferences:', error);
      return null;
    }
  }

  // Clear all data (for testing/reset)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      // Also clear daily app opens
      const keys = await AsyncStorage.getAllKeys();
      const appOpenKeys = keys.filter((key: string) => key.startsWith('app_opens_'));
      await AsyncStorage.multiRemove(appOpenKeys);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
} 