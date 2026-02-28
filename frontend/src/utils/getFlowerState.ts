export type FlowerState = 'seed' | 'bud' | 'bloom' | 'withered';

export function getFlowerState(streak: number, previousStreak: number = 0): FlowerState {
  if (streak === 0 && previousStreak > 2) return 'withered';
  if (streak <= 2) return 'seed';
  if (streak <= 6) return 'bud';
  return 'bloom';
}
