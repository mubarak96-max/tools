export function logServerError(event: string, error: unknown, context?: Record<string, unknown>) {
  console.error(`[${event}]`, error, context ?? {});
}
