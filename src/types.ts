export type AppMode = 'elder' | 'caregiver';

export type Language = 'en' | 'hi' | 'bn' | 'as';

export interface PatientProfile {
  name: string;
  age: number;
  location: string;
  language: Language;
  voiceAssistance: boolean;
  reminderAssistance: boolean;
  onboarded: boolean;
}

export type GardenStage = 'seed' | 'sprout' | 'flower' | 'mature' | 'tree';

export interface GardenPlant {
  id: string;
  name: string;
  stage: GardenStage;
  plantedDate: string;
  memory: string;
  icon: string;
  health: number; // 0-100
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  type: 'medicine' | 'hydration' | 'meal' | 'appointment' | 'activity';
  completedToday: boolean;
  icon: string;
  notes?: string;
}

export interface ConnectionQuest {
  id: string;
  task: string;
  completed: boolean;
  completedDate?: string;
  emotionalResponse?: 'happy' | 'calm' | 'loved';
}

export interface MemoryItem {
  id: string;
  date: string;
  type: 'wish' | 'thought' | 'voice' | 'garden' | 'family';
  content: string;
  audioUrl?: string;
}

export interface GameScore {
  gameId: string;
  gameName: string;
  score: number;
  maxScore: number;
  difficulty: 'gentle' | 'comfortable' | 'challenge';
  timestamp: string;
  timeSpentSeconds: number;
}

export interface CaregiverAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'urgent';
  message: string;
  acknowledged: boolean;
}

export interface AppState {
  mode: AppMode;
  profile: PatientProfile;
  streakCount: number;
  streakHistory: { day: string; completed: boolean }[];
  wishCardUnlocked: boolean;
  wishCardContent: string;
  gardenPlants: GardenPlant[];
  reminders: Reminder[];
  connectionQuest: ConnectionQuest;
  memories: MemoryItem[];
  gameHistory: GameScore[];
  alerts: CaregiverAlert[];
  isVoiceActive: boolean;
  offlineMode: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  difficultyLevel: 'gentle' | 'comfortable' | 'challenge';
}
