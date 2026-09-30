const blocked = /password|secret|token|authorization|cookie|mongodb|smtp/i;
const sanitize = (value) => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blocked.test(key) ? "[REDACTED]" : sanitize(item)]));
};
const write = (level, message, meta = {}) => console[level === "error" ? "error" : level === "warn" ? "warn" : "info"](JSON.stringify({ level, message, ...sanitize(meta), timestamp: new Date().toISOString() }));
export const logger = {
  info: (message, meta) => write("info", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  error: (message, meta) => write("error", message, meta),
};
