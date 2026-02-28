import React, { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import BottomTabBar from '../components/layout/BottomTabBar';
import Confetti from '../components/Confetti';
import { useRoutineStore } from '../stores/routineStore';
import { useUserStore } from '../stores/userStore';
import { playChime } from '../utils/audioChime';

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

const RoutineScreen: React.FC = () => {
  const {
    todayMorningSteps,
    todayEveningSteps,
    history,
    currentStreak,
    bestStreak,
    morningCompletedToday,
    eveningCompletedToday,
    completeMorningStep,
    completeEveningStep,
    completeFullRoutine,
  } = useRoutineStore();

  const { totalRoutinesCompleted, addGlowPoints, incrementRoutinesCompleted } = useUserStore();
  const [confetti, setConfetti] = useState(false);
  const today = getTodayString();
  const now = new Date();
  const monthDays = getMonthDays(now.getFullYear(), now.getMonth());

  const morningCompleted = todayMorningSteps.filter((s) => s.completed).length;
  const morningTotal = todayMorningSteps.length;
  const morningPct = Math.round((morningCompleted / morningTotal) * 100);

  const eveningCompleted = todayEveningSteps.filter((s) => s.completed).length;
  const eveningTotal = todayEveningSteps.length;
  const eveningPct = Math.round((eveningCompleted / eveningTotal) * 100);

  const handleMorningStep = useCallback((id: string) => {
    completeMorningStep(id);
    const newCompleted = todayMorningSteps.filter((s) => s.completed || s.id === id).length;
    if (newCompleted === morningTotal && !morningCompletedToday) {
      setTimeout(() => {
        completeFullRoutine('morning');
        addGlowPoints(10);
        incrementRoutinesCompleted();
        setConfetti(true);
        playChime();
      }, 300);
    }
  }, [todayMorningSteps, morningTotal, morningCompletedToday, completeMorningStep, completeFullRoutine, addGlowPoints, incrementRoutinesCompleted]);

  const handleEveningStep = useCallback((id: string) => {
    completeEveningStep(id);
    const newCompleted = todayEveningSteps.filter((s) => s.completed || s.id === id).length;
    if (newCompleted === eveningTotal && !eveningCompletedToday) {
      setTimeout(() => {
        completeFullRoutine('evening');
        addGlowPoints(10);
        incrementRoutinesCompleted();
        setConfetti(true);
        playChime();
      }, 300);
    }
  }, [todayEveningSteps, eveningTotal, eveningCompletedToday, completeEveningStep, completeFullRoutine, addGlowPoints, incrementRoutinesCompleted]);

  // Weekly chart data (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = history.find((h) => h.date === dateStr);
    const dayLabel = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
    const value = entry ? (entry.morning && entry.evening ? 2 : entry.morning || entry.evening ? 1 : 0) : 0;
    return { dateStr, dayLabel, value };
  });

  const recentHistory = [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return (
    <div className="mobile-container">
      <div className="screen-content overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-5 pt-12 pb-4">
          <h1 className="text-xl font-semibold" style={{ color: '#111111' }}>My Routine 🌸</h1>
          <p className="text-sm" style={{ color: '#6B6B8A' }}>Track your daily skincare</p>
        </div>

        {/* Calendar */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <p className="text-sm font-semibold mb-3" style={{ color: '#111111' }}>
            {now.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
          </p>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-medium" style={{ color: '#6B6B8A' }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first day offset */}
            {Array.from({ length: monthDays[0].getDay() }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthDays.map((day) => {
              const dateStr = day.toISOString().split('T')[0];
              const entry = history.find((h) => h.date === dateStr);
              const isToday = dateStr === today;
              const hasMorning = entry?.morning || false;
              const hasEvening = entry?.evening || false;
              const hasBoth = hasMorning && hasEvening;
              return (
                <div key={dateStr} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium"
                    style={{
                      background: isToday ? '#7B4BB7' : 'transparent',
                      color: isToday ? 'white' : '#111111',
                    }}
                  >
                    {day.getDate()}
                  </div>
                  <div className="flex gap-0.5">
                    {hasMorning && <div className="w-1 h-1 rounded-full" style={{ background: '#D4A843' }} />}
                    {hasEvening && <div className="w-1 h-1 rounded-full" style={{ background: '#7B4BB7' }} />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#D4A843' }} />
              <span className="text-[10px]" style={{ color: '#6B6B8A' }}>Morning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#7B4BB7' }} />
              <span className="text-[10px]" style={{ color: '#6B6B8A' }}>Evening</span>
            </div>
          </div>
        </div>

        {/* Morning Routine */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌅</span>
              <p className="font-semibold" style={{ color: '#111111' }}>Morning Routine</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: '#7B4BB7' }}>{morningPct}%</span>
              {morningCompletedToday && <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: '#7ED1B2' }}>Done ✓</span>}
            </div>
          </div>
          <div className="h-1.5 rounded-full mb-3" style={{ background: 'rgba(188,166,230,0.3)' }}>
            <div className="progress-bar h-full" style={{ width: `${morningPct}%` }} />
          </div>
          <div className="flex flex-col gap-2">
            {todayMorningSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => !step.completed && handleMorningStep(step.id)}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                style={{
                  background: step.completed ? 'rgba(126,209,178,0.12)' : 'rgba(255,255,255,0.5)',
                  border: step.completed ? '1px solid rgba(126,209,178,0.4)' : '1px solid rgba(188,166,230,0.3)',
                  cursor: step.completed ? 'default' : 'pointer',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: step.completed ? '#7ED1B2' : 'rgba(188,166,230,0.3)',
                    border: step.completed ? 'none' : '2px solid rgba(188,166,230,0.5)',
                  }}
                >
                  {step.completed && (
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M2 6 L5 9 L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className="checkmark-path"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-base">{step.icon}</span>
                <span
                  className="text-sm font-medium flex-1 text-left"
                  style={{
                    color: step.completed ? '#6B6B8A' : '#111111',
                    textDecoration: step.completed ? 'line-through' : 'none',
                  }}
                >
                  Step {idx + 1}: {step.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Evening Routine */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌙</span>
              <p className="font-semibold" style={{ color: '#111111' }}>Evening Routine</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: '#7B4BB7' }}>{eveningPct}%</span>
              {eveningCompletedToday && <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: '#7ED1B2' }}>Done ✓</span>}
            </div>
          </div>
          <div className="h-1.5 rounded-full mb-3" style={{ background: 'rgba(188,166,230,0.3)' }}>
            <div className="progress-bar h-full" style={{ width: `${eveningPct}%` }} />
          </div>
          <div className="flex flex-col gap-2">
            {todayEveningSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => !step.completed && handleEveningStep(step.id)}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                style={{
                  background: step.completed ? 'rgba(126,209,178,0.12)' : 'rgba(255,255,255,0.5)',
                  border: step.completed ? '1px solid rgba(126,209,178,0.4)' : '1px solid rgba(188,166,230,0.3)',
                  cursor: step.completed ? 'default' : 'pointer',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: step.completed ? '#7ED1B2' : 'rgba(188,166,230,0.3)',
                    border: step.completed ? 'none' : '2px solid rgba(188,166,230,0.5)',
                  }}
                >
                  {step.completed && (
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M2 6 L5 9 L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className="checkmark-path"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-base">{step.icon}</span>
                <span
                  className="text-sm font-medium flex-1 text-left"
                  style={{
                    color: step.completed ? '#6B6B8A' : '#111111',
                    textDecoration: step.completed ? 'line-through' : 'none',
                  }}
                >
                  Step {idx + 1}: {step.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Streak Stats */}
        <div className="mx-5 mb-4 glass-card rounded-3xl p-4">
          <p className="font-semibold mb-3" style={{ color: '#111111' }}>📊 Streak Stats</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-2xl" style={{ background: 'rgba(123,75,183,0.08)' }}>
              <p className="text-xl font-bold" style={{ color: '#7B4BB7' }}>{currentStreak}</p>
              <p className="text-[10px]" style={{ color: '#6B6B8A' }}>Current</p>
            </div>
            <div className="text-center p-3 rounded-2xl" style={{ background: 'rgba(212,168,67,0.1)' }}>
              <p className="text-xl font-bold" style={{ color: '#D4A843' }}>{bestStreak}</p>
              <p className="text-[10px]" style={{ color: '#6B6B8A' }}>Best</p>
            </div>
            <div className="text-center p-3 rounded-2xl" style={{ background: 'rgba(126,209,178,0.1)' }}>
              <p className="text-xl font-bold" style={{ color: '#7ED1B2' }}>{totalRoutinesCompleted}</p>
              <p className="text-[10px]" style={{ color: '#6B6B8A' }}>Total</p>
            </div>
          </div>
          {/* Weekly bar chart */}
          <p className="text-xs font-medium mb-2" style={{ color: '#6B6B8A' }}>This week</p>
          <div className="flex items-end gap-1 h-16">
            {last7.map(({ dayLabel, value }) => (
              <div key={dayLabel} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: value === 2 ? '100%' : value === 1 ? '50%' : '8%',
                    background: value === 2
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

        {/* Log History */}
        <div className="mx-5 mb-6 glass-card rounded-3xl p-4">
          <p className="font-semibold mb-3" style={{ color: '#111111' }}>📋 Recent Log</p>
          {recentHistory.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: '#6B6B8A' }}>No history yet. Start your routine!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentHistory.map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between p-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(188,166,230,0.3)' }}
                >
                  <span className="text-sm font-medium" style={{ color: '#111111' }}>
                    {new Date(entry.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: entry.morning ? 'rgba(212,168,67,0.15)' : 'rgba(188,166,230,0.15)',
                        color: entry.morning ? '#D4A843' : '#6B6B8A',
                      }}
                    >
                      {entry.morning ? '☀️ Done' : '☀️ —'}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: entry.evening ? 'rgba(123,75,183,0.12)' : 'rgba(188,166,230,0.15)',
                        color: entry.evening ? '#7B4BB7' : '#6B6B8A',
                      }}
                    >
                      {entry.evening ? '🌙 Done' : '🌙 —'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Confetti trigger={confetti} onComplete={() => setConfetti(false)} />
      <BottomTabBar />
    </div>
  );
};

export default RoutineScreen;
