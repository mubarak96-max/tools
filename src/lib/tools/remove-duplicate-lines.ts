export interface RemoveDuplicateLinesOptions {
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  ignoreBlankLines?: boolean;
}

export interface RemoveDuplicateLinesResult {
  output: string;
  totalLines: number;
  uniqueLines: number;
  duplicateLinesRemoved: number;
}

function normalizeLine(line: string, options: RemoveDuplicateLinesOptions) {
  const trimmed = options.trimWhitespace ? line.trim() : line;
  return options.caseSensitive ? trimmed : trimmed.toLocaleLowerCase();
}

export function removeDuplicateLines(
  text: string,
  options: RemoveDuplicateLinesOptions = {},
): RemoveDuplicateLinesResult {
  const lines = text === "" ? [] : text.split(/\r?\n/);
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  for (const line of lines) {
    const normalized = normalizeLine(line, options);

    if (options.ignoreBlankLines && normalized === "") {
      continue;
    }

    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    uniqueLines.push(line);
  }

  return {
    output: uniqueLines.join("\n"),
    totalLines: lines.length,
    uniqueLines: uniqueLines.length,
    duplicateLinesRemoved: Math.max(0, lines.length - uniqueLines.length),
  };
}
