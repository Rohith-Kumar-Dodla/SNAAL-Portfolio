import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import systemRoutes from "./routes/system.routes.js";
import contentRoutes from "./routes/content.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";

const limiter = (limit) => rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: "draft-8", legacyHeaders: false, skip: () => env.NODE_ENV === "test" });
export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  if (env.TRUST_PROXY !== "false") app.set("trust proxy", env.TRUST_PROXY === "1" ? 1 : env.TRUST_PROXY);
  app.use(requestContext);
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    permissionsPolicy: { features: { camera: [], microphone: [], geolocation: [] } },
    strictTransportSecurity: env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true } : false,
  }));
  app.use(cors({
    origin(origin, callback) {
      const allowed = [env.CLIENT_URL, env.ADMIN_URL];
      let developmentLoopback = false;
      if (origin && env.NODE_ENV !== "production") {
        try {
          const url = new URL(origin);
          developmentLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && ["http:", "https:"].includes(url.protocol);
        } catch {
          developmentLoopback = false;
        }
      }
      if (!origin || allowed.includes(origin) || developmentLoopback) return callback(null, true);
      const error = new Error("Origin is not allowed by CORS");
      error.statusCode = 403;
      error.code = "CORS_REJECTED";
      return callback(error);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  }));
  app.use(express.json({ limit: "200kb" }));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));
  app.use(cookieParser());
  app.use("/api", limiter(300));
  app.use("/api/v1/admin/media", limiter(40));
  app.use("/api/v1", systemRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/admin", adminRoutes);
  app.use("/api/v1", contentRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
