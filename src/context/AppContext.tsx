import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, AppMode, Language, Reminder, ConnectionQuest, MemoryItem, GardenPlant, GameScore, CaregiverAlert } from '../types';
import { initialMockState } from '../mockData';

interface AppContextType {
  state: AppState;
  setMode: (mode: AppMode) => void;
  updateProfile: (updates: Partial<AppState['profile']>) => void;
  completeActivity: (gameName: string, score: number, maxScore: number, timeSpent: number) => void;
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'completedToday'>) => void;
  deleteReminder: (id: string) => void;
  completeConnectionQuest: (response: 'happy' | 'calm' | 'loved') => void;
  saveWishCard: (content: string) => void;
  addMemory: (memory: Omit<MemoryItem, 'id' | 'date'>) => void;
  setVoiceActive: (active: boolean) => void;
  speak: (text: string) => void;
  askAI: (prompt: string) => Promise<string>;
  resetOnboarding: () => void;
  addAlert: (message: string, level: CaregiverAlert['level']) => void;
  dismissAlert: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('sneh_app_state_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return initialMockState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sneh_app_state_v2', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Voice speech synthesis helper
  const speak = (text: string) => {
    if (!state.profile.voiceAssistance && !state.isVoiceActive) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for elderly comfort
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const setMode = (mode: AppMode) => {
    setState((prev) => ({ ...prev, mode }));
    speak(mode === 'elder' ? 'Switched to Elder view. Welcome back!' : 'Switched to Caregiver dashboard.');
  };

  const updateProfile = (updates: Partial<AppState['profile']>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  const completeActivity = (gameName: string, score: number, maxScore: number, timeSpent: number) => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timestamp = new Date().toLocaleString();

    const newGameScore: GameScore = {
      gameId: gameName.toLowerCase().replace(/\s+/g, '-'),
      gameName,
      score,
      maxScore,
      difficulty: state.difficultyLevel,
      timestamp,
      timeSpentSeconds: timeSpent,
    };

    // Grow garden plant or add plant
    const newPlantNames = ['Hibiscus Petals', 'Lotus Bloom', 'Frangipani Star', 'Bamboo Shoot', 'Orchid Wonder'];
    const randomName = newPlantNames[Math.floor(Math.random() * newPlantNames.length)];
    const newPlant: GardenPlant = {
      id: 'gp-' + Date.now(),
      name: randomName,
      stage: 'sprout',
      plantedDate: todayStr,
      memory: `Completed ${gameName} wonderfully with score ${score}/${maxScore}!`,
      icon: '🌸',
      health: 100,
    };

    // Update streak (mark today)
    const updatedHistory = state.streakHistory.map((item, idx) => {
      if (idx === 4) return { ...item, completed: true }; // simulate today Friday or current
      return item;
    });

    const newStreak = state.streakCount + 1;
    const isWishUnlocked = newStreak >= 7 || state.wishCardUnlocked;

    setState((prev) => ({
      ...prev,
      streakCount: newStreak,
      streakHistory: updatedHistory,
      wishCardUnlocked: isWishUnlocked,
      gardenPlants: [newPlant, ...prev.gardenPlants],
      gameHistory: [newGameScore, ...prev.gameHistory],
      memories: [
        {
          id: 'mem-' + Date.now(),
          date: todayStr,
          type: 'garden',
          content: `Completed ${gameName} and grew a new ${randomName} in the Memory Garden!`,
        },
        ...prev.memories,
      ],
      alerts: [
        {
          id: 'alt-' + Date.now(),
          timestamp: 'Just now',
          level: 'info',
          message: `${prev.profile.name} completed today's cognitive activity (${gameName}) successfully!`,
          acknowledged: false,
        },
        ...prev.alerts,
      ],
    }));

    speak(`Wonderful work! You completed ${gameName} and your garden grew a new plant.`);
  };

  const toggleReminder = (id: string) => {
    setState((prev) => {
      const updated = prev.reminders.map((r) => {
        if (r.id === id) {
          const newState = !r.completedToday;
          if (newState) {
            speak(`Great job taking your ${r.title}!`);
          }
          return { ...r, completedToday: newState };
        }
        return r;
      });
      return { ...prev, reminders: updated };
    });
  };

  const addReminder = (reminder: Omit<Reminder, 'id' | 'completedToday'>) => {
    const newR: Reminder = {
      ...reminder,
      id: 'rem-' + Date.now(),
      completedToday: false,
    };
    setState((prev) => ({
      ...prev,
      reminders: [...prev.reminders, newR],
    }));
  };

  const deleteReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }));
  };

  const completeConnectionQuest = (response: 'happy' | 'calm' | 'loved') => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setState((prev) => ({
      ...prev,
      connectionQuest: {
        ...prev.connectionQuest,
        completed: true,
        completedDate: todayStr,
        emotionalResponse: response,
      },
      memories: [
        {
          id: 'mem-cq-' + Date.now(),
          date: todayStr,
          type: 'family',
          content: `Completed today's connection quest and felt ${response}!`,
        },
        ...prev.memories,
      ],
    }));
    speak(`That's wonderful! So glad you felt ${response}.`);
  };

  const saveWishCard = (content: string) => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setState((prev) => ({
      ...prev,
      wishCardContent: content,
      memories: [
        {
          id: 'mem-wish-' + Date.now(),
          date: todayStr,
          type: 'wish',
          content: `My Wish / Thought: "${content}"`,
        },
        ...prev.memories,
      ],
    }));
    speak('Your wish has been securely saved in your Memory Journal.');
  };

  const addMemory = (memory: Omit<MemoryItem, 'id' | 'date'>) => {
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newM: MemoryItem = {
      ...memory,
      id: 'mem-add-' + Date.now(),
      date: todayStr,
    };
    setState((prev) => ({
      ...prev,
      memories: [newM, ...prev.memories],
    }));
    speak('Memory added successfully.');
  };

  const setVoiceActive = (active: boolean) => {
    setState((prev) => ({ ...prev, isVoiceActive: active }));
  };

  const askAI = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            name: state.profile.name,
            streak: state.streakCount,
            language: state.profile.language,
          },
          language: state.profile.language,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        speak(data.reply);
        return data.reply;
      }
      return 'I am always here for you, wishing you a calm and happy day!';
    } catch (e) {
      console.error('AI error:', e);
      const fallback = 'You are doing wonderfully today. Keep smiling!';
      speak(fallback);
      return fallback;
    }
  };

  const resetOnboarding = () => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, onboarded: false },
    }));
  };

  const addAlert = (message: string, level: CaregiverAlert['level']) => {
    const newAlt: CaregiverAlert = {
      id: 'alt-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level,
      message,
      acknowledged: false,
    };
    setState((prev) => ({
      ...prev,
      alerts: [newAlt, ...prev.alerts],
    }));
  };

  const dismissAlert = (id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setMode,
        updateProfile,
        completeActivity,
        toggleReminder,
        addReminder,
        deleteReminder,
        completeConnectionQuest,
        saveWishCard,
        addMemory,
        setVoiceActive,
        speak,
        askAI,
        resetOnboarding,
        addAlert,
        dismissAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
