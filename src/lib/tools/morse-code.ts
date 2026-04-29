export type MorseMode = "text-to-morse" | "morse-to-text";

export interface MorseTranslationResult {
  output: string;
  inputCharacters: number;
  outputCharacters: number;
  translatedUnits: number;
  unsupportedCount: number;
}

export interface MorseReferenceItem {
  character: string;
  morse: string;
}

const TEXT_TO_MORSE: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "-": "-....-",
  "(": "-.--.",
  ")": "-.--.-",
  "@": ".--.-.",
  ":": "---...",
  ";": "-.-.-.",
  "'": ".----.",
  '"': ".-..-.",
  "&": ".-...",
  "=": "-...-",
  "+": ".-.-.",
  _: "..--.-",
  $: "...-..-",
};

const MORSE_TO_TEXT = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([character, morse]) => [morse, character.toUpperCase()]),
) as Record<string, string>;

export const MORSE_REFERENCE: MorseReferenceItem[] = Object.entries(TEXT_TO_MORSE).map(([character, morse]) => ({
  character: character.toUpperCase(),
  morse,
}));

export const MORSE_PROSIGNS_REFERENCE: Array<{ prosign: string; meaning: string; morse: string }> = [
  { prosign: "AR", meaning: "End of message", morse: ".-.-." },
  { prosign: "AS", meaning: "Wait", morse: ".-..." },
  { prosign: "BT", meaning: "New section or separator", morse: "-...-" },
  { prosign: "KN", meaning: "Specific station only", morse: "-.--." },
  { prosign: "SK", meaning: "End of contact", morse: "...-.-" },
];

export function normalizeMorseInput(text: string) {
  return text.trim().replace(/\s*\/\s*/g, " / ");
}

export function translateTextToMorse(text: string): MorseTranslationResult {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const outputWords: string[] = [];
  let translatedUnits = 0;
  let unsupportedCount = 0;

  for (const word of words) {
    const encodedCharacters: string[] = [];

    for (const character of word) {
      const morse = TEXT_TO_MORSE[character];

      if (morse) {
        encodedCharacters.push(morse);
        translatedUnits += 1;
      } else {
        unsupportedCount += 1;
      }
    }

    if (encodedCharacters.length) {
      outputWords.push(encodedCharacters.join(" "));
    }
  }

  const output = outputWords.join(" / ");

  return {
    output,
    inputCharacters: text.length,
    outputCharacters: output.length,
    translatedUnits,
    unsupportedCount,
  };
}

export function translateMorseToText(text: string): MorseTranslationResult {
  const normalized = normalizeMorseInput(text);

  if (!normalized) {
    return {
      output: "",
      inputCharacters: 0,
      outputCharacters: 0,
      translatedUnits: 0,
      unsupportedCount: 0,
    };
  }

  const words = normalized.split(" / ");
  const decodedWords: string[] = [];
  let translatedUnits = 0;
  let unsupportedCount = 0;

  for (const word of words) {
    const parts = word.split(/\s+/).filter(Boolean);
    const decodedCharacters = parts.map((part) => {
      const character = MORSE_TO_TEXT[part];

      if (character) {
        translatedUnits += 1;
        return character;
      }

      unsupportedCount += 1;
      return "";
    });

    decodedWords.push(decodedCharacters.join(""));
  }

  const output = decodedWords.join(" ").trim();

  return {
    output,
    inputCharacters: text.length,
    outputCharacters: output.length,
    translatedUnits,
    unsupportedCount,
  };
}

export function translateMorse(text: string, mode: MorseMode): MorseTranslationResult {
  return mode === "text-to-morse" ? translateTextToMorse(text) : translateMorseToText(text);
}
