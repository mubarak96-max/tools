export type TextStyleMode = "strike" | "double-underline" | "underline" | "dotted" | "wave";

export interface TextStyleResult {
  output: string;
  styledCharacters: number;
  inputCharacters: number;
  outputCharacters: number;
}

const STYLE_MARKS: Record<TextStyleMode, string> = {
  strike: "\u0336",
  "double-underline": "\u0347",
  underline: "\u035F",
  dotted: "\u0324",
  wave: "\u0330",
};

const COMBINING_MARKS = /[\u0300-\u036f]/u;

export function styleText(text: string, mode: TextStyleMode): TextStyleResult {
  const mark = STYLE_MARKS[mode];
  let styledCharacters = 0;
  let output = "";

  for (const character of text) {
    if (character === "\n" || character === "\r" || character === "\t" || character === " ") {
      output += character;
      continue;
    }

    if (COMBINING_MARKS.test(character)) {
      output += character;
      continue;
    }

    output += `${character}${mark}`;
    styledCharacters += 1;
  }

  return {
    output,
    styledCharacters,
    inputCharacters: text.length,
    outputCharacters: output.length,
  };
}
