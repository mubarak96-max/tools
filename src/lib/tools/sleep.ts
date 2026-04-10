export interface SleepCycle {
  wakeTime: string;
  cycleCount: number;
}

/**
 * Calculates wake up times based on 90-minute sleep cycles.
 * Standard recommendation: 5 or 6 cycles (7.5 or 9 hours).
 */
export function calculateSleepWakeTimes(bedTime: string): SleepCycle[] {
  const [hours, minutes] = bedTime.split(':').map(Number);
  const baseDate = new Date();
  baseDate.setHours(hours, minutes, 0, 0);

  // Add 15 minutes for falling asleep
  baseDate.setMinutes(baseDate.getMinutes() + 15);

  const cycles = [6, 5, 4, 3]; // Preferred number of cycles
  return cycles.map(count => {
    const wakeDate = new Date(baseDate.getTime() + count * 90 * 60 * 1000);
    return {
      wakeTime: wakeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cycleCount: count
    };
  });
}
