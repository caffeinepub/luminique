import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_POSTS } from '../data/mockPosts';

export interface Post {
  id: string;
  username: string;
  displayName: string;
  tier: 'Starter' | 'GlowUp' | 'GlowPro';
  streak: number;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  taggedProduct?: string;
  likedByUser: boolean;
  avatarGradient: string;
  initials: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  displayName: string;
  streak: number;
  points: number;
  tier: 'Starter' | 'GlowUp' | 'GlowPro';
  initials: string;
  avatarGradient: string;
  isCurrentUser?: boolean;
}

export interface CommunityState {
  posts: Post[];
  leaderboard: LeaderboardEntry[];
}

export interface CommunityActions {
  likePost: (id: string) => void;
}

const defaultLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'ayesha.beauty', displayName: 'Ayesha K.', streak: 45, points: 2340, tier: 'GlowPro', initials: 'AK', avatarGradient: 'from-purple-400 to-pink-400' },
  { rank: 2, username: 'priya_glows', displayName: 'Priya S.', streak: 28, points: 1890, tier: 'GlowPro', initials: 'PS', avatarGradient: 'from-violet-400 to-purple-500' },
  { rank: 3, username: 'divya.glow', displayName: 'Divya M.', streak: 19, points: 1240, tier: 'GlowUp', initials: 'DM', avatarGradient: 'from-pink-300 to-rose-400' },
  { rank: 4, username: 'skincare_sid', displayName: 'Siddharth R.', streak: 12, points: 780, tier: 'GlowUp', initials: 'SR', avatarGradient: 'from-blue-300 to-indigo-400' },
  { rank: 5, username: 'rohit_skincare', displayName: 'Rohit P.', streak: 7, points: 320, tier: 'Starter', initials: 'RP', avatarGradient: 'from-green-300 to-teal-400' },
];

export const useCommunityStore = create<CommunityState & CommunityActions>()(
  persist(
    (set) => ({
      posts: MOCK_POSTS,
      leaderboard: defaultLeaderboard,

      likePost: (id) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likedByUser: !post.likedByUser,
                  likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
                }
              : post
          ),
        })),
    }),
    {
      name: 'luminique-community',
      partialize: (state) => ({
        posts: state.posts,
      }),
    }
  )
);
