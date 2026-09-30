# Testing

## Phase 6 final acceptance — 30 September 2026

Status: **Partially Complete**. Code hardening and automated verification pass; production deployment and parts of the required manual acceptance matrix remain unavailable.

## Automated verification

- Public: 16 passed
- Admin: 6 passed
- Backend: 18 passed
- Total: 40 passed, 0 failed
- ESLint: passed for public, Admin, and server
- Public production build: passed; 2,117 modules; main JS 401.34 kB (134.55 kB gzip)
- Admin production build: passed; 1,701 modules; main JS 283.18 kB (92.35 kB gzip)
- Production dependency audit: 0 vulnerabilities across 217 production dependencies

Phase 6 added backend tests for generated/preserved request IDs, rejection of an unexpected CORS origin, safe loopback-origin support during local development, and fail-closed crawler behavior when no production origin exists.

## Security QA

Verified automated/runtime behavior includes Helmet headers, absence of `X-Powered-By`, explicit CORS rejection, protected Admin/media endpoints, login/input validation, bounded pagination, request IDs, safe production-style error contracts, rate-limit configuration, strict schemas, and password-hash exclusion. A source audit found no committed MongoDB/JWT/Cloudinary/SMTP/private-key secret outside the ignored environment file.

## Runtime QA

The live API returned health 200 and readiness 200 with MongoDB configured, connected, and ready. Request correlation headers were present. Cloudinary and MongoDB configuration were detected without printing their values. SMTP, reCAPTCHA, analytics, and production public URL were not configured.

Earlier accepted real Phase 4 workflows remain the authoritative runtime proof for authentication, refresh rotation, Projects, Services, Technologies, Insights, Testimonials, Team, Content, Settings, Leads, Site Visits, activity, and Cloudinary upload/reference/delete. Phase 6 changed no CMS persistence architecture.

## Browser, responsive, and accessibility QA

Chrome was available. Home, About, Services, Portfolio, Technologies, Insights, Contact, Site Visit, and 404 were swept against the live stack. Titles updated, route content rendered, 404 emitted `noindex`, no failed images were detected, and no horizontal overflow was measured at the inspected desktop viewport.

Automated tests cover mobile navigation and Admin media interactions. Reduced-motion logic and the CSS safeguard remain present. The requested 1440/1280/1024/768/430/390/360 manual matrix, authenticated Admin matrix, Edge, Firefox, and Safari were not fully available and are not claimed.

## SEO QA

Verified in Chrome: route titles, dynamic descriptions, Open Graph/Twitter tags, and 404 noindex. Dynamic detail pages derive metadata from CMS fields; Insight Article and Home WebSite JSON-LD are implemented. Sitemap and robots handlers are tested architecturally, but production-domain URLs and public-root deployment routing cannot be verified until hosting is configured. The SPA remains client-rendered and was not prerendered.

## Forms and CMS QA

Validation tests cover malformed Contact data and historical Site Visit dates. Existing UI tests cover required/client-side behavior, submission state, API errors, and confirmation flows. Public persistence, Admin notes/status, team assignment, scheduling, CMS lifecycles, media workflows, and cleanup were accepted against real services in Phase 4. SMTP notification and CAPTCHA behavior were not tested because neither is configured.

## UAT

The live Home-to-Services-to-Portfolio-to-Technologies-to-About-to-Contact/Site Visit route flow is navigable and visually coherent. However, live CMS content is sparse: About is intentionally empty and there are no representative published project/insight details. A founder cannot yet complete the requested populated case-study presentation. No mock content was added to hide this.

## Deployment verification

SPA rewrite and caching files are included, production source maps are disabled, environment names are documented, and production server startup fails closed without critical configuration. No production deployment, HTTPS, route-refresh test on hosting, canonical domain, or live sitemap/robots routing was possible because targets and credentials were not supplied.

## Launch checklist

Passed:

- Automated tests, lint, builds, and dependency audit
- Backend authentication/authorization protections
- Validation, media limits, rate limits, explicit CORS, security headers
- Request IDs, structured redacted logging, health/readiness
- MongoDB runtime connection and Cloudinary configuration
- No runtime fallback business data
- Chrome public-route regression and 404 behavior
- Backup/recovery procedure documented

Pending external/manual acceptance:

- Production public/Admin/API hosting and HTTPS
- Verified domains, canonical URLs, production CORS and cookie topology
- Public-root sitemap/robots routing
- MongoDB network restriction and backup/PITR confirmation
- Published production content for complete founder/client UAT
- Full viewport, authenticated Admin responsive, and additional-browser matrix
- SMTP notifications, reCAPTCHA, and analytics if SNAAL elects to configure them
- Production console/network and direct-route refresh verification

Only the three permanent Markdown files are maintained.
