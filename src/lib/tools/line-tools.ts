export type SortScope = "lines" | "words";
export type SortMode = "none" | "alphabetic" | "numeric" | "length";
export type SortDirection = "asc" | "desc";

export interface LineToolsOptions {
  scope: SortScope;
  trimLines: boolean;
  removeEmptyLines: boolean;
  reverseOrder: boolean;
  sortMode: SortMode;
  sortDirection: SortDirection;
  filterQuery: string;
  caseSensitive: boolean;
  uniqueOnly: boolean;
  prefix: string;
  suffix: string;
  addLineNumbers: boolean;
  joinDelimiter: string;
  truncateLength: number;
}

export const defaultLineToolsOptions: LineToolsOptions = {
  scope: "lines",
  trimLines: false,
  removeEmptyLines: false,
  reverseOrder: false,
  sortMode: "none",
  sortDirection: "asc",
  filterQuery: "",
  caseSensitive: false,
  uniqueOnly: false,
  prefix: "",
  suffix: "",
  addLineNumbers: false,
  joinDelimiter: "\\n",
  truncateLength: 0,
};

function decodeDelimiter(value: string) {
  return value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

function sortValues(values: string[], mode: SortMode, direction: SortDirection) {
  if (mode === "none") {
    return values;
  }

  const sorted = [...values].sort((left, right) => {
    if (mode === "numeric") {
      return Number(left) - Number(right);
    }

    if (mode === "length") {
      return left.length - right.length;
    }

    return left.localeCompare(right);
  });

  return direction === "desc" ? sorted.reverse() : sorted;
}

export function runLineTools(text: string, options: LineToolsOptions) {
  const source = options.scope === "words" ? text.split(/\s+/).filter(Boolean) : text.split(/\r?\n/);
  let values = [...source];

  if (options.trimLines) {
    values = values.map((value) => value.trim());
  }

  if (options.removeEmptyLines) {
    values = values.filter((value) => value.length > 0);
  }

  if (options.filterQuery) {
    const query = options.caseSensitive ? options.filterQuery : options.filterQuery.toLowerCase();
    values = values.filter((value) => {
      const candidate = options.caseSensitive ? value : value.toLowerCase();
      return candidate.includes(query);
    });
  }

  if (options.uniqueOnly) {
    const seen = new Set<string>();
    values = values.filter((value) => {
      const key = options.caseSensitive ? value : value.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  values = sortValues(values, options.sortMode, options.sortDirection);

  if (options.reverseOrder) {
    values.reverse();
  }

  if (options.truncateLength > 0) {
    values = values.map((value) => value.slice(0, options.truncateLength));
  }

  values = values.map((value, index) => {
    const numberedValue = options.addLineNumbers ? `${index + 1}. ${value}` : value;
    return `${options.prefix}${numberedValue}${options.suffix}`;
  });

  const output = values.join(decodeDelimiter(options.joinDelimiter || "\\n"));

  return {
    output,
    inputItems: source.length,
    outputItems: values.length,
    removedItems: Math.max(0, source.length - values.length),
  };
}
