export interface DuplicateWordItem {
  word: string;
  count: number;
  duplicateCount: number;
}

export interface DuplicateWordResult {
  totalWords: number;
  uniqueWords: number;
  duplicateWords: number;
  totalDuplicateOccurrences: number;
  mostRepeatedWord: string | null;
  mostRepeatedCount: number;
  items: DuplicateWordItem[];
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export function findDuplicateWords(text: string): DuplicateWordResult {
  const words = tokenize(text);
  const counts = new Map<string, number>();

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  const items = Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([word, count]) => ({
      word,
      count,
      duplicateCount: count - 1,
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.word.localeCompare(right.word);
    });

  const mostRepeated = items[0];

  return {
    totalWords: words.length,
    uniqueWords: counts.size,
    duplicateWords: items.length,
    totalDuplicateOccurrences: items.reduce((sum, item) => sum + item.duplicateCount, 0),
    mostRepeatedWord: mostRepeated?.word ?? null,
    mostRepeatedCount: mostRepeated?.count ?? 0,
    items,
  };
}
