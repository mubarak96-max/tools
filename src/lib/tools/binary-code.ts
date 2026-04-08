export type BinaryMode = "text-to-binary" | "binary-to-text";

export interface BinaryTranslationResult {
  output: string;
  inputCharacters: number;
  outputCharacters: number;
  translatedUnits: number;
  invalidGroups: number;
}

function toBinaryByte(character: string) {
  return character.charCodeAt(0).toString(2).padStart(8, "0");
}

export function translateTextToBinary(text: string): BinaryTranslationResult {
  const bytes = Array.from(text).map(toBinaryByte);
  const output = bytes.join(" ");

  return {
    output,
    inputCharacters: text.length,
    outputCharacters: output.length,
    translatedUnits: bytes.length,
    invalidGroups: 0,
  };
}

export function translateBinaryToText(text: string): BinaryTranslationResult {
  const groups = text.trim().split(/\s+/).filter(Boolean);
  let invalidGroups = 0;

  const characters = groups.map((group) => {
    if (!/^[01]{8}$/.test(group)) {
      invalidGroups += 1;
      return "";
    }

    return String.fromCharCode(Number.parseInt(group, 2));
  });

  const output = characters.join("");

  return {
    output,
    inputCharacters: text.length,
    outputCharacters: output.length,
    translatedUnits: groups.length - invalidGroups,
    invalidGroups,
  };
}

export function translateBinary(text: string, mode: BinaryMode): BinaryTranslationResult {
  return mode === "text-to-binary" ? translateTextToBinary(text) : translateBinaryToText(text);
}
