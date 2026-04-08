import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { marked } from "marked";
import Papa from "papaparse";
import TurndownService from "turndown";
import YAML from "yaml";

export type DataFormat = "json" | "yaml" | "xml" | "csv" | "text" | "html" | "markdown";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});

const turndown = new TurndownService();

function parseCsv(value: string) {
  const parsed = Papa.parse<string[]>(value.trim(), { skipEmptyLines: true });
  if (parsed.errors.length) {
    throw new Error(parsed.errors[0]?.message || "CSV parsing failed.");
  }
  return parsed.data;
}

function stringifyCsv(value: unknown) {
  if (Array.isArray(value)) {
    return Papa.unparse(value as string[][]);
  }

  if (typeof value === "object" && value) {
    return Papa.unparse([value as Record<string, string | number | boolean | null>]);
  }

  return String(value ?? "");
}

function toIntermediate(format: DataFormat, input: string) {
  switch (format) {
    case "json":
      return JSON.parse(input);
    case "yaml":
      return YAML.parse(input);
    case "xml":
      return xmlParser.parse(input);
    case "csv":
      return parseCsv(input);
    case "markdown":
      return input;
    case "html":
      return input;
    default:
      return input;
  }
}

function fromIntermediate(format: DataFormat, value: unknown) {
  switch (format) {
    case "json":
      return JSON.stringify(value, null, 2);
    case "yaml":
      return YAML.stringify(value);
    case "xml":
      return xmlBuilder.build(value);
    case "csv":
      return stringifyCsv(value);
    case "markdown":
      return typeof value === "string" ? turndown.turndown(value) : turndown.turndown(JSON.stringify(value, null, 2));
    case "html":
      return typeof value === "string"
        ? (marked.parse(value, { async: false }) as string)
        : `<pre>${JSON.stringify(value, null, 2)}</pre>`;
    case "text":
      if (typeof value === "string") {
        return value;
      }
      return JSON.stringify(value, null, 2);
    default:
      return String(value ?? "");
  }
}

export function convertDataFormat(input: string, from: DataFormat, to: DataFormat) {
  try {
    if (from === "html" && to === "markdown") {
      return { output: turndown.turndown(input) };
    }

    if (from === "markdown" && to === "html") {
      return { output: marked.parse(input, { async: false }) as string };
    }

    if (from === "html" && to === "text") {
      return { output: input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() };
    }

    const intermediate = toIntermediate(from, input);
    return { output: fromIntermediate(to, intermediate) };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Conversion failed.",
    };
  }
}
