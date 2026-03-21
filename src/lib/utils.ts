import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeData(data: any): any {
  if (!data) return data;
  const serialized = { ...data };
  if (serialized.createdAt?.toDate) serialized.createdAt = serialized.createdAt.toDate().toISOString();
  if (serialized.updatedAt?.toDate) serialized.updatedAt = serialized.updatedAt.toDate().toISOString();
  return serialized;
}
