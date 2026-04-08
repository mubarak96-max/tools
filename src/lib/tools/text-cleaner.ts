export type WhitespaceMode =
  | "none"
  | "spaces-to-tabs"
  | "tabs-to-spaces"
  | "spaces-to-newlines"
  | "newlines-to-spaces";

export type BackslashMode = "none" | "add" | "remove";

export interface TextCleanerOptions {
  trimLines: boolean;
  removeEmptyLines: boolean;
  collapseSpaces: boolean;
  removeAllWhitespace: boolean;
  removePunctuation: boolean;
  removeAccents: boolean;
  whitespaceMode: WhitespaceMode;
  backslashMode: BackslashMode;
}

export const defaultTextCleanerOptions: TextCleanerOptions = {
  trimLines: false,
  removeEmptyLines: false,
  collapseSpaces: false,
  removeAllWhitespace: false,
  removePunctuation: false,
  removeAccents: false,
  whitespaceMode: "none",
  backslashMode: "none",
};

export function cleanText(text: string, options: TextCleanerOptions) {
  let output = text;

  if (options.removeAccents) {
    output = output.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  switch (options.whitespaceMode) {
    case "spaces-to-tabs":
      output = output.replace(/ {2,}/g, "\t");
      break;
    case "tabs-to-spaces":
      output = output.replace(/\t/g, "  ");
      break;
    case "spaces-to-newlines":
      output = output.replace(/ +/g, "\n");
      break;
    case "newlines-to-spaces":
      output = output.replace(/\r?\n+/g, " ");
      break;
    default:
      break;
  }

  if (options.collapseSpaces) {
    output = output.replace(/[ \t]+/g, " ");
  }

  if (options.removeAllWhitespace) {
    output = output.replace(/\s+/g, "");
  }

  if (options.removePunctuation) {
    output = output.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]+/g, "");
  }

  switch (options.backslashMode) {
    case "add":
      output = output.replace(/["'\\]/g, "\\$&");
      break;
    case "remove":
      output = output.replace(/\\/g, "");
      break;
    default:
      break;
  }

  let lines = output.split(/\r?\n/);

  if (options.trimLines) {
    lines = lines.map((line) => line.trim());
  }

  if (options.removeEmptyLines) {
    lines = lines.filter((line) => line.trim().length > 0);
  }

  output = lines.join("\n");

  return {
    output,
    originalLength: text.length,
    cleanedLength: output.length,
    changed: output !== text,
  };
}
