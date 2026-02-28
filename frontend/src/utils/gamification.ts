export type Tier = 'Starter' | 'GlowUp' | 'GlowPro';

export function calculateTier(points: number): Tier {
  if (points >= 1500) return 'GlowPro';
  if (points >= 500) return 'GlowUp';
  return 'Starter';
}

export function getNextTierInfo(points: number): { name: Tier; threshold: number; progress: number } {
  if (points < 500) {
    return { name: 'GlowUp', threshold: 500, progress: (points / 500) * 100 };
  }
  if (points < 1500) {
    return { name: 'GlowPro', threshold: 1500, progress: ((points - 500) / 1000) * 100 };
  }
  return { name: 'GlowPro', threshold: 1500, progress: 100 };
}

export function getPointsForAction(action: string): number {
  const points: Record<string, number> = {
    morning_routine: 10,
    evening_routine: 10,
    both_routines_bonus: 5,
    seven_day_streak: 50,
    write_review: 15,
    first_purchase: 25,
  };
  return points[action] || 0;
}

export function checkAchievements(streak: number, points: number, totalRoutines: number, hasFirstPurchase: boolean): string[] {
  const unlocked: string[] = [];
  if (streak >= 7) unlocked.push('first_streak');
  if (streak >= 30) unlocked.push('full_bloom');
  if (hasFirstPurchase) unlocked.push('first_purchase');
  if (points >= 1500) unlocked.push('glowpro_tier');
  return unlocked;
}
