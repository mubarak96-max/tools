export interface RegexToolResult {
  output: string;
  matches: string[];
  error?: string;
}

export function runRegexExtract(text: string, pattern: string, flags: string): RegexToolResult {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [...text.matchAll(regex)].map((match) => match[0]);
    return {
      output: matches.join("\n"),
      matches,
    };
  } catch (error) {
    return {
      output: "",
      matches: [],
      error: error instanceof Error ? error.message : "Invalid regular expression.",
    };
  }
}

export function runRegexReplace(text: string, pattern: string, flags: string, replacement: string): RegexToolResult {
  try {
    const regex = new RegExp(pattern, flags);
    return {
      output: text.replace(regex, replacement),
      matches: [...text.matchAll(regex)].map((match) => match[0]),
    };
  } catch (error) {
    return {
      output: text,
      matches: [],
      error: error instanceof Error ? error.message : "Invalid regular expression.",
    };
  }
}
