export type FastingMethod = "16:8" | "18:6" | "20:4" | "12:12";

export interface FastingSchedule {
  fastingStart: string;
  fastingEnd: string;
  eatingStart: string;
  eatingEnd: string;
  fastDuration: number;
  eatDuration: number;
}

/**
 * Generates an intermittent fasting schedule based on the selected method and 
 * the time of the first meal.
 */
export function generateFastingSchedule(method: FastingMethod, firstMealTime: string): FastingSchedule {
  const [hours, minutes] = firstMealTime.split(':').map(Number);
  
  // Calculate durations
  const eatDuration = Number(method.split(':')[1]);
  const fastDuration = Number(method.split(':')[0]);

  // Eating window
  const eatingStartDate = new Date();
  eatingStartDate.setHours(hours, minutes, 0, 0);
  
  const eatingEndDate = new Date(eatingStartDate.getTime() + eatDuration * 60 * 60 * 1000);
  
  // Fasting window starts when eating ends
  const fastingStartDate = new Date(eatingEndDate);
  const fastingEndDate = new Date(fastingStartDate.getTime() + fastDuration * 60 * 60 * 1000);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    eatingStart: formatTime(eatingStartDate),
    eatingEnd: formatTime(eatingEndDate),
    fastingStart: formatTime(fastingStartDate),
    fastingEnd: formatTime(fastingEndDate),
    fastDuration,
    eatDuration
  };
}
