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

function htmlEncode(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlDecode(text: string) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
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

export function transformEncoding(mode: EncodingMode, input: string) {
  try {
    switch (mode) {
      case "url-encode":
        return { output: encodeURIComponent(input) };
      case "url-decode":
        return { output: decodeURIComponent(input) };
      case "html-encode":
        return { output: htmlEncode(input) };
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
