export type TextAlignMode = "center" | "left-pad" | "right-pad" | "justify";

function repeatPad(character: string, count: number) {
  return count > 0 ? character.repeat(count) : "";
}

function justifyLine(line: string, width: number) {
  if (line.length >= width || !line.includes(" ")) {
    return line;
  }

  const words = line.split(/\s+/);
  if (words.length < 2) {
    return line;
  }

  const totalLetters = words.reduce((sum, word) => sum + word.length, 0);
  const totalSpaces = width - totalLetters;
  const slots = words.length - 1;
  const base = Math.floor(totalSpaces / slots);
  const extra = totalSpaces % slots;

  return words
    .map((word, index) => {
      if (index === words.length - 1) {
        return word;
      }

      return word + " ".repeat(base + (index < extra ? 1 : 0));
    })
    .join("");
}

export function alignText(text: string, mode: TextAlignMode, width: number, padCharacter = " ") {
  const safeWidth = Math.max(1, width);
  const lines = text.split(/\r?\n/);
  const output = lines
    .map((line) => {
      if (line.length >= safeWidth) {
        return line;
      }

      const missing = safeWidth - line.length;

      switch (mode) {
        case "left-pad":
          return repeatPad(padCharacter, missing) + line;
        case "right-pad":
          return line + repeatPad(padCharacter, missing);
        case "justify":
          return justifyLine(line, safeWidth);
        default: {
          const left = Math.floor(missing / 2);
          const right = missing - left;
          return repeatPad(padCharacter, left) + line + repeatPad(padCharacter, right);
        }
      }
    })
    .join("\n");

  return {
    output,
    lineCount: lines.length,
    width: safeWidth,
  };
}
