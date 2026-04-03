import { toIsoDate } from "@/lib/dates";
import { compactText } from "@/lib/text";

export const recordStatusValues = ["draft", "review", "published"] as const;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

export function stringOrUndefined(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = compactText(value);
  return normalized.length ? normalized : undefined;
}

export function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((entry) => stringOrUndefined(entry))
          .filter((entry): entry is string => Boolean(entry)),
      ),
    );
  }

  if (typeof value === "string") {
    return Array.from(
      new Set(
        value
          .split(",")
          .map((entry) => stringOrUndefined(entry))
          .filter((entry): entry is string => Boolean(entry)),
      ),
    );
  }

  return [];
}

export function numberOrUndefined(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function booleanOrUndefined(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
}

export function isoDateOrUndefined(value: unknown): string | undefined {
  return toIsoDate(value);
}
