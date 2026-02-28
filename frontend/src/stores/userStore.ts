import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Tier = 'Starter' | 'GlowUp' | 'GlowPro';

export interface UserState {
  name: string;
  email: string;
  gender: string;
  ageRange: string;
  skinType: string;
  skinConcerns: string[];
  routinePreference: string;
  glowPoints: number;
  streak: number;
  bestStreak: number;
  tier: Tier;
  totalRoutinesCompleted: number;
  productsReviewed: number;
  hasCompletedOnboarding: boolean;
  memberSince: string;
  hasFirstPurchase: boolean;
  notificationsEnabled: boolean;
  marketingEnabled: boolean;
  analyticsEnabled: boolean;
}

export interface UserActions {
  updateProfile: (data: Partial<UserState>) => void;
  addGlowPoints: (amount: number) => void;
  updateStreak: (streak: number) => void;
  incrementRoutinesCompleted: () => void;
  completeOnboarding: (data: Partial<UserState>) => void;
  setFirstPurchase: () => void;
  toggleNotifications: () => void;
  toggleMarketing: () => void;
  toggleAnalytics: () => void;
  reset: () => void;
}

function calculateTier(points: number): Tier {
  if (points >= 1500) return 'GlowPro';
  if (points >= 500) return 'GlowUp';
  return 'Starter';
}

const defaultState: UserState = {
  name: '',
  email: '',
  gender: '',
  ageRange: '',
  skinType: '',
  skinConcerns: [],
  routinePreference: '',
  glowPoints: 0,
  streak: 0,
  bestStreak: 0,
  tier: 'Starter',
  totalRoutinesCompleted: 0,
  productsReviewed: 0,
  hasCompletedOnboarding: false,
  memberSince: new Date().toISOString(),
  hasFirstPurchase: false,
  notificationsEnabled: true,
  marketingEnabled: false,
  analyticsEnabled: true,
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      ...defaultState,

      updateProfile: (data) => set((state) => ({ ...state, ...data })),

      addGlowPoints: (amount) =>
        set((state) => {
          const newPoints = state.glowPoints + amount;
          return {
            glowPoints: newPoints,
            tier: calculateTier(newPoints),
          };
        }),

      updateStreak: (streak) =>
        set((state) => ({
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
        })),

      incrementRoutinesCompleted: () =>
        set((state) => ({
          totalRoutinesCompleted: state.totalRoutinesCompleted + 1,
        })),

      completeOnboarding: (data) =>
        set((state) => ({
          ...state,
          ...data,
          hasCompletedOnboarding: true,
          memberSince: new Date().toISOString(),
        })),

      setFirstPurchase: () => set({ hasFirstPurchase: true }),

      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      toggleMarketing: () =>
        set((state) => ({ marketingEnabled: !state.marketingEnabled })),

      toggleAnalytics: () =>
        set((state) => ({ analyticsEnabled: !state.analyticsEnabled })),

      reset: () => set(defaultState),
    }),
    {
      name: 'luminique-user',
    }
  )
);
