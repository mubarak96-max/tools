function countSyllables(word: string) {
  const normalized = word
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");

  if (!normalized) {
    return 0;
  }

  if (normalized.length <= 3) {
    return 1;
  }

  const compact = normalized
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/u, "")
    .replace(/^y/u, "");
  const groups = compact.match(/[aeiouy]{1,2}/g);

  return Math.max(groups?.length ?? 1, 1);
}

function classifyReadingEase(score: number) {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

function classifyGradeLevel(score: number) {
  if (score <= 1) return "Early elementary";
  if (score <= 5) return "Elementary";
  if (score <= 8) return "Middle school";
  if (score <= 12) return "High school";
  if (score <= 16) return "College";
  return "College graduate";
}

export function calculateReadability(text: string) {
  const trimmed = text.trim();
  const words = trimmed.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
  const sentenceMatches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  const sentences = sentenceMatches.filter((sentence) => sentence.trim().length > 0);
  const characters = text.replace(/\s/g, "").length;
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, wordCount ? 1 : 0);
  const averageWordsPerSentence = sentenceCount ? wordCount / sentenceCount : 0;
  const averageSyllablesPerWord = wordCount ? syllables / wordCount : 0;
  const fleschReadingEase = wordCount
    ? 206.835 - 1.015 * averageWordsPerSentence - 84.6 * averageSyllablesPerWord
    : 0;
  const fleschKincaidGrade = wordCount
    ? 0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59
    : 0;
  const readingTimeMinutes = wordCount ? wordCount / 200 : 0;

  return {
    words: wordCount,
    sentences: sentenceCount,
    characters,
    syllables,
    averageWordsPerSentence,
    averageSyllablesPerWord,
    fleschReadingEase,
    fleschReadingEaseLabel: classifyReadingEase(fleschReadingEase),
    fleschKincaidGrade,
    fleschKincaidGradeLabel: classifyGradeLevel(fleschKincaidGrade),
    readingTimeMinutes,
  };
}
