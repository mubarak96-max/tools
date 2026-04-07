import type { WordFrequencyComparisonItem, WordFrequencyItem } from "@/types/tools";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "if",
  "in",
  "into",
  "is",
  "it",
  "no",
  "not",
  "of",
  "on",
  "or",
  "such",
  "that",
  "the",
  "their",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "was",
  "will",
  "with",
]);

export interface WordFrequencyOptions {
  ignoreStopWords?: boolean;
  minLength?: number;
}

export interface WordFrequencyStats {
  totalWords: number;
  analyzedWords: number;
  uniqueWords: number;
  mostFrequentWord: string | null;
  mostFrequentCount: number;
}

export interface WordFrequencyComparisonStats {
  sharedWords: number;
  primaryOnlyWords: number;
  secondaryOnlyWords: number;
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string) {
  const normalized = normalizeText(text);
  return normalized ? normalized.split(" ") : [];
}

export function getKeywordDensity(count: number, totalWords: number) {
  if (!totalWords) {
    return 0;
  }

  return (count / totalWords) * 100;
}

export function countWordFrequency(text: string) {
  return countWordFrequencyAdvanced(text);
}

export function countWordFrequencyAdvanced(text: string, options: WordFrequencyOptions = {}): WordFrequencyItem[] {
  const minLength = Math.max(1, Math.floor(options.minLength ?? 1));
  let words = tokenize(text);

  if (options.ignoreStopWords) {
    words = words.filter((word) => !STOP_WORDS.has(word));
  }

  words = words.filter((word) => word.length >= minLength);

  const frequency = new Map<string, number>();

  for (const word of words) {
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }

  return Array.from(frequency.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.word.localeCompare(right.word);
    });
}

export function getWordFrequencyStats(text: string, options: WordFrequencyOptions = {}): WordFrequencyStats {
  const totalWords = tokenize(text).length;
  const items = countWordFrequencyAdvanced(text, options);
  const analyzedWords = items.reduce((sum, item) => sum + item.count, 0);
  const mostFrequent = items[0];

  return {
    totalWords,
    analyzedWords,
    uniqueWords: items.length,
    mostFrequentWord: mostFrequent?.word ?? null,
    mostFrequentCount: mostFrequent?.count ?? 0,
  };
}

export function compareWordFrequencies(
  primaryText: string,
  secondaryText: string,
  options: WordFrequencyOptions = {},
): WordFrequencyComparisonItem[] {
  const primaryItems = countWordFrequencyAdvanced(primaryText, options);
  const secondaryItems = countWordFrequencyAdvanced(secondaryText, options);
  const primaryStats = getWordFrequencyStats(primaryText, options);
  const secondaryStats = getWordFrequencyStats(secondaryText, options);

  const primaryMap = new Map(primaryItems.map((item) => [item.word, item.count]));
  const secondaryMap = new Map(secondaryItems.map((item) => [item.word, item.count]));
  const allWords = new Set([...primaryMap.keys(), ...secondaryMap.keys()]);

  return Array.from(allWords)
    .map((word) => {
      const primaryCount = primaryMap.get(word) ?? 0;
      const secondaryCount = secondaryMap.get(word) ?? 0;

      return {
        word,
        primaryCount,
        secondaryCount,
        primaryDensity: getKeywordDensity(primaryCount, primaryStats.analyzedWords),
        secondaryDensity: getKeywordDensity(secondaryCount, secondaryStats.analyzedWords),
        countDelta: primaryCount - secondaryCount,
      };
    })
    .sort((left, right) => {
      const leftCombined = left.primaryCount + left.secondaryCount;
      const rightCombined = right.primaryCount + right.secondaryCount;

      if (rightCombined !== leftCombined) {
        return rightCombined - leftCombined;
      }

      if (Math.abs(right.countDelta) !== Math.abs(left.countDelta)) {
        return Math.abs(right.countDelta) - Math.abs(left.countDelta);
      }

      return left.word.localeCompare(right.word);
    });
}

export function getWordFrequencyComparisonStats(
  primaryText: string,
  secondaryText: string,
  options: WordFrequencyOptions = {},
): WordFrequencyComparisonStats {
  const comparison = compareWordFrequencies(primaryText, secondaryText, options);

  return comparison.reduce<WordFrequencyComparisonStats>(
    (accumulator, item) => {
      if (item.primaryCount > 0 && item.secondaryCount > 0) {
        accumulator.sharedWords += 1;
      } else if (item.primaryCount > 0) {
        accumulator.primaryOnlyWords += 1;
      } else if (item.secondaryCount > 0) {
        accumulator.secondaryOnlyWords += 1;
      }

      return accumulator;
    },
    {
      sharedWords: 0,
      primaryOnlyWords: 0,
      secondaryOnlyWords: 0,
    },
  );
}
