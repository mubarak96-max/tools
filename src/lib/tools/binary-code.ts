export type BinaryMode = "text-to-binary" | "binary-to-text";
export type BinaryEncoding = "ascii" | "utf-8" | "utf-16";

export interface BinaryTranslationResult {
  output: string;
  inputCharacters: number;
  outputCharacters: number;
  translatedUnits: number;
  invalidGroups: number;
  skippedUnits: number;
  warning: string | null;
}

function toBinaryByte(byte: number) {
  return byte.toString(2).padStart(8, "0");
}

function countCharacters(text: string) {
  return Array.from(text).length;
}

function encodeAscii(text: string) {
  const bytes: number[] = [];
  let skippedUnits = 0;

  for (const character of Array.from(text)) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else {
      skippedUnits += 1;
    }
  }

  return { bytes, skippedUnits };
}

function encodeUtf8(text: string) {
  return { bytes: Array.from(new TextEncoder().encode(text)), skippedUnits: 0 };
}

function encodeUtf16(text: string) {
  const bytes: number[] = [];

  for (let index = 0; index < text.length; index += 1) {
    const codeUnit = text.charCodeAt(index);
    bytes.push(codeUnit & 0xff, codeUnit >> 8);
  }

  return { bytes, skippedUnits: 0 };
}

function parseBinaryGroups(text: string) {
  const groups = text.trim().split(/\s+/).filter(Boolean);
  let invalidGroups = 0;
  const bytes: number[] = [];

  for (const group of groups) {
    if (!/^[01]{8}$/.test(group)) {
      invalidGroups += 1;
      continue;
    }

    bytes.push(Number.parseInt(group, 2));
  }

  return { groups, bytes, invalidGroups };
}

export function normalizeBinaryInput(text: string) {
  const bits = text.replace(/[^01]/g, "");

  if (!bits) {
    return "";
  }

  const groups: string[] = [];

  for (let index = 0; index < bits.length; index += 8) {
    groups.push(bits.slice(index, index + 8));
  }

  return groups.join(" ").trim();
}

export function translateTextToBinary(
  text: string,
  encoding: BinaryEncoding,
): BinaryTranslationResult {
  const encoderResult =
    encoding === "ascii" ? encodeAscii(text) : encoding === "utf-16" ? encodeUtf16(text) : encodeUtf8(text);
  const output = encoderResult.bytes.map(toBinaryByte).join(" ");
  const warning =
    encoding === "ascii" && encoderResult.skippedUnits > 0
      ? "ASCII only supports characters from 0 to 127, so unsupported characters were skipped."
      : null;

  return {
    output,
    inputCharacters: countCharacters(text),
    outputCharacters: output.length,
    translatedUnits: encoderResult.bytes.length,
    invalidGroups: 0,
    skippedUnits: encoderResult.skippedUnits,
    warning,
  };
}

function decodeAscii(bytes: number[]) {
  let skippedUnits = 0;
  const characters: string[] = [];

  for (const byte of bytes) {
    if (byte > 0x7f) {
      skippedUnits += 1;
      continue;
    }

    characters.push(String.fromCharCode(byte));
  }

  return {
    output: characters.join(""),
    skippedUnits,
    warning:
      skippedUnits > 0
        ? "Some bytes were above 127, so they were skipped because they are not valid ASCII."
        : null,
  };
}

function decodeUtf8(bytes: number[]) {
  const source = new Uint8Array(bytes);
  try {
    const output = new TextDecoder("utf-8", { fatal: true }).decode(source);
    return { output, skippedUnits: 0, warning: null };
  } catch {
    const output = new TextDecoder("utf-8").decode(source);
    const skippedUnits = Array.from(output).filter((character) => character === "\uFFFD").length;
    return {
      output,
      skippedUnits,
      warning: "Some byte sequences were not valid UTF-8 and were replaced during decoding.",
    };
  }
}

function decodeUtf16(bytes: number[]) {
  const hasOddByte = bytes.length % 2 !== 0;
  const normalizedBytes = hasOddByte ? bytes.slice(0, -1) : bytes;
  const output = new TextDecoder("utf-16le").decode(new Uint8Array(normalizedBytes));

  return {
    output,
    skippedUnits: hasOddByte ? 1 : 0,
    warning: hasOddByte ? "UTF-16 decoding needs pairs of bytes, so the last unmatched byte was skipped." : null,
  };
}

export function translateBinaryToText(
  text: string,
  encoding: BinaryEncoding,
): BinaryTranslationResult {
  const { groups, bytes, invalidGroups } = parseBinaryGroups(text);
  const decoderResult =
    encoding === "ascii" ? decodeAscii(bytes) : encoding === "utf-16" ? decodeUtf16(bytes) : decodeUtf8(bytes);

  return {
    output: decoderResult.output,
    inputCharacters: text.length,
    outputCharacters: countCharacters(decoderResult.output),
    translatedUnits: groups.length - invalidGroups,
    invalidGroups,
    skippedUnits: decoderResult.skippedUnits,
    warning: decoderResult.warning,
  };
}

export function translateBinary(
  text: string,
  mode: BinaryMode,
  encoding: BinaryEncoding,
): BinaryTranslationResult {
  return mode === "text-to-binary"
    ? translateTextToBinary(text, encoding)
    : translateBinaryToText(text, encoding);
}
