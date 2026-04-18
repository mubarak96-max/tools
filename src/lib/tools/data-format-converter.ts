import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { marked } from "marked";
import Papa from "papaparse";
import TurndownService from "turndown";
import * as XLSX from "xlsx";
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

function flattenObject(obj: any, prefix = ""): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value, propName));
      } else {
        flattened[propName] = value;
      }
    }
  }

  return flattened;
}

function stringifyCsv(value: unknown) {
  if (Array.isArray(value)) {
    // If it's an array of objects, flatten each object
    if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      const flattenedArray = value.map((item) => (typeof item === "object" ? flattenObject(item) : { value: item }));
      return Papa.unparse(flattenedArray);
    }
    return Papa.unparse(value as string[][]);
  }

  if (typeof value === "object" && value) {
    return Papa.unparse([flattenObject(value)]);
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

export function exportToExcel(data: string, from: DataFormat) {
  try {
    const intermediate = toIntermediate(from, data);
    const rows = Array.isArray(intermediate)
      ? intermediate.map((item: any) => (typeof item === "object" && item !== null ? flattenObject(item) : { value: item }))
      : [typeof intermediate === "object" && intermediate !== null ? flattenObject(intermediate) : { value: intermediate }];

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } catch {
    return null;
  }
}
