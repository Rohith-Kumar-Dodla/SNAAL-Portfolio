# Backend Implementation

## Phase 6 final state

The backend is production-hardened in code and passed local/runtime regression, but production launch remains externally unconfigured.

## Architecture and environment

Express serves versioned public, authentication, Admin, media, health, readiness, sitemap, and robots endpoints. MongoDB/Mongoose remains the system of record; Cloudinary remains the media authority.

Production configuration is validated at startup. Required variables by name are:

- `NODE_ENV`, `PORT`, `PUBLIC_URL`, `CLIENT_URL`, `ADMIN_URL`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `COOKIE_SAME_SITE`, `TRUST_PROXY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Optional SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`
- Optional CAPTCHA: `RECAPTCHA_SECRET_KEY`
- One-time bootstrap: `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`

Production requires HTTPS origins, MongoDB, and both independent JWT secrets. Proxy trust is explicit rather than unconditional. Cookie SameSite policy is deployment-configurable; cookies are HTTP-only and become secure in production. The bootstrap plaintext password is not required after the initial Admin exists and should be removed from production configuration unless a documented recovery procedure requires it.

## Security

Authentication uses bcrypt, short-lived access JWTs, refresh JWT rotation, hashed stored refresh tokens, logout invalidation, active-Admin checks, and backend role enforcement. Every Admin route is protected by authentication and role middleware.

CORS accepts only configured public/Admin origins for credentialed requests and rejects unexpected origins. Helmet supplies CSP and standard security headers, strict referrer policy, restricted camera/microphone/geolocation permissions, and production HSTS. JSON, URL-encoded, validation-array, pagination, and media sizes are bounded.

General, login, public-submission, and media routes have separate rate limits. Zod schemas are strict and backend-authoritative. Text fields strip angle brackets, external URLs require valid URL syntax, public queries select published records, password hashes are excluded by default, and media endpoints remain authenticated with MIME/size checks and reference-protected deletion.

## Logging and errors

Every request receives a safe `X-Request-Id`; acceptable caller IDs are preserved. Structured logs distinguish info, warning, and error and include request ID, method, route, status, duration, and safe actor ID when available. Recursive redaction covers password, secret, token, authorization, cookie, MongoDB, and SMTP keys.

Production 500 responses suppress stack traces and internals. Error responses include a safe request ID for correlation. No external error-monitoring provider is configured; structured server logging is the integration point.

## Health, readiness, and shutdown

`/api/v1/health` reports process health. `/api/v1/ready` reflects MongoDB readiness without exposing its URI. Live verification returned health 200 and readiness 200 with MongoDB connected. SIGINT and SIGTERM stop the HTTP server and disconnect Mongoose.

## MongoDB and Cloudinary

MongoDB Atlas and Cloudinary were verified in the earlier runtime acceptance and were configured/connected during Phase 6 runtime. Production must use a separate least-privilege database user, TLS, restricted network access, and the intended production database. No automatic production seed runs on startup.

Cloudinary upload/delete configuration remains server-only. Uploads are restricted to supported image MIME types and 8 MB, and referenced assets cannot be deleted. Failure states remain explicit.

## SMTP, CAPTCHA, and analytics

SMTP is not configured; leads and visits persist successfully but no email notification is claimed. reCAPTCHA is not configured; rate limiting and validation remain active and forms are not broken. Analytics is not configured and no tracking ID was fabricated.

## Backup and recovery

A backup mechanism was not independently verified. Before launch, confirm the selected MongoDB Atlas tier's backup/PITR policy, Cloudinary asset recovery/retention policy, and secure environment-configuration backup.

Recovery procedure:

1. Restore the intended MongoDB snapshot to the production database.
2. Restore Cloudinary assets or reconnect preserved public IDs and media references.
3. Restore environment variables through the hosting secret manager.
4. Redeploy API, public frontend, and Admin artifacts.
5. verify health, readiness, authentication, representative media, forms, and published routes.

## Deployment architecture

Intended production flow is Public SPA and Admin SPA to the HTTPS API, then MongoDB Atlas and Cloudinary, with SMTP/CAPTCHA only when configured. Actual hosting targets, domains, certificates, CORS origins, cookie topology, and backup policy remain external launch blockers.

