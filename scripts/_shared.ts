import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

export function parseArgs(argv: string[]) {
  const flags = new Set<string>();
  const values = new Map<string, string>();

  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      continue;
    }

    const [key, value] = arg.slice(2).split("=", 2);
    if (value === undefined) {
      flags.add(key);
    } else {
      values.set(key, value);
    }
  }

  return { flags, values };
}

export function sleep(ms: number) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

export function requireOpenRouterKey() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing from .env.local.");
  }
}

export function info(message: string) {
  console.log(message);
}

export function warn(message: string) {
  console.warn(message);
}

export function fail(message: string) {
  console.error(message);
}
