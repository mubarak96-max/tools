export type FancyFontStyle =
  | "bold"
  | "italic"
  | "bold-italic"
  | "script"
  | "double-struck"
  | "sans-bold"
  | "monospace";

export type InvisibleCharacterMode =
  | "zero-width-space"
  | "zero-width-non-joiner"
  | "zero-width-joiner"
  | "word-joiner"
  | "hangul-filler";

export type InvisibleTextResult = {
  output: string;
  count: number;
  label: string;
  codepoint: string;
};

type AlphabetMap = {
  upper?: string[];
  lower?: string[];
  digits?: string[];
};

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz".split("");
const DIGITS = "0123456789".split("");

const FANCY_FONT_MAPS: Record<FancyFontStyle, AlphabetMap> = {
  bold: {
    upper: Array.from("𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙"),
    lower: Array.from("𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳"),
    digits: Array.from("𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"),
  },
  italic: {
    upper: Array.from("𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍"),
    lower: Array.from("𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧"),
  },
  "bold-italic": {
    upper: Array.from("𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁"),
    lower: Array.from("𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛"),
  },
  script: {
    upper: ["𝒜", "ℬ", "𝒞", "𝒟", "ℰ", "ℱ", "𝒢", "ℋ", "ℐ", "𝒥", "𝒦", "ℒ", "ℳ", "𝒩", "𝒪", "𝒫", "𝒬", "ℛ", "𝒮", "𝒯", "𝒰", "𝒱", "𝒲", "𝒳", "𝒴", "𝒵"],
    lower: ["𝒶", "𝒷", "𝒸", "𝒹", "ℯ", "𝒻", "ℊ", "𝒽", "𝒾", "𝒿", "𝓀", "𝓁", "𝓂", "𝓃", "ℴ", "𝓅", "𝓆", "𝓇", "𝓈", "𝓉", "𝓊", "𝓋", "𝓌", "𝓍", "𝓎", "𝓏"],
  },
  "double-struck": {
    upper: ["𝔸", "𝔹", "ℂ", "𝔻", "𝔼", "𝔽", "𝔾", "ℍ", "𝕀", "𝕁", "𝕂", "𝕃", "𝕄", "ℕ", "𝕆", "ℙ", "ℚ", "ℝ", "𝕊", "𝕋", "𝕌", "𝕍", "𝕎", "𝕏", "𝕐", "ℤ"],
    lower: Array.from("𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫"),
    digits: Array.from("𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"),
  },
  "sans-bold": {
    upper: Array.from("𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭"),
    lower: Array.from("𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"),
    digits: Array.from("𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"),
  },
  monospace: {
    upper: Array.from("𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉"),
    lower: Array.from("𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣"),
    digits: Array.from("𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"),
  },
};

