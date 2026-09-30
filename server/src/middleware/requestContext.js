import crypto from "node:crypto";
import { logger } from "../utils/logger.js";

export function requestContext(req, res, next) {
  const supplied = req.get("x-request-id");
  req.requestId = supplied && /^[A-Za-z0-9._-]{8,100}$/.test(supplied) ? supplied : crypto.randomUUID();
  res.set("X-Request-Id", req.requestId);
  const started = performance.now();
  res.on("finish", () => logger.info("HTTP request", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    status: res.statusCode,
    durationMs: Math.round(performance.now() - started),
    actorId: req.user?.sub,
  }));
  next();
}
