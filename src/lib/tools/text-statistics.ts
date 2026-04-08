export function calculateTextStatistics(text: string, phraseLength: number) {
  const lines = text.length ? text.split(/\r?\n/) : [];
  const words = text.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
  const letters = text.match(/\p{L}/gu) ?? [];
  const normalizedWords = words.map((word) => word.toLowerCase());
  const phrases: string[] = [];

  for (let index = 0; index <= normalizedWords.length - phraseLength; index += 1) {
    phrases.push(normalizedWords.slice(index, index + phraseLength).join(" "));
  }

  const letterFrequency = [...new Set(letters.map((letter) => letter.toLowerCase()))]
    .map((letter) => ({
      value: letter,
      count: letters.filter((candidate) => candidate.toLowerCase() === letter).length,
    }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 10);

  const phraseFrequency = [...new Set(phrases)]
    .map((phrase) => ({
      value: phrase,
      count: phrases.filter((candidate) => candidate === phrase).length,
    }))
    .filter((item) => item.count > 1)
    .sort((left, right) => right.count - left.count)
    .slice(0, 10);

  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const longestLine = nonEmptyLines.reduce((longest, line) => (line.length > longest.length ? line : longest), "");
  const shortestLine = nonEmptyLines.reduce(
    (shortest, line) => (shortest === "" || line.length < shortest.length ? line : shortest),
    "",
  );

  return {
    characters: text.length,
    words: words.length,
    lines: lines.length,
    paragraphs: text.trim() ? text.trim().split(/\n\s*\n/).length : 0,
    longestLine,
    shortestLine,
    letterFrequency,
    phraseFrequency,
  };
}
