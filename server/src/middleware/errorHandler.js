import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
export function notFound(req, res) {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "The requested resource was not found", requestId: req.requestId } });
}
export function errorHandler(error, req, res, _next) {
  let status = error.statusCode || 500;
  let code = error.code || "INTERNAL_ERROR";
  let message = error.message || "An unexpected error occurred";
  let fields = error.details;
  if (error.name === "CastError") { status = 404; code = "NOT_FOUND"; message = "Record not found"; }
  if (error?.code === 11000) { status = 409; code = "DUPLICATE_RECORD"; message = "A record with that unique value already exists"; }
  if (error.name === "ValidationError" && error.errors) {
    status = 400; code = "VALIDATION_ERROR"; message = "Please check the submitted information.";
    fields = Object.fromEntries(Object.entries(error.errors).map(([key, value]) => [key, value.message]));
  }
  logger.error("Request failed", { requestId: req.requestId, method: req.method, path: req.originalUrl, status, error: message });
  const safeMessage = status === 500 && env.NODE_ENV === "production" ? "An unexpected error occurred" : message;
  const body = { success: false, error: { code, message: safeMessage, requestId: req.requestId } };
  if (fields) body.error.fields = fields;
  if (env.NODE_ENV !== "production" && status === 500) body.error.stack = error.stack;
  res.status(status).json(body);
}
