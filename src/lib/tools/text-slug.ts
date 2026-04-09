type SlugOptions = {
  separator?: string;
  lowercase?: boolean;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugifyLine(value: string, separator: string, lowercase: boolean) {
  const base = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .trim();

  if (!base) {
    return "";
  }

  const normalized = base.replace(/[^A-Za-z0-9]+/g, separator);
  const separatorPattern = escapeRegExp(separator);
  const cleaned = normalized
    .replace(new RegExp(`(?:${separatorPattern}){2,}`, "g"), separator)
    .replace(new RegExp(`^(?:${separatorPattern})+|(?:${separatorPattern})+$`, "g"), "");

  return lowercase ? cleaned.toLowerCase() : cleaned;
}

export function convertTextToSlug(value: string, options: SlugOptions = {}) {
  const separator = options.separator?.trim() || "-";
  const lowercase = options.lowercase ?? true;

  return value
    .split(/\r?\n/)
    .map((line) => slugifyLine(line, separator, lowercase))
    .join("\n");
}
