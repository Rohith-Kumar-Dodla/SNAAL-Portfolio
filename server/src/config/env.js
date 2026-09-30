import "dotenv/config";
import { z } from "zod";

const optionalUrl = z.string().url().or(z.literal("")).optional();
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  PUBLIC_URL: optionalUrl,
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  ADMIN_URL: z.string().url().default("http://localhost:5174"),
  MONGODB_URI: optionalUrl,
  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  TRUST_PROXY: z.enum(["false", "loopback", "uniquelocal", "linklocal", "1"]).default("false"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().or(z.literal("")).optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.NODE_ENV !== "production") return;
  for (const key of ["PUBLIC_URL", "CLIENT_URL", "ADMIN_URL", "MONGODB_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"]) {
    if (!value[key]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "Required in production" });
  }
  if (![value.CLIENT_URL, value.ADMIN_URL, value.PUBLIC_URL].every((url) => url?.startsWith("https://"))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["CLIENT_URL"], message: "Production public origins must use HTTPS" });
  }
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error(`Invalid environment configuration (${Object.keys(parsed.error.flatten().fieldErrors).join(", ")})`);
  throw new Error("Environment validation failed");
}
export const env = parsed.data;
