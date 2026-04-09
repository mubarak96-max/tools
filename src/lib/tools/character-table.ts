export type CharacterTableScope = "all" | "ascii" | "unicode";

export type CharacterTableEntry = {
  scope: "ascii" | "unicode";
  char: string;
  name: string;
  codepoint: string;
  decimal: number;
  category: string;
};

const ASCII_CONTROL_NAMES = [
  "Null",
  "Start of Heading",
  "Start of Text",
  "End of Text",
  "End of Transmission",
  "Enquiry",
  "Acknowledge",
  "Bell",
  "Backspace",
  "Horizontal Tab",
  "Line Feed",
  "Vertical Tab",
  "Form Feed",
  "Carriage Return",
  "Shift Out",
  "Shift In",
  "Data Link Escape",
  "Device Control 1",
  "Device Control 2",
  "Device Control 3",
  "Device Control 4",
  "Negative Acknowledge",
  "Synchronous Idle",
  "End of Transmission Block",
  "Cancel",
  "End of Medium",
  "Substitute",
  "Escape",
  "File Separator",
  "Group Separator",
  "Record Separator",
  "Unit Separator",
];

const UNICODE_EXTRA_ENTRIES: CharacterTableEntry[] = [
  { scope: "unicode", char: "\u200B", name: "Zero Width Space", codepoint: "U+200B", decimal: 8203, category: "Invisible" },
  { scope: "unicode", char: "\u200C", name: "Zero Width Non-Joiner", codepoint: "U+200C", decimal: 8204, category: "Invisible" },
  { scope: "unicode", char: "\u200D", name: "Zero Width Joiner", codepoint: "U+200D", decimal: 8205, category: "Invisible" },
  { scope: "unicode", char: "\u2060", name: "Word Joiner", codepoint: "U+2060", decimal: 8288, category: "Invisible" },
  { scope: "unicode", char: "\u3164", name: "Hangul Filler", codepoint: "U+3164", decimal: 12644, category: "Invisible" },
  { scope: "unicode", char: "\u0336", name: "Combining Long Stroke Overlay", codepoint: "U+0336", decimal: 822, category: "Combining Mark" },
  { scope: "unicode", char: "\u0347", name: "Combining Equals Sign Below", codepoint: "U+0347", decimal: 839, category: "Combining Mark" },
  { scope: "unicode", char: "\u035F", name: "Combining Double Macron Below", codepoint: "U+035F", decimal: 863, category: "Combining Mark" },
  { scope: "unicode", char: "\u0324", name: "Combining Diaeresis Below", codepoint: "U+0324", decimal: 804, category: "Combining Mark" },
  { scope: "unicode", char: "\u0330", name: "Combining Tilde Below", codepoint: "U+0330", decimal: 816, category: "Combining Mark" },
  { scope: "unicode", char: "←", name: "Leftwards Arrow", codepoint: "U+2190", decimal: 8592, category: "Arrow" },
  { scope: "unicode", char: "→", name: "Rightwards Arrow", codepoint: "U+2192", decimal: 8594, category: "Arrow" },
  { scope: "unicode", char: "↑", name: "Upwards Arrow", codepoint: "U+2191", decimal: 8593, category: "Arrow" },
  { scope: "unicode", char: "↓", name: "Downwards Arrow", codepoint: "U+2193", decimal: 8595, category: "Arrow" },
  { scope: "unicode", char: "•", name: "Bullet", codepoint: "U+2022", decimal: 8226, category: "Punctuation" },
  { scope: "unicode", char: "—", name: "Em Dash", codepoint: "U+2014", decimal: 8212, category: "Punctuation" },
  { scope: "unicode", char: "–", name: "En Dash", codepoint: "U+2013", decimal: 8211, category: "Punctuation" },
  { scope: "unicode", char: "…", name: "Horizontal Ellipsis", codepoint: "U+2026", decimal: 8230, category: "Punctuation" },
  { scope: "unicode", char: "©", name: "Copyright Sign", codepoint: "U+00A9", decimal: 169, category: "Symbol" },
  { scope: "unicode", char: "®", name: "Registered Sign", codepoint: "U+00AE", decimal: 174, category: "Symbol" },
  { scope: "unicode", char: "™", name: "Trade Mark Sign", codepoint: "U+2122", decimal: 8482, category: "Symbol" },
  { scope: "unicode", char: "✓", name: "Check Mark", codepoint: "U+2713", decimal: 10003, category: "Symbol" },
  { scope: "unicode", char: "✕", name: "Multiplication X", codepoint: "U+2715", decimal: 10005, category: "Symbol" },
  { scope: "unicode", char: "∞", name: "Infinity", codepoint: "U+221E", decimal: 8734, category: "Math" },
  { scope: "unicode", char: "≈", name: "Almost Equal To", codepoint: "U+2248", decimal: 8776, category: "Math" },
  { scope: "unicode", char: "≠", name: "Not Equal To", codepoint: "U+2260", decimal: 8800, category: "Math" },
  { scope: "unicode", char: "≤", name: "Less-Than or Equal To", codepoint: "U+2264", decimal: 8804, category: "Math" },
  { scope: "unicode", char: "≥", name: "Greater-Than or Equal To", codepoint: "U+2265", decimal: 8805, category: "Math" },
  { scope: "unicode", char: "€", name: "Euro Sign", codepoint: "U+20AC", decimal: 8364, category: "Currency" },
  { scope: "unicode", char: "£", name: "Pound Sign", codepoint: "U+00A3", decimal: 163, category: "Currency" },
  { scope: "unicode", char: "¥", name: "Yen Sign", codepoint: "U+00A5", decimal: 165, category: "Currency" },
  { scope: "unicode", char: "₹", name: "Indian Rupee Sign", codepoint: "U+20B9", decimal: 8377, category: "Currency" },
];

function asciiEntry(code: number): CharacterTableEntry {
  if (code < 32) {
    return {
      scope: "ascii",
      char: String.fromCharCode(code),
      name: ASCII_CONTROL_NAMES[code] || "Control",
      codepoint: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
      decimal: code,
      category: "ASCII Control",
    };
  }

  if (code === 32) {
    return {
      scope: "ascii",
      char: " ",
      name: "Space",
      codepoint: "U+0020",
      decimal: 32,
      category: "ASCII Printable",
    };
  }

  if (code === 127) {
    return {
      scope: "ascii",
      char: String.fromCharCode(code),
      name: "Delete",
      codepoint: "U+007F",
      decimal: 127,
      category: "ASCII Control",
    };
  }

  return {
    scope: "ascii",
    char: String.fromCharCode(code),
    name: `ASCII ${String.fromCharCode(code)}`,
    codepoint: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
    decimal: code,
    category: "ASCII Printable",
  };
}

export const CHARACTER_TABLE: CharacterTableEntry[] = [
  ...Array.from({ length: 128 }, (_, index) => asciiEntry(index)),
  ...UNICODE_EXTRA_ENTRIES,
];

export function searchCharacterTable(query: string, scope: CharacterTableScope) {
  const normalized = query.trim().toLowerCase();

  return CHARACTER_TABLE.filter((entry) => {
    if (scope !== "all" && entry.scope !== scope) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    return [
      entry.char,
      entry.name,
      entry.codepoint,
      String(entry.decimal),
      entry.category,
      entry.scope,
    ].some((value) => value.toLowerCase().includes(normalized));
  });
}
