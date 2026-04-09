export type ListDirection = "text-to-list" | "list-to-text";

type ListOptions = {
  direction: ListDirection;
  delimiter: string;
  trimItems: boolean;
  ignoreEmpty: boolean;
};

function decodeDelimiter(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r");
}

function normalizeItems(items: string[], trimItems: boolean, ignoreEmpty: boolean) {
  return items
    .map((item) => (trimItems ? item.trim() : item))
    .filter((item) => (ignoreEmpty ? item.length > 0 : true));
}

export function convertTextAndList(text: string, options: ListOptions) {
  const delimiter = decodeDelimiter(options.delimiter || ",");

  if (options.direction === "text-to-list") {
    const parts = normalizeItems(text.split(delimiter), options.trimItems, options.ignoreEmpty);
    return parts.join("\n");
  }

  const parts = normalizeItems(text.split(/\r?\n/), options.trimItems, options.ignoreEmpty);
  return parts.join(delimiter);
}
