// Simple pluggable error logging utility.
// Replace console logging with remote logging if needed.
export interface LoggedErrorPayload {
  message: string;
  stack?: string;
  name?: string;
  componentStack?: string;
  errorId: string;
  time: string;
}

export function logError(payload: LoggedErrorPayload) {
  if (import.meta.env.DEV) {
    console.error("[app-error]", payload);
  }
  // Example beacon placeholder (disabled by default)
  // try { navigator.sendBeacon('/__error', JSON.stringify(payload)); } catch {}
}
