export type EmDashReplacementMode = "comma" | "hyphen" | "space" | "nothing";

export interface EmDashCleanerResult {
  output: string;
  emDashCount: number;
  enDashCount: number;
  totalReplacements: number;
}

function replacementValue(mode: EmDashReplacementMode) {
  switch (mode) {
    case "comma":
      return ",";
    case "hyphen":
      return "-";
    case "space":
      return " ";
    case "nothing":
      return "";
    default:
      return " ";
  }
}

function normalizeSpacing(text: string) {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

export function removeEmDashes(text: string, mode: EmDashReplacementMode): EmDashCleanerResult {
  const emDashMatches = text.match(/—/g) ?? [];
  const enDashMatches = text.match(/–/g) ?? [];
  const replacement = replacementValue(mode);

  const output = normalizeSpacing(text.replace(/[—–]/g, replacement));

  return {
    output,
    emDashCount: emDashMatches.length,
    enDashCount: enDashMatches.length,
    totalReplacements: emDashMatches.length + enDashMatches.length,
  };
}
