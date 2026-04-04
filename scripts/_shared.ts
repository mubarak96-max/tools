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

export function parseNumberArg(
  values: Map<string, string>,
  key: string,
  fallback: number,
  options?: { min?: number; max?: number },
) {
  const raw = values.get(key);
  const parsed = raw ? Number(raw) : fallback;

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  if (typeof options?.min === "number" && parsed < options.min) {
    return options.min;
  }

  if (typeof options?.max === "number" && parsed > options.max) {
    return options.max;
  }

  return parsed;
}

export function isDryRun(flags: Set<string>) {
  return flags.has("dry-run");
}

export async function withRetry<T>(
  label: string,
  operation: () => Promise<T>,
  options?: {
    attempts?: number;
    baseDelayMs?: number;
  },
): Promise<T> {
  const attempts = options?.attempts ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 750;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      warn(
        `${label} failed on attempt ${attempt}/${attempts}: ${error instanceof Error ? error.message : "unknown error"}`,
      );

      if (attempt < attempts) {
        await sleep(baseDelayMs * attempt);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`${label} failed`);
}

export async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  const normalizedConcurrency = Math.max(1, Math.min(concurrency, items.length || 1));
  let nextIndex = 0;

  const runners = Array.from({ length: normalizedConcurrency }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      await worker(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(runners);
}

export function createProgressTracker(label: string, total: number) {
  let completed = 0;
  let succeeded = 0;
  let skipped = 0;
  let failed = 0;

  function print(status: string, detail: string) {
    info(
      `[${label}] ${status} ${completed}/${total} | ok=${succeeded} skip=${skipped} fail=${failed} | ${detail}`,
    );
  }

  return {
    success(detail: string) {
      completed += 1;
      succeeded += 1;
      print("done", detail);
    },
    skip(detail: string) {
      completed += 1;
      skipped += 1;
      print("skip", detail);
    },
    failure(detail: string) {
      completed += 1;
      failed += 1;
      print("fail", detail);
    },
    summary() {
      return { total, completed, succeeded, skipped, failed };
    },
  };
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
