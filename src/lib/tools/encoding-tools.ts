import punycode from "punycode/";

export type EncodingMode =
  | "url-encode"
  | "url-decode"
  | "html-encode"
  | "html-decode"
  | "base64-encode"
  | "base64-decode"
  | "rot13"
  | "rot47"
  | "text-to-binary"
  | "binary-to-text"
  | "text-to-hex"
  | "hex-to-text"
  | "text-to-octal"
  | "octal-to-text"
  | "text-to-decimal"
  | "decimal-to-text"
  | "punycode-encode"
  | "punycode-decode"
  | "idn-encode"
  | "idn-decode";

function htmlEncode(text: string, options: EncodingOptions = {}) {
  const type = options.htmlEntityType || "named";

  if (type === "decimal") {
    return Array.from(text)
      .map((c) => `&#${c.charCodeAt(0)};`)
      .join("");
  }

  if (type === "hex") {
    return Array.from(text)
      .map((c) => `&#x${c.charCodeAt(0).toString(16).toUpperCase()};`)
      .join("");
  }

  // Basic named entities (safe for most contexts)
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlDecode(text: string) {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
  };

  return text.replace(/&[#a-z0-9]+;/gi, (match) => {
    if (entities[match.toLowerCase()]) {
      return entities[match.toLowerCase()];
    }
    if (match.startsWith("&#x")) {
      return String.fromCharCode(Number.parseInt(match.slice(3, -1), 16));
    }
    if (match.startsWith("&#")) {
      return String.fromCharCode(Number.parseInt(match.slice(2, -1), 10));
    }
    return match;
  });
}

function rotateAlpha(text: string, shift: number) {
  return text.replace(/[A-Za-z]/g, (character) => {
    const base = character <= "Z" ? 65 : 97;
    return String.fromCharCode(((character.charCodeAt(0) - base + shift) % 26) + base);
  });
}

function rotateAscii(text: string) {
  return text.replace(/[!-~]/g, (character) => String.fromCharCode(33 + ((character.charCodeAt(0) - 33 + 47) % 94)));
}

function bytesToJoined(text: string, radix: number) {
  return Array.from(text)
    .map((character) => character.charCodeAt(0).toString(radix).padStart(radix === 16 ? 2 : radix === 2 ? 8 : 3, "0"))
    .join(" ");
}

function joinedToBytes(text: string, radix: number) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((value) => String.fromCharCode(Number.parseInt(value, radix)))
    .join("");
}

export interface EncodingOptions {
  plusForSpace?: boolean;
  htmlEntityType?: "named" | "decimal" | "hex";
}

export function transformEncoding(mode: EncodingMode, input: string, options: EncodingOptions = {}) {
  try {
    switch (mode) {
      case "url-encode": {
        let result = encodeURIComponent(input);
        if (options.plusForSpace) {
          result = result.replace(/%20/g, "+");
        }
        return { output: result };
      }
      case "url-decode": {
        const decoded = input.replace(/\+/g, " ");
        return { output: decodeURIComponent(decoded) };
      }
      case "html-encode":
        return { output: htmlEncode(input, options) };
      case "html-decode":
        return { output: htmlDecode(input) };
      case "base64-encode":
        return { output: btoa(unescape(encodeURIComponent(input))) };
      case "base64-decode":
        return { output: decodeURIComponent(escape(atob(input))) };
      case "rot13":
        return { output: rotateAlpha(input, 13) };
      case "rot47":
        return { output: rotateAscii(input) };
      case "text-to-binary":
        return { output: bytesToJoined(input, 2) };
      case "binary-to-text":
        return { output: joinedToBytes(input, 2) };
      case "text-to-hex":
        return { output: bytesToJoined(input, 16) };
      case "hex-to-text":
        return { output: joinedToBytes(input, 16) };
      case "text-to-octal":
        return { output: bytesToJoined(input, 8) };
      case "octal-to-text":
        return { output: joinedToBytes(input, 8) };
      case "text-to-decimal":
        return { output: bytesToJoined(input, 10) };
      case "decimal-to-text":
        return { output: joinedToBytes(input, 10) };
      case "punycode-encode":
        return { output: punycode.encode(input) };
      case "punycode-decode":
        return { output: punycode.decode(input) };
      case "idn-encode":
        return { output: punycode.toASCII(input) };
      case "idn-decode":
        return { output: punycode.toUnicode(input) };
      default:
        return { output: input };
    }
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Transformation failed.",
    };
  }
}
