import figlet from "figlet";
import Standard from "figlet/fonts/Standard";
import Big from "figlet/fonts/Big";
import Block from "figlet/fonts/Block";
import Ghost from "figlet/fonts/Ghost";
import Shadow from "figlet/fonts/Shadow";
import Slant from "figlet/fonts/Slant";
import Small from "figlet/fonts/Small";

export type AsciiArtFont = "Standard" | "Big" | "Block" | "Ghost" | "Shadow" | "Slant" | "Small";
export type AsciiArtLayout = "default" | "full" | "fitted";

export interface AsciiArtOptions {
  font: AsciiArtFont;
  horizontalLayout: AsciiArtLayout;
  width?: number;
  whitespaceBreak?: boolean;
}

export interface AsciiArtResult {
  output: string;
  lines: number;
  widestLine: number;
  characters: number;
}

export const ASCII_ART_FONTS: Array<{ value: AsciiArtFont; label: string }> = [
  { value: "Standard", label: "Standard" },
  { value: "Big", label: "Big" },
  { value: "Block", label: "Block" },
  { value: "Ghost", label: "Ghost" },
  { value: "Shadow", label: "Shadow" },
  { value: "Slant", label: "Slant" },
  { value: "Small", label: "Small" },
];

const FONT_SOURCES: Record<AsciiArtFont, string> = {
  Standard,
  Big,
  Block,
  Ghost,
  Shadow,
  Slant,
  Small,
};

let fontsLoaded = false;

function ensureFontsLoaded() {
  if (fontsLoaded) {
    return;
  }

  figlet.defaults({ fetchFontIfMissing: false });

  for (const [name, source] of Object.entries(FONT_SOURCES)) {
    figlet.parseFont(name, source);
  }

  fontsLoaded = true;
}

export function renderAsciiArt(text: string, options: AsciiArtOptions): AsciiArtResult {
  ensureFontsLoaded();

  const output = figlet.textSync(text || " ", {
    font: options.font,
    horizontalLayout: options.horizontalLayout,
    verticalLayout: "default",
    width: options.width,
    whitespaceBreak: options.whitespaceBreak ?? true,
  });

  const lines = output.split("\n");
  const widestLine = lines.reduce((max, line) => Math.max(max, line.length), 0);

  return {
    output,
    lines: lines.length,
    widestLine,
    characters: text.length,
  };
}
