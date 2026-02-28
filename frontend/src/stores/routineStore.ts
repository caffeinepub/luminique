import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RoutineStep {
  id: string;
  name: string;
  completed: boolean;
  icon: string;
}

export interface RoutineHistoryEntry {
  date: string; // ISO date string YYYY-MM-DD
  morning: boolean;
  evening: boolean;
}

export interface RoutineState {
  todayMorningSteps: RoutineStep[];
  todayEveningSteps: RoutineStep[];
  history: RoutineHistoryEntry[];
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string;
  morningCompletedToday: boolean;
  eveningCompletedToday: boolean;
}

export interface RoutineActions {
  completeMorningStep: (id: string) => void;
  completeEveningStep: (id: string) => void;
  completeFullRoutine: (type: 'morning' | 'evening') => void;
  resetDailySteps: () => void;
  checkAndResetForNewDay: () => void;
}

const defaultMorningSteps: RoutineStep[] = [
  { id: 'm1', name: 'Cleanser', completed: false, icon: '🧴' },
  { id: 'm2', name: 'Toner', completed: false, icon: '💧' },
  { id: 'm3', name: 'Serum', completed: false, icon: '✨' },
  { id: 'm4', name: 'Moisturizer', completed: false, icon: '🌿' },
  { id: 'm5', name: 'SPF', completed: false, icon: '☀️' },
];

const defaultEveningSteps: RoutineStep[] = [
  { id: 'e1', name: 'Makeup Remover', completed: false, icon: '🌙' },
  { id: 'e2', name: 'Cleanser', completed: false, icon: '🧴' },
  { id: 'e3', name: 'Toner', completed: false, icon: '💧' },
  { id: 'e4', name: 'Serum', completed: false, icon: '✨' },
  { id: 'e5', name: 'Night Cream', completed: false, icon: '🌸' },
];

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function calculateStreak(history: RoutineHistoryEntry[]): number {
  if (history.length === 0) return 0;
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const hasActivity = entry.morning || entry.evening;
    if (!hasActivity) break;
    if (i === 0 && entry.date !== today && entry.date !== yesterdayStr) break;
    if (i > 0) {
      const prevDate = new Date(sorted[i - 1].date);
      const currDate = new Date(entry.date);
      const diff = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff > 1) break;
    }
    streak++;
  }
  return streak;
}

export const useRoutineStore = create<RoutineState & RoutineActions>()(
  persist(
    (set, get) => ({
      todayMorningSteps: defaultMorningSteps.map(s => ({ ...s })),
      todayEveningSteps: defaultEveningSteps.map(s => ({ ...s })),
      history: [],
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedDate: '',
      morningCompletedToday: false,
      eveningCompletedToday: false,

      completeMorningStep: (id) =>
        set((state) => ({
          todayMorningSteps: state.todayMorningSteps.map((s) =>
            s.id === id ? { ...s, completed: true } : s
          ),
        })),

      completeEveningStep: (id) =>
        set((state) => ({
          todayEveningSteps: state.todayEveningSteps.map((s) =>
            s.id === id ? { ...s, completed: true } : s
          ),
        })),

      completeFullRoutine: (type) => {
        const state = get();
        const today = getTodayString();
        const existingEntry = state.history.find((h) => h.date === today);
        let newHistory: RoutineHistoryEntry[];

        if (existingEntry) {
          newHistory = state.history.map((h) =>
            h.date === today
              ? { ...h, [type]: true }
              : h
          );
        } else {
          newHistory = [
            ...state.history,
            { date: today, morning: type === 'morning', evening: type === 'evening' },
          ];
        }

        const newStreak = calculateStreak(newHistory);
        const newBestStreak = Math.max(state.bestStreak, newStreak);

        const allMorningDone = type === 'morning'
          ? true
          : state.morningCompletedToday;
        const allEveningDone = type === 'evening'
          ? true
          : state.eveningCompletedToday;

        set({
          history: newHistory,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          lastCompletedDate: today,
          morningCompletedToday: type === 'morning' ? true : state.morningCompletedToday,
          eveningCompletedToday: type === 'evening' ? true : state.eveningCompletedToday,
          todayMorningSteps: type === 'morning'
            ? state.todayMorningSteps.map(s => ({ ...s, completed: true }))
            : state.todayMorningSteps,
          todayEveningSteps: type === 'evening'
            ? state.todayEveningSteps.map(s => ({ ...s, completed: true }))
            : state.todayEveningSteps,
        });

        return { allMorningDone, allEveningDone, newStreak };
      },

      resetDailySteps: () =>
        set({
          todayMorningSteps: defaultMorningSteps.map(s => ({ ...s })),
          todayEveningSteps: defaultEveningSteps.map(s => ({ ...s })),
          morningCompletedToday: false,
          eveningCompletedToday: false,
        }),

      checkAndResetForNewDay: () => {
        const state = get();
        const today = getTodayString();
        if (state.lastCompletedDate && state.lastCompletedDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          if (state.lastCompletedDate !== yesterdayStr) {
            // More than 1 day gap, reset streak
            set({ currentStreak: 0 });
          }
          set({
            todayMorningSteps: defaultMorningSteps.map(s => ({ ...s })),
            todayEveningSteps: defaultEveningSteps.map(s => ({ ...s })),
            morningCompletedToday: false,
            eveningCompletedToday: false,
          });
        }
      },
    }),
    {
      name: 'luminique-routine',
    }
  )
);
