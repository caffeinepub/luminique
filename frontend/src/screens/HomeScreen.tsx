import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import BottomTabBar from '../components/layout/BottomTabBar';
import FlowerEngine from '../components/FlowerEngine';
import GlowPointsBadge from '../components/GlowPointsBadge';
import Confetti from '../components/Confetti';
import { useUserStore } from '../stores/userStore';
import { useRoutineStore } from '../stores/routineStore';
import { getFlowerState } from '../utils/getFlowerState';
import { playChime } from '../utils/audioChime';
import { getNextTierInfo } from '../utils/gamification';

const TIPS: Record<string, string[]> = {
  Oily: [
    '💧 Use a gentle foaming cleanser twice daily to control excess oil.',
    '🌿 Niacinamide helps regulate sebum production — try it in your routine!',
    '☀️ Even oily skin needs SPF. Look for oil-free, non-comedogenic formulas.',
    '🍵 Green tea extract is great for calming oily, acne-prone skin.',
  ],
  Dry: [
    '💦 Apply moisturizer on damp skin to lock in extra hydration.',
    '🧴 Look for ceramides and hyaluronic acid in your cleanser.',
    '🌙 Use a rich night cream to repair your skin barrier while you sleep.',
    '🥑 Facial oils like squalane can boost moisture without clogging pores.',
  ],
  Combination: [
    '🌗 Use different products for your T-zone and cheeks if needed.',
    '✨ Lightweight serums work well for combination skin types.',
    '💧 Hydrating toners balance combination skin beautifully.',
    '🌿 Clay masks once a week can help control your T-zone.',
  ],
  Sensitive: [
    '🌸 Always patch test new products before applying to your face.',
    '🌹 Rose water is a gentle, soothing toner for sensitive skin.',
    '🧴 Fragrance-free products reduce the risk of irritation.',
    '💆 Less is more — keep your routine simple and gentle.',
  ],
  Normal: [
    '✨ Maintain your balanced skin with consistent SPF use.',
    '🌟 Vitamin C serum can enhance your natural glow.',
    '💧 Stay hydrated — drink 8 glasses of water daily for glowing skin.',
    '🌙 A retinol serum at night can keep your skin youthful.',
  ],
};

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name || 'Glowstar'} ✨`;
  if (hour < 17) return `Good afternoon, ${name || 'Glowstar'} ✨`;
  return `Good evening, ${name || 'Glowstar'} ✨`;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

const HomeScreen: React.FC = () => {
  const { name, skinType, glowPoints, addGlowPoints, incrementRoutinesCompleted } = useUserStore();
  const {
    currentStreak,
    morningCompletedToday,
    eveningCompletedToday,
    history,
    completeFullRoutine,
    checkAndResetForNewDay,
  } = useRoutineStore();

  const [confetti, setConfetti] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [morningAnim, setMorningAnim] = useState(false);
  const [eveningAnim, setEveningAnim] = useState(false);

  useEffect(() => {
    checkAndResetForNewDay();
  }, []);

  const tips = TIPS[skinType] || TIPS['Normal'];
  const currentTip = tips[tipIndex % tips.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => i + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const flowerState = getFlowerState(currentStreak, 0);
  const tierInfo = getNextTierInfo(glowPoints);
  const last7Days = getLast7Days();
  const today = getTodayString();

  const handleCompleteRoutine = useCallback((type: 'morning' | 'evening') => {
    if (type === 'morning' && morningCompletedToday) return;
    if (type === 'evening' && eveningCompletedToday) return;

    completeFullRoutine(type);
    const points = 10;
    const bothBonus = (type === 'morning' && eveningCompletedToday) || (type === 'evening' && morningCompletedToday) ? 5 : 0;
    const total = points + bothBonus;
    addGlowPoints(total);
    incrementRoutinesCompleted();
    setLastAdded(total);
    setConfetti(true);
    playChime();

    if (type === 'morning') setMorningAnim(true);
    else setEveningAnim(true);

    setTimeout(() => {
      if (type === 'morning') setMorningAnim(false);
      else setEveningAnim(false);
    }, 1000);
  }, [morningCompletedToday, eveningCompletedToday, completeFullRoutine, addGlowPoints, incrementRoutinesCompleted]);

  return (
    <div className="mobile-container">
      <div className="screen-content overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: '#6B6B8A' }}>luminique</p>
            <h1 className="text-lg font-semibold leading-tight" style={{ color: '#111111' }}>
              {getGreeting(name)}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <GlowPointsBadge lastAdded={lastAdded} />
            <button className="p-2 glass-card rounded-full">
              <Bell size={18} style={{ color: '#7B4BB7' }} />
            </button>
          </div>
        </div>

        {/* Flower Visual */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-6 flex flex-col items-center">
          <FlowerEngine state={flowerState} size={180} />
        </div>

        {/* Streak Counter */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold" style={{ color: '#111111' }}>{currentStreak}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: '#6B6B8A' }}>Day streak</p>
                <p className="text-lg">🔥</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: '#6B6B8A' }}>Keep it up!</p>
              <p className="text-sm font-semibold" style={{ color: '#7B4BB7' }}>
                {currentStreak >= 7 ? '🌸 Blooming!' : currentStreak >= 3 ? '🌿 Growing!' : '🌱 Starting!'}
              </p>
            </div>
          </div>
          {/* 7-day calendar strip */}
          <div className="flex gap-1.5 justify-between">
            {last7Days.map((dateStr) => {
              const entry = history.find((h) => h.date === dateStr);
              const isToday = dateStr === today;
              const hasMorning = entry?.morning || false;
              const hasEvening = entry?.evening || false;
              const dayLabel = new Date(dateStr + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }).charAt(0);
              return (
                <div key={dateStr} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px]" style={{ color: '#6B6B8A' }}>{dayLabel}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      background: (hasMorning || hasEvening)
                        ? 'linear-gradient(135deg, #7B4BB7, #BCA6E6)'
                        : isToday
                        ? 'rgba(123,75,183,0.15)'
                        : 'rgba(188,166,230,0.2)',
                      border: isToday ? '2px solid #7B4BB7' : 'none',
                      color: (hasMorning || hasEvening) ? 'white' : '#6B6B8A',
                    }}
                  >
                    {hasMorning && hasEvening ? '✓' : hasMorning ? '☀' : hasEvening ? '🌙' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mx-5 mb-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleCompleteRoutine('morning')}
            disabled={morningCompletedToday}
            className="glass-card rounded-2xl p-4 text-left transition-all active:scale-95 disabled:opacity-60 relative overflow-hidden"
            style={{
              border: morningCompletedToday ? '2px solid #7ED1B2' : '1px solid rgba(188,166,230,0.4)',
              background: morningCompletedToday ? 'rgba(126,209,178,0.15)' : 'rgba(255,255,255,0.75)',
            }}
          >
            {morningAnim && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(126,209,178,0.3)', borderRadius: '1rem' }}>
                <span className="text-2xl">✅</span>
              </div>
            )}
            <div className="text-2xl mb-2">{morningCompletedToday ? '✅' : '🌅'}</div>
            <p className="text-xs font-semibold" style={{ color: '#111111' }}>Morning Routine</p>
            <p className="text-xs mt-0.5" style={{ color: '#6B6B8A' }}>
              {morningCompletedToday ? 'Completed! +10pts' : '+10 GlowPoints'}
            </p>
          </button>

          <button
            onClick={() => handleCompleteRoutine('evening')}
            disabled={eveningCompletedToday}
            className="glass-card rounded-2xl p-4 text-left transition-all active:scale-95 disabled:opacity-60 relative overflow-hidden"
            style={{
              border: eveningCompletedToday ? '2px solid #7ED1B2' : '1px solid rgba(188,166,230,0.4)',
              background: eveningCompletedToday ? 'rgba(126,209,178,0.15)' : 'rgba(255,255,255,0.75)',
            }}
          >
            {eveningAnim && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(126,209,178,0.3)', borderRadius: '1rem' }}>
                <span className="text-2xl">✅</span>
              </div>
            )}
            <div className="text-2xl mb-2">{eveningCompletedToday ? '✅' : '🌙'}</div>
            <p className="text-xs font-semibold" style={{ color: '#111111' }}>Evening Routine</p>
            <p className="text-xs mt-0.5" style={{ color: '#6B6B8A' }}>
              {eveningCompletedToday ? 'Completed! +10pts' : '+10 GlowPoints'}
            </p>
          </button>
        </div>

        {/* Today's Tip */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">💡</span>
            <p className="text-xs font-semibold" style={{ color: '#7B4BB7' }}>Today's Tip</p>
            <span className="text-xs ml-auto px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,75,183,0.1)', color: '#7B4BB7' }}>
              {skinType || 'All'} skin
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#111111' }}>{currentTip}</p>
        </div>

        {/* GlowPoints Summary */}
        <div className="mx-5 mb-6 glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium" style={{ color: '#6B6B8A' }}>GlowPoints</p>
              <p className="text-2xl font-bold" style={{ color: '#111111' }}>{glowPoints.toLocaleString()}</p>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: glowPoints >= 1500
                  ? 'linear-gradient(135deg, #7B4BB7, #5B2D91)'
                  : glowPoints >= 500
                  ? 'linear-gradient(135deg, #BCA6E6, #7B4BB7)'
                  : 'linear-gradient(135deg, #EBCBB3, #F5E6D6)',
                color: glowPoints >= 500 ? 'white' : '#7B4BB7',
              }}
            >
              {glowPoints >= 1500 ? '👑 GlowPro' : glowPoints >= 500 ? '⭐ GlowUp' : '🌱 Starter'}
            </div>
          </div>
          <div className="mb-1">
            <div className="flex justify-between text-xs mb-1" style={{ color: '#6B6B8A' }}>
              <span>Progress to {tierInfo.name}</span>
              <span>{Math.round(tierInfo.progress)}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(188,166,230,0.3)' }}>
              <div
                className="progress-bar h-full"
                style={{ width: `${Math.min(tierInfo.progress, 100)}%` }}
              />
            </div>
          </div>
          {glowPoints < 1500 && (
            <p className="text-xs mt-1" style={{ color: '#6B6B8A' }}>
              {tierInfo.threshold - glowPoints} points to {tierInfo.name}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mx-5 mb-4 text-center">
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

      <Confetti trigger={confetti} onComplete={() => setConfetti(false)} />
      <BottomTabBar />
    </div>
  );
};

export default HomeScreen;
