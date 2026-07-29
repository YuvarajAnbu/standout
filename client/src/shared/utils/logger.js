export function reportError(error, context = {}) {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  const detail = { error: normalizedError, context };

  window.dispatchEvent(new CustomEvent("standout:error", { detail }));
  if (import.meta.env.DEV) console.error(normalizedError, context);
}
