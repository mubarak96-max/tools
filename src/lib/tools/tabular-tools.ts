import Papa from "papaparse";

export type TabularMode =
  | "transpose"
  | "columns-to-rows"
  | "rows-to-columns"
  | "column-export"
  | "column-delete"
  | "column-replace"
  | "column-insert"
  | "delimiter-change";

export interface TabularOptions {
  mode: TabularMode;
  delimiter: string;
  outputDelimiter: string;
  columnIndex: number;
  replacementValue: string;
  insertValue: string;
}

function parseTable(input: string, delimiter: string) {
  const parsed = Papa.parse<string[]>(input.trim(), {
    delimiter,
    skipEmptyLines: true,
  });

  if (parsed.errors.length) {
    throw new Error(parsed.errors[0]?.message || "Table parsing failed.");
  }

  return parsed.data;
}

function stringifyTable(rows: string[][], delimiter: string) {
  return Papa.unparse(rows, { delimiter });
}

export function transformTable(input: string, options: TabularOptions) {
  try {
    const rows = parseTable(input, options.delimiter);
    const columnIndex = Math.max(0, options.columnIndex);
    let outputRows = rows;

    switch (options.mode) {
      case "transpose":
      case "columns-to-rows":
      case "rows-to-columns": {
        const width = Math.max(...rows.map((row) => row.length), 0);
        outputRows = Array.from({ length: width }, (_, column) => rows.map((row) => row[column] ?? ""));
        break;
      }
      case "column-export":
        outputRows = rows.map((row: string[]) => [row[columnIndex] ?? ""]);
        break;
      case "column-delete":
        outputRows = rows.map((row: string[]) => row.filter((_: string, index: number) => index !== columnIndex));
        break;
      case "column-replace":
        outputRows = rows.map((row: string[]) =>
          row.map((value: string, index: number) => (index === columnIndex ? options.replacementValue : value)),
        );
        break;
      case "column-insert":
        outputRows = rows.map((row: string[]) => {
          const next = [...row];
          next.splice(columnIndex, 0, options.insertValue);
          return next;
        });
        break;
      case "delimiter-change":
        outputRows = rows;
        break;
      default:
        break;
    }

    return {
      output: stringifyTable(outputRows, options.outputDelimiter || options.delimiter),
      rowCount: rows.length,
      columnCount: Math.max(...rows.map((row: string[]) => row.length), 0),
    };
  } catch (error) {
    return {
      output: "",
      rowCount: 0,
      columnCount: 0,
      error: error instanceof Error ? error.message : "Table transformation failed.",
    };
  }
}
