export type CharacterTableScope = "all" | "ascii" | "unicode";

export type CharacterTableEntry = {
  scope: "ascii" | "unicode";
  char: string;
  name: string;
  codepoint: string;
  decimal: number;
  hex: string;
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
  { scope: "unicode", char: "\u200B", name: "Zero Width Space", codepoint: "U+200B", decimal: 8203, hex: "0x200B", category: "Invisible" },
  { scope: "unicode", char: "\u200C", name: "Zero Width Non-Joiner", codepoint: "U+200C", decimal: 8204, hex: "0x200C", category: "Invisible" },
  { scope: "unicode", char: "\u200D", name: "Zero Width Joiner", codepoint: "U+200D", decimal: 8205, hex: "0x200D", category: "Invisible" },
  { scope: "unicode", char: "\u00A0", name: "No-Break Space", codepoint: "U+00A0", decimal: 160, hex: "0x00A0", category: "Whitespace" },
  { scope: "unicode", char: "\u2060", name: "Word Joiner", codepoint: "U+2060", decimal: 8288, hex: "0x2060", category: "Invisible" },
  { scope: "unicode", char: "\u3164", name: "Hangul Filler", codepoint: "U+3164", decimal: 12644, hex: "0x3164", category: "Invisible" },
  { scope: "unicode", char: "\u0336", name: "Combining Long Stroke Overlay", codepoint: "U+0336", decimal: 822, hex: "0x0336", category: "Combining Mark" },
  { scope: "unicode", char: "\u0347", name: "Combining Equals Sign Below", codepoint: "U+0347", decimal: 839, hex: "0x0347", category: "Combining Mark" },
  { scope: "unicode", char: "\u035F", name: "Combining Double Macron Below", codepoint: "U+035F", decimal: 863, hex: "0x035F", category: "Combining Mark" },
  { scope: "unicode", char: "\u0324", name: "Combining Diaeresis Below", codepoint: "U+0324", decimal: 804, hex: "0x0324", category: "Combining Mark" },
  { scope: "unicode", char: "\u0330", name: "Combining Tilde Below", codepoint: "U+0330", decimal: 816, hex: "0x0330", category: "Combining Mark" },
  { scope: "unicode", char: "\u2190", name: "Leftwards Arrow", codepoint: "U+2190", decimal: 8592, hex: "0x2190", category: "Arrow" },
  { scope: "unicode", char: "\u2192", name: "Rightwards Arrow", codepoint: "U+2192", decimal: 8594, hex: "0x2192", category: "Arrow" },
  { scope: "unicode", char: "\u2191", name: "Upwards Arrow", codepoint: "U+2191", decimal: 8593, hex: "0x2191", category: "Arrow" },
  { scope: "unicode", char: "\u2193", name: "Downwards Arrow", codepoint: "U+2193", decimal: 8595, hex: "0x2193", category: "Arrow" },
  { scope: "unicode", char: "\u2022", name: "Bullet", codepoint: "U+2022", decimal: 8226, hex: "0x2022", category: "Punctuation" },
  { scope: "unicode", char: "\u2014", name: "Em Dash", codepoint: "U+2014", decimal: 8212, hex: "0x2014", category: "Punctuation" },
  { scope: "unicode", char: "\u2013", name: "En Dash", codepoint: "U+2013", decimal: 8211, hex: "0x2013", category: "Punctuation" },
  { scope: "unicode", char: "\u2026", name: "Horizontal Ellipsis", codepoint: "U+2026", decimal: 8230, hex: "0x2026", category: "Punctuation" },
  { scope: "unicode", char: "\u00A9", name: "Copyright Sign", codepoint: "U+00A9", decimal: 169, hex: "0x00A9", category: "Symbol" },
  { scope: "unicode", char: "\u00AE", name: "Registered Sign", codepoint: "U+00AE", decimal: 174, hex: "0x00AE", category: "Symbol" },
  { scope: "unicode", char: "\u2122", name: "Trade Mark Sign", codepoint: "U+2122", decimal: 8482, hex: "0x2122", category: "Symbol" },
  { scope: "unicode", char: "\u2713", name: "Check Mark", codepoint: "U+2713", decimal: 10003, hex: "0x2713", category: "Symbol" },
  { scope: "unicode", char: "\u2715", name: "Multiplication X", codepoint: "U+2715", decimal: 10005, hex: "0x2715", category: "Symbol" },
  { scope: "unicode", char: "\u221E", name: "Infinity", codepoint: "U+221E", decimal: 8734, hex: "0x221E", category: "Math" },
  { scope: "unicode", char: "\u2248", name: "Almost Equal To", codepoint: "U+2248", decimal: 8776, hex: "0x2248", category: "Math" },
  { scope: "unicode", char: "\u2260", name: "Not Equal To", codepoint: "U+2260", decimal: 8800, hex: "0x2260", category: "Math" },
  { scope: "unicode", char: "\u2264", name: "Less-Than or Equal To", codepoint: "U+2264", decimal: 8804, hex: "0x2264", category: "Math" },
  { scope: "unicode", char: "\u2265", name: "Greater-Than or Equal To", codepoint: "U+2265", decimal: 8805, hex: "0x2265", category: "Math" },
  { scope: "unicode", char: "\u20AC", name: "Euro Sign", codepoint: "U+20AC", decimal: 8364, hex: "0x20AC", category: "Currency" },
  { scope: "unicode", char: "\u00A3", name: "Pound Sign", codepoint: "U+00A3", decimal: 163, hex: "0x00A3", category: "Currency" },
  { scope: "unicode", char: "\u00A5", name: "Yen Sign", codepoint: "U+00A5", decimal: 165, hex: "0x00A5", category: "Currency" },
  { scope: "unicode", char: "\u20B9", name: "Indian Rupee Sign", codepoint: "U+20B9", decimal: 8377, hex: "0x20B9", category: "Currency" },
];

function asciiEntry(code: number): CharacterTableEntry {
  const hex = `0x${code.toString(16).toUpperCase().padStart(2, "0")}`;

  if (code < 32) {
    return {
      scope: "ascii",
      char: String.fromCharCode(code),
      name: ASCII_CONTROL_NAMES[code] || "Control",
      codepoint: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
      decimal: code,
      hex,
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
      hex,
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
      hex,
      category: "ASCII Control",
    };
  }

  return {
    scope: "ascii",
    char: String.fromCharCode(code),
    name: `ASCII ${String.fromCharCode(code)}`,
    codepoint: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
    decimal: code,
    hex,
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
      entry.hex,
      entry.category,
      entry.scope,
    ].some((value) => value.toLowerCase().includes(normalized));
  });
}
