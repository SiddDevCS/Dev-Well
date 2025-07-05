import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StorageService, BreakSession } from './storage';

const { width } = Dimensions.get('window');

interface BreakTimerProps {
  breakType: 'stretch' | 'breathing' | 'walking' | 'eyes' | 'hydration' | 'mindful';
  onComplete: () => void;
  onCancel: () => void;
}

const BREAK_CONFIGS = {
  stretch: {
    title: 'Stretch Break',
    icon: 'stretch',
    duration: 5 * 60, // 5 minutes
    instructions: [
      'Stand up and stretch your arms above your head',
      'Roll your shoulders backward 10 times',
      'Stretch your neck side to side',
      'Touch your toes and hold for 10 seconds',
      'Stretch your wrists and fingers',
    ],
  },
  breathing: {
    title: 'Breathing Exercise',
    icon: 'lungs',
    duration: 3 * 60, // 3 minutes
    instructions: [
      'Sit comfortably with your back straight',
      'Breathe in slowly through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Repeat this cycle calmly',
    ],
  },
  walking: {
    title: 'Walking Break',
    icon: 'walking',
    duration: 10 * 60, // 10 minutes
    instructions: [
      'Step away from your desk',
      'Walk around your space or go outside',
      'Move at a comfortable pace',
      'Focus on your surroundings',
      'Take deep breaths while walking',
    ],
  },
  eyes: {
    title: 'Eye Rest',
    icon: 'eye',
    duration: 2 * 60, // 2 minutes
    instructions: [
      'Look away from your screen',
      'Focus on something 20 feet away for 20 seconds',
      'Blink slowly 10 times',
      'Close your eyes and rest them',
      'Gently massage your temples',
    ],
  },
  hydration: {
    title: 'Hydration Break',
    icon: 'tint',
    duration: 1 * 60, // 1 minute
    instructions: [
      'Get a glass of water',
      'Drink slowly and mindfully',
      'Take a moment to appreciate the refreshment',
      'Notice how your body feels',
      'Stay hydrated throughout the day',
    ],
  },
  mindful: {
    title: 'Mindful Moment',
    icon: 'peace',
    duration: 5 * 60, // 5 minutes
    instructions: [
      'Find a quiet space',
      'Close your eyes and focus on your breathing',
      'Notice your thoughts without judgment',
      'Bring your attention back to your breath',
      'Feel grateful for this moment of peace',
    ],
  },
};

export default function BreakTimer({ breakType, onComplete, onCancel }: BreakTimerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const config = BREAK_CONFIGS[breakType];
  
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [isActive, setIsActive] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [sessionId] = useState(StorageService.generateId());
  const [startTime] = useState(Date.now());
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleComplete().catch((error) => console.error(error));
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    // Update progress animation
    const progress = 1 - (timeLeft / config.duration);
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  useEffect(() => {
    // Pulse animation for timer
    const pulse = Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    if (isActive) {
      Animated.loop(pulse).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isActive]);

  useEffect(() => {
    // Auto-advance instructions
    if (isActive && config.instructions.length > 1) {
      const instructionInterval = config.duration / config.instructions.length;
      const elapsed = config.duration - timeLeft;
      const newIndex = Math.min(
        Math.floor(elapsed / instructionInterval),
        config.instructions.length - 1
      );
      setCurrentInstructionIndex(newIndex);
    }
  }, [timeLeft, isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleComplete = async () => {
    const endTime = Date.now();
    const session: BreakSession = {
      id: sessionId,
      type: breakType,
      startTime,
      endTime,
      duration: Math.floor((endTime - startTime) / 1000),
      completed: true,
      date: StorageService.getTodayString(),
    };

    await StorageService.saveBreakSession(session);
    onComplete();
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Break?',
      'Are you sure you want to cancel this break?',
      [
        {
          text: 'Continue Break',
          style: 'cancel',
        },
        {
          text: 'Cancel Break',
          style: 'destructive',
          onPress: async () => {
            const endTime = Date.now();
            const session: BreakSession = {
              id: sessionId,
              type: breakType,
              startTime,
              endTime,
              duration: Math.floor((endTime - startTime) / 1000),
              completed: false,
              date: StorageService.getTodayString(),
            };

            await StorageService.saveBreakSession(session);
            onCancel();
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / config.duration);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <FontAwesome5 name="times" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          {config.title}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <Animated.View 
          style={[
            styles.timerCircle,
            { 
              borderColor: Colors[colorScheme].primary,
              transform: [{ scale: pulseAnimation }],
            }
          ]}
        >
          <FontAwesome5 
            name={config.icon} 
            size={60} 
            color={Colors[colorScheme].primary} 
          />
          <Text style={[styles.timerText, { color: Colors[colorScheme].text }]}>
            {formatTime(timeLeft)}
          </Text>
        </Animated.View>
        
        {/* Progress Ring */}
        <View style={styles.progressRing}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                backgroundColor: Colors[colorScheme].primary,
                transform: [
                  {
                    rotate: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-90deg', '270deg'],
                    })
                  }
                ]
              }
            ]}
          />
        </View>
      </View>

      {/* Current Instruction */}
      <View style={[styles.instructionContainer, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.instructionTitle, { color: Colors[colorScheme].text }]}>
          Step {currentInstructionIndex + 1} of {config.instructions.length}
        </Text>
        <Text style={[styles.instructionText, { color: Colors[colorScheme].text }]}>
          {config.instructions[currentInstructionIndex]}
        </Text>
      </View>

      {/* All Instructions */}
      <View style={styles.allInstructionsContainer}>
        <Text style={[styles.allInstructionsTitle, { color: Colors[colorScheme].text }]}>
          Break Instructions:
        </Text>
        {config.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={[
              styles.instructionDot,
              { 
                backgroundColor: index <= currentInstructionIndex 
                  ? Colors[colorScheme].primary 
                  : Colors[colorScheme].border 
              }
            ]} />
            <Text style={[
              styles.instructionItemText,
              { 
                color: index <= currentInstructionIndex 
                  ? Colors[colorScheme].text 
                  : Colors[colorScheme].placeholder 
              }
            ]}>
              {instruction}
            </Text>
          </View>
        ))}
      </View>

      {/* Control Button */}
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: Colors[colorScheme].primary }]}
        onPress={isActive ? handlePause : handleStart}
      >
        <FontAwesome5 
          name={isActive ? 'pause' : 'play'} 
          size={20} 
          color="white" 
        />
        <Text style={styles.controlButtonText}>
          {isActive ? 'Pause' : 'Start'} Break
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cancelButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(77, 182, 172, 0.1)',
  },
  timerText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
  },
  progressRing: {
    position: 'absolute',
    width: 208,
    height: 208,
    borderRadius: 104,
    overflow: 'hidden',
  },
  progressFill: {
    width: '50%',
    height: '100%',
    position: 'absolute',
    right: 0,
    borderRadius: 104,
    transformOrigin: 'left center',
  },
  instructionContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.7,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  allInstructionsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  allInstructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  instructionItemText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 