const TINY_TEXT_MAP: Record<string, string> = {
  a: "ᵃ",
  b: "ᵇ",
  c: "ᶜ",
  d: "ᵈ",
  e: "ᵉ",
  f: "ᶠ",
  g: "ᵍ",
  h: "ʰ",
  i: "ᶦ",
  j: "ʲ",
  k: "ᵏ",
  l: "ˡ",
  m: "ᵐ",
  n: "ⁿ",
  o: "ᵒ",
  p: "ᵖ",
  q: "𐞥",
  r: "ʳ",
  s: "ˢ",
  t: "ᵗ",
  u: "ᵘ",
  v: "ᵛ",
  w: "ʷ",
  x: "ˣ",
  y: "ʸ",
  z: "ᶻ",
  A: "ᴬ",
  B: "ᴮ",
  C: "ᶜ",
  D: "ᴰ",
  E: "ᴱ",
  F: "ᶠ",
  G: "ᴳ",
  H: "ᴴ",
  I: "ᴵ",
  J: "ᴶ",
  K: "ᴷ",
  L: "ᴸ",
  M: "ᴹ",
  N: "ᴺ",
  O: "ᴼ",
  P: "ᴾ",
  Q: "𐞥",
  R: "ᴿ",
  S: "ˢ",
  T: "ᵀ",
  U: "ᵁ",
  V: "ⱽ",
  W: "ᵂ",
  X: "ˣ",
  Y: "ʸ",
  Z: "ᶻ",
  0: "⁰",
  1: "¹",
  2: "²",
  3: "³",
  4: "⁴",
  5: "⁵",
  6: "⁶",
  7: "⁷",
  8: "⁸",
  9: "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
};

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ƃ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "ꞁ",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  A: "∀",
  B: "𐐒",
  C: "Ɔ",
  D: "◖",
  E: "Ǝ",
  F: "Ⅎ",
  G: "⅁",
  H: "H",
  I: "I",
  J: "ſ",
  K: "⋊",
  L: "⅂",
  M: "W",
  N: "N",
  O: "O",
  P: "Ԁ",
  Q: "Ό",
  R: "ᴚ",
  S: "S",
  T: "⊥",
  U: "∩",
  V: "Λ",
  W: "M",
  X: "X",
  Y: "⅄",
  Z: "Z",
  "1": "⇂",
  "2": "ᄅ",
  "3": "Ɛ",
  "4": "ㄣ",
  "5": "ϛ",
  "6": "9",
  "7": "ㄥ",
  "8": "8",
  "9": "6",
  "0": "0",
  ".": "˙",
  ",": "'",
  "'": ",",
  "\"": "„",
  "!": "¡",
  "?": "¿",
  "[": "]",
  "]": "[",
  "(": ")",
  ")": "(",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
  "&": "⅋",
  "_": "‾",
  ";": "؛",
};

const INVISIBLE_CHARACTERS: Record<InvisibleCharacterMode, { label: string; value: string; codepoint: string }> = {
  "zero-width-space": { label: "Zero-width space", value: "\u200B", codepoint: "U+200B" },
  "zero-width-non-joiner": { label: "Zero-width non-joiner", value: "\u200C", codepoint: "U+200C" },
  "zero-width-joiner": { label: "Zero-width joiner", value: "\u200D", codepoint: "U+200D" },
  "word-joiner": { label: "Word joiner", value: "\u2060", codepoint: "U+2060" },
  "hangul-filler": { label: "Hangul filler", value: "\u3164", codepoint: "U+3164" },
};

function mapCharacters(text: string, map: Record<string, string>) {
  return Array.from(text).map((character) => map[character] ?? map[character.toLowerCase()] ?? character).join("");
}

export function generateFancyFont(text: string, style: FancyFontStyle) {
  const alphabet = FANCY_FONT_MAPS[style];
  const output = Array.from(text).map((character) => {
    const upperIndex = UPPERCASE.indexOf(character);
    if (upperIndex >= 0) {
      return alphabet.upper?.[upperIndex] ?? character;
    }

    const lowerIndex = LOWERCASE.indexOf(character);
    if (lowerIndex >= 0) {
      return alphabet.lower?.[lowerIndex] ?? character;
    }

    const digitIndex = DIGITS.indexOf(character);
    if (digitIndex >= 0) {
      return alphabet.digits?.[digitIndex] ?? character;
    }

    return character;
  }).join("");

  return {
    output,
    styleLabel: style,
  };
}

export function generateTinyText(text: string) {
  return mapCharacters(text, TINY_TEXT_MAP);
}

export function generateUpsideDownText(text: string) {
  return Array.from(text)
    .reverse()
    .map((character) => UPSIDE_DOWN_MAP[character] ?? UPSIDE_DOWN_MAP[character.toLowerCase()] ?? character)
    .join("");
}

export function generateInvisibleText(mode: InvisibleCharacterMode, count: number): InvisibleTextResult {
  const character = INVISIBLE_CHARACTERS[mode];
  const safeCount = Math.min(Math.max(count, 1), 200);

  return {
    output: character.value.repeat(safeCount),
    count: safeCount,
    label: character.label,
    codepoint: character.codepoint,
  };
}
