type CharacterFrequencyOptions = {
  caseSensitive: boolean;
  includeWhitespace: boolean;
};

export type CharacterFrequencyEntry = {
  value: string;
  label: string;
  count: number;
  codepoint: string;
};

function displayLabel(character: string) {
  switch (character) {
    case " ":
      return "[space]";
    case "\n":
      return "[newline]";
    case "\r":
      return "[carriage return]";
    case "\t":
      return "[tab]";
    default:
      return character;
  }
}

export function calculateCharacterFrequency(text: string, options: CharacterFrequencyOptions) {
  const counts = new Map<string, { source: string; count: number }>();

  Array.from(text).forEach((character) => {
    if (!options.includeWhitespace && /\s/u.test(character)) {
      return;
    }

    const key = options.caseSensitive ? character : character.toLocaleLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
      return;
    }

    counts.set(key, { source: character, count: 1 });
  });

  const entries: CharacterFrequencyEntry[] = Array.from(counts.values())
    .map((entry) => ({
      value: entry.source,
      label: displayLabel(entry.source),
      count: entry.count,
      codepoint: `U+${entry.source.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0") ?? "0000"}`,
    }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));

  return {
    totalCharacters: entries.reduce((sum, entry) => sum + entry.count, 0),
    uniqueCharacters: entries.length,
    entries,
  };
}
