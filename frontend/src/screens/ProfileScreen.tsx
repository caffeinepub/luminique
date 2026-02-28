import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRight, Edit2, Lock, Bell, BarChart2, Shield, Heart, Star } from 'lucide-react';
import BottomTabBar from '../components/layout/BottomTabBar';
import { useUserStore } from '../stores/userStore';
import { useRoutineStore } from '../stores/routineStore';
import { useShopStore } from '../stores/shopStore';
import { getNextTierInfo } from '../utils/gamification';

const ACHIEVEMENTS = [
  {
    id: 'first_streak',
    icon: '🔥',
    label: 'First Streak',
    desc: '7-day streak',
    check: (streak: number, _pts: number, _rev: number, _fp: boolean) => streak >= 7,
  },
  {
    id: 'full_bloom',
    icon: '🌸',
    label: 'Full Bloom',
    desc: '30-day streak',
    check: (streak: number, _pts: number, _rev: number, _fp: boolean) => streak >= 30,
  },
  {
    id: 'first_review',
    icon: '⭐',
    label: 'First Review',
    desc: 'Write a review',
    check: (_streak: number, _pts: number, rev: number, _fp: boolean) => rev > 0,
  },
  {
    id: 'first_purchase',
    icon: '🛍️',
    label: 'First Purchase',
    desc: 'Buy a product',
    check: (_streak: number, _pts: number, _rev: number, fp: boolean) => fp,
  },
  {
    id: 'glowpro_tier',
    icon: '👑',
    label: 'GlowPro Tier',
    desc: '1500+ points',
    check: (_streak: number, pts: number, _rev: number, _fp: boolean) => pts >= 1500,
  },
  {
    id: 'top_achiever',
    icon: '💎',
    label: 'Top Achiever',
    desc: '45-day streak',
    check: (streak: number, _pts: number, _rev: number, _fp: boolean) => streak >= 45,
  },
];

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ icon, label, description, value, onToggle }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(123,75,183,0.1)' }}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: '#111111' }}>{label}</p>
        <p className="text-xs" style={{ color: '#6B6B8A' }}>{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? '#7B4BB7' : 'rgba(188,166,230,0.4)' }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: value ? '26px' : '2px' }}
      />
    </button>
  </div>
);

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    name,
    email,
    glowPoints,
    tier,
    totalRoutinesCompleted,
    productsReviewed,
    memberSince,
    hasFirstPurchase,
    notificationsEnabled,
    marketingEnabled,
    analyticsEnabled,
    toggleNotifications,
    toggleMarketing,
    toggleAnalytics,
    reset,
  } = useUserStore();

  const { history, currentStreak, bestStreak } = useRoutineStore();
  const { wishlist, products } = useShopStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const tierInfo = getNextTierInfo(glowPoints);
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'GL';
  const memberDate = new Date(memberSince).toLocaleDateString('en', {
    month: 'long',
    year: 'numeric',
  });

  // Completion rates over last 30 days
  const last30Dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  const morningRate = Math.round(
    (history.filter((h) => last30Dates.includes(h.date) && h.morning).length / 30) * 100
  );
  const eveningRate = Math.round(
    (history.filter((h) => last30Dates.includes(h.date) && h.evening).length / 30) * 100
  );

  // Weekly chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = history.find((h) => h.date === dateStr);
    const dayLabel = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
    const value = entry
      ? entry.morning && entry.evening
        ? 2
        : entry.morning || entry.evening
        ? 1
        : 0
      : 0;
    return { dayLabel, value };
  });

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    a.check(currentStreak, glowPoints, productsReviewed, hasFirstPurchase)
  ).map((a) => a.id);

  return (
    <div className="mobile-container">
      <div className="screen-content overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-5 pt-12 pb-4">
          <h1 className="text-xl font-semibold" style={{ color: '#111111' }}>My Profile 👤</h1>
        </div>

        {/* Profile Card */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold truncate" style={{ color: '#111111' }}>
                {name || 'Glow User'}
              </h2>
              <p className="text-xs truncate" style={{ color: '#6B6B8A' }}>{email || 'No email set'}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B6B8A' }}>Member since {memberDate}</p>
            </div>
            <button
              className="p-2 rounded-xl flex-shrink-0"
              style={{ background: 'rgba(123,75,183,0.1)' }}
            >
              <Edit2 size={16} style={{ color: '#7B4BB7' }} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mx-5 mb-4 grid grid-cols-2 gap-3">
          {[
            { label: 'GlowPoints', value: glowPoints.toLocaleString(), icon: '✨', color: '#7B4BB7' },
            { label: 'Current Streak', value: `${currentStreak} days`, icon: '🔥', color: '#D4A843' },
            { label: 'Routines Done', value: totalRoutinesCompleted.toString(), icon: '🌸', color: '#7ED1B2' },
            { label: 'Best Streak', value: `${bestStreak} days`, icon: '🏆', color: '#5B2D91' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px]" style={{ color: '#6B6B8A' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tier Card */}
        <div
          className="mx-5 mb-4 rounded-3xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'rgba(255,255,255,0.3)', transform: 'translate(30%, -30%)' }}
          />
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-xs mb-0.5">Current Tier</p>
              <p className="text-white text-xl font-bold">
                {tier === 'GlowPro' ? '👑 GlowPro' : tier === 'GlowUp' ? '⭐ GlowUp' : '🌱 Starter'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">Points</p>
              <p className="text-white text-xl font-bold">{glowPoints.toLocaleString()}</p>
            </div>
          </div>
          {glowPoints < 1500 && (
            <>
              <div className="h-2 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(tierInfo.progress, 100)}%`,
                    background: 'rgba(255,255,255,0.8)',
                  }}
                />
              </div>
              <p className="text-white/70 text-xs">
                {tierInfo.threshold - glowPoints} points to {tierInfo.name}
              </p>
            </>
          )}
          {glowPoints >= 1500 && (
            <p className="text-white/80 text-xs">🎉 You've reached the highest tier!</p>
          )}
        </div>

        {/* Achievements */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <p className="font-semibold mb-3" style={{ color: '#111111' }}>🏅 Achievements</p>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center gap-1 p-3 rounded-2xl text-center"
                  style={{
                    background: isUnlocked
                      ? 'rgba(123,75,183,0.1)'
                      : 'rgba(188,166,230,0.1)',
                    border: isUnlocked
                      ? '1px solid rgba(123,75,183,0.3)'
                      : '1px solid rgba(188,166,230,0.2)',
                    opacity: isUnlocked ? 1 : 0.45,
                  }}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <p
                    className="text-[10px] font-semibold leading-tight"
                    style={{ color: isUnlocked ? '#7B4BB7' : '#6B6B8A' }}
                  >
                    {achievement.label}
                  </p>
                  <p className="text-[9px]" style={{ color: '#6B6B8A' }}>{achievement.desc}</p>
                  {isUnlocked && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#7ED1B2' }}>
                      ✓ Unlocked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Routines Summary */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <p className="font-semibold mb-3" style={{ color: '#111111' }}>📊 My Routines</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-2xl text-center" style={{ background: 'rgba(212,168,67,0.1)' }}>
              <p className="text-2xl font-bold" style={{ color: '#D4A843' }}>{morningRate}%</p>
              <p className="text-xs" style={{ color: '#6B6B8A' }}>☀️ Morning (30d)</p>
            </div>
            <div className="p-3 rounded-2xl text-center" style={{ background: 'rgba(123,75,183,0.1)' }}>
              <p className="text-2xl font-bold" style={{ color: '#7B4BB7' }}>{eveningRate}%</p>
              <p className="text-xs" style={{ color: '#6B6B8A' }}>🌙 Evening (30d)</p>
            </div>
          </div>
          {/* Weekly bar chart */}
          <p className="text-xs font-medium mb-2" style={{ color: '#6B6B8A' }}>This week</p>
          <div className="flex items-end gap-1 h-14">
            {last7.map(({ dayLabel, value }, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: value === 2 ? '100%' : value === 1 ? '50%' : '8%',
                    background:
                      value === 2
                        ? 'linear-gradient(180deg, #7B4BB7, #BCA6E6)'
                        : value === 1
                        ? 'linear-gradient(180deg, #BCA6E6, #E8DFF5)'
                        : 'rgba(188,166,230,0.2)',
                    minHeight: 4,
                  }}
                />
                <span className="text-[9px]" style={{ color: '#6B6B8A' }}>{dayLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wishlist */}
        {wishlistProducts.length > 0 && (
          <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} style={{ color: '#ef4444' }} fill="#ef4444" />
              <p className="font-semibold" style={{ color: '#111111' }}>Wishlist ({wishlistProducts.length})</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <div className={`h-16 bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                    <span className="text-2xl">{p.icon}</span>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] font-semibold truncate" style={{ color: '#111111' }}>{p.name}</p>
                    <p className="text-[10px]" style={{ color: '#7B4BB7' }}>₹{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <p className="font-semibold mb-3" style={{ color: '#111111' }}>⚙️ Settings</p>

          <ToggleRow
            icon={<Bell size={16} style={{ color: '#7B4BB7' }} />}
            label="Notifications"
            description="Routine reminders & alerts"
            value={notificationsEnabled}
            onToggle={toggleNotifications}
          />
          <div className="h-px my-1" style={{ background: 'rgba(188,166,230,0.3)' }} />
          <ToggleRow
            icon={<BarChart2 size={16} style={{ color: '#7B4BB7' }} />}
            label="Analytics"
            description="Help improve the app"
            value={analyticsEnabled}
            onToggle={toggleAnalytics}
          />
          <div className="h-px my-1" style={{ background: 'rgba(188,166,230,0.3)' }} />
          <ToggleRow
            icon={<Star size={16} style={{ color: '#7B4BB7' }} />}
            label="Marketing Emails"
            description="Product recommendations"
            value={marketingEnabled}
            onToggle={toggleMarketing}
          />
          <div className="h-px my-1" style={{ background: 'rgba(188,166,230,0.3)' }} />

          {/* Data Privacy Link */}
          <button
            onClick={() => navigate({ to: '/privacy' })}
            className="flex items-center justify-between w-full py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(123,75,183,0.1)' }}>
                <Shield size={16} style={{ color: '#7B4BB7' }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: '#111111' }}>Data Privacy</p>
                <p className="text-xs" style={{ color: '#6B6B8A' }}>View privacy policy</p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: '#6B6B8A' }} />
          </button>
        </div>

        {/* Privacy Badge */}
        <div
          className="mx-5 mb-4 rounded-2xl p-3 flex items-center gap-3"
          style={{ background: 'rgba(126,209,178,0.15)', border: '1px solid rgba(126,209,178,0.4)' }}
        >
          <Lock size={18} style={{ color: '#5B8A5B' }} />
          <p className="text-xs font-medium" style={{ color: '#5B8A5B' }}>
            🔒 We never sell your data. Your privacy is our priority.
          </p>
        </div>

        {/* Reset / Danger Zone */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <p className="text-sm font-semibold mb-3" style={{ color: '#111111' }}>Account</p>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-2xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(239,68,68,0.08)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              Reset All Data
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-center" style={{ color: '#6B6B8A' }}>
                This will clear all your progress. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-medium"
                  style={{ background: 'rgba(188,166,230,0.3)', color: '#111111' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { reset(); setShowResetConfirm(false); navigate({ to: '/onboarding' }); }}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-medium text-white"
                  style={{ background: '#ef4444' }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mx-5 mb-6 text-center">
          <p className="text-xs" style={{ color: '#6B6B8A' }}>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'luminique')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
              style={{ color: '#7B4BB7' }}
            >
              caffeine.ai
            </a>{' '}
            · © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default ProfileScreen;
