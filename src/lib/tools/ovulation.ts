/**
 * Calculates pregnancy due date based on Last Menstrual Period (LMP)
 * using Naegele's Rule: LMP + 9 months + 7 days
 */
export function calculatePregnancyDueDate(lmpDate: Date): Date {
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
  return dueDate;
}

/**
 * Calculates fertility window based on average cycle length
 * Ovulation is typically Cycle Length - 14 days
 * Fertile window is Ovulation - 5 days to Ovulation + 1 day
 */
export function calculateFertilityWindow(lmpDate: Date, cycleLength: number) {
  const ovulationDate = new Date(lmpDate);
  ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));
  
  const windowStart = new Date(ovulationDate);
  windowStart.setDate(windowStart.getDate() - 5);
  
  const windowEnd = new Date(ovulationDate);
  windowEnd.setDate(windowEnd.getDate() + 1);
  
  return {
    ovulationDate,
    windowStart,
    windowEnd
  };
}
