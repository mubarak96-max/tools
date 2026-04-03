import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeData(data: any): any {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((value) => serializeData(value));
  }

  if (typeof data === "object") {
    if (typeof data.toDate === "function") {
      return data.toDate().toISOString();
    }

    const serialized = { ...data };

    for (const [key, value] of Object.entries(serialized)) {
      serialized[key] = serializeData(value);
    }

    return serialized;
  }

  return data;
}
