import "server-only";

type LogLevel = "info" | "warn" | "error";

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
}

function writeLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  });

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.log(payload);
}

export function logServerInfo(message: string, context?: Record<string, unknown>) {
  writeLog("info", message, context);
}

export function logServerWarn(message: string, context?: Record<string, unknown>) {
  writeLog("warn", message, context);
}

export function logServerError(
  message: string,
  error?: unknown,
  context?: Record<string, unknown>,
) {
  writeLog("error", message, {
    ...(context || {}),
    ...(error === undefined ? {} : { error: serializeError(error) }),
  });
}
