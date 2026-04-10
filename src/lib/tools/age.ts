const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface AgeInput {
  birthDate: string;
  targetDate: string;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthdayDate: string;
  nextBirthdayInDays: number;
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const result = new Date(Date.UTC(year, month - 1, day));

  if (
    result.getUTCFullYear() !== year ||
    result.getUTCMonth() !== month - 1 ||
    result.getUTCDate() !== day
  ) {
    return null;
  }

  return result;
}

function formatIsoDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function daysInUtcMonth(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function addUtcYears(date: Date, years: number) {
  const year = date.getUTCFullYear() + years;
  const month = date.getUTCMonth();
  const day = Math.min(date.getUTCDate(), daysInUtcMonth(year, month));

  return new Date(Date.UTC(year, month, day));
}

function addUtcMonths(date: Date, months: number) {
  const sourceYear = date.getUTCFullYear();
  const sourceMonth = date.getUTCMonth();
  const totalMonths = sourceYear * 12 + sourceMonth + months;
  const year = Math.floor(totalMonths / 12);
  const month = totalMonths % 12;
  const day = Math.min(date.getUTCDate(), daysInUtcMonth(year, month));

  return new Date(Date.UTC(year, month, day));
}

function differenceInWholeDays(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function calculateAge(input: AgeInput): AgeResult | null {
  const birthDate = parseIsoDate(input.birthDate);
  const targetDate = parseIsoDate(input.targetDate);

  if (!birthDate || !targetDate || targetDate < birthDate) {
    return null;
  }

  let years = targetDate.getUTCFullYear() - birthDate.getUTCFullYear();
  let cursor = addUtcYears(birthDate, years);

  if (cursor > targetDate) {
    years -= 1;
    cursor = addUtcYears(birthDate, years);
  }

  let months = 0;
  while (months < 11) {
    const nextCursor = addUtcMonths(cursor, 1);
    if (nextCursor > targetDate) {
      break;
    }

    cursor = nextCursor;
    months += 1;
  }

  const days = differenceInWholeDays(cursor, targetDate);
  const totalDays = differenceInWholeDays(birthDate, targetDate);
  const totalMonths = years * 12 + months;
  const birthdayThisYear = addUtcYears(
    birthDate,
    targetDate.getUTCFullYear() - birthDate.getUTCFullYear(),
  );
  const nextBirthdayDate =
    birthdayThisYear > targetDate ? birthdayThisYear : addUtcYears(birthdayThisYear, 1);

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    nextBirthdayDate: formatIsoDate(nextBirthdayDate),
    nextBirthdayInDays: differenceInWholeDays(targetDate, nextBirthdayDate),
  };
}
