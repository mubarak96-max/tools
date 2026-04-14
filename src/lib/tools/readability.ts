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

export interface ReadabilitySentence {
  text: string;
  words: number;
  syllables: number;
  gradeLevel: number;
  difficulty: "easy" | "average" | "hard" | "very-hard";
}

export function calculateReadability(text: string) {
  const trimmed = text.trim();
  const words = trimmed.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
  const sentenceMatches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  const rawSentences = sentenceMatches.filter((sentence) => sentence.trim().length > 0);

  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const wordCount = words.length;
  const sentenceCount = Math.max(rawSentences.length, wordCount ? 1 : 0);

  let totalSyllables = 0;
  let complexWords = 0; // 3+ syllables

  const analyzedWords = words.map((w) => {
    const s = countSyllables(w);
    totalSyllables += s;
    if (s >= 3) complexWords++;
    return { text: w, syllables: s };
  });

  const averageWordsPerSentence = sentenceCount ? wordCount / sentenceCount : 0;
  const averageSyllablesPerWord = wordCount ? totalSyllables / wordCount : 0;

  // Flesch Reading Ease
  const fleschReadingEase = wordCount
    ? 206.835 - 1.015 * averageWordsPerSentence - 84.6 * averageSyllablesPerWord
    : 0;

  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade = wordCount
    ? 0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59
    : 0;

  // Gunning Fog Index: 0.4 * ( (words / sentences) + 100 * (complex words / words) )
  const gunningFog = wordCount
    ? 0.4 * (averageWordsPerSentence + 100 * (complexWords / wordCount))
    : 0;

  // Coleman-Liau Index: 0.0588 * L - 0.296 * S - 15.8
  // L is avg chars per 100 words, S is avg sentences per 100 words
  const L = wordCount ? (charactersNoSpaces / wordCount) * 100 : 0;
  const S = wordCount ? (sentenceCount / wordCount) * 100 : 0;
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  // Automated Readability Index (ARI): 4.71 * (chars / words) + 0.5 * (words / sentences) - 21.43
  const ari = wordCount
    ? 4.71 * (charactersNoSpaces / wordCount) + 0.5 * averageWordsPerSentence - 21.43
    : 0;

  // SMOG Index: 1.0430 * sqrt(complex words * (30 / sentences)) + 3.1291
  const smog = sentenceCount >= 3
    ? 1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291
    : 0;

  // Sentence analysis
  const sentences: ReadabilitySentence[] = rawSentences.map((sText) => {
    const sWords = sText.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
    const sWordCount = sWords.length;
    const sSyllables = sWords.reduce((t, w) => t + countSyllables(w), 0);
    const sGrade = sWordCount ? 0.39 * sWordCount + 11.8 * (sSyllables / sWordCount) - 15.59 : 0;

    let difficulty: ReadabilitySentence["difficulty"] = "average";
    if (sGrade > 14 || sWordCount > 25) difficulty = "very-hard";
    else if (sGrade > 10 || sWordCount > 20) difficulty = "hard";
    else if (sGrade < 6 && sWordCount < 10) difficulty = "easy";

    return {
      text: sText,
      words: sWordCount,
      syllables: sSyllables,
      gradeLevel: sGrade,
      difficulty,
    };
  });

  const readingTimeMinutes = wordCount ? wordCount / 200 : 0;

  return {
    words: wordCount,
    sentenceCount: sentenceCount,
    characters: charactersNoSpaces,
    syllables: totalSyllables,
    complexWords,
    averageWordsPerSentence,
    averageSyllablesPerWord,
    fleschReadingEase,
    fleschReadingEaseLabel: classifyReadingEase(fleschReadingEase),
    fleschKincaidGrade,
    fleschKincaidGradeLabel: classifyGradeLevel(fleschKincaidGrade),
    gunningFog,
    colemanLiau,
    ari,
    smog,
    sentences,
    readingTimeMinutes,
  };
}
