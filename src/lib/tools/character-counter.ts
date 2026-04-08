export interface CharacterCounterResult {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
  readingLabel: string;
}

function countWords(text: string) {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

function countSentences(text: string) {
  const matches = text
    .split(/[.!?]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return matches.length;
}

function countParagraphs(text: string) {
  const matches = text
    .split(/\n\s*\n/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return matches.length;
}

function formatReadingTime(minutes: number) {
  if (minutes <= 0) {
    return "0 min";
  }

  if (minutes < 1) {
    return "<1 min";
  }

  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
}

export function calculateCharacterCounts(text: string): CharacterCounterResult {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = countWords(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const readingMinutes = words / 200;

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingMinutes,
    readingLabel: formatReadingTime(readingMinutes),
  };
}
