import { Router } from "express";
import { databaseStatus } from "../config/database.js";
import { env } from "../config/env.js";
import { Project, Service, Article } from "../models/index.js";
import { asyncHandler } from "../utils/api.js";

const router = Router();
router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.get("/ready", (_req, res) => {
  const database = databaseStatus();
  const ready = !database.configured || database.ready;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "not_ready", checks: { database } });
});
router.get("/sitemap.xml", asyncHandler(async (_req, res) => {
  if (!env.PUBLIC_URL) return res.status(503).type("text/plain").send("Production public URL is not configured.");
  const [projects, services, insights] = await Promise.all([
    Project.find({ status: "published" }).select("slug updatedAt").lean(),
    Service.find({ status: "published" }).select("slug updatedAt").lean(),
    Article.find({ status: "published" }).select("slug updatedAt").lean(),
  ]);
  const base = env.PUBLIC_URL.replace(/\/$/, "");
  const staticPaths = ["/", "/about", "/services", "/portfolio", "/technologies", "/insights", "/contact", "/book-site-visit"];
  const dynamic = [
    ...services.map((item) => [`/services/${item.slug}`, item.updatedAt]),
    ...projects.map((item) => [`/portfolio/${item.slug}`, item.updatedAt]),
    ...insights.map((item) => [`/insights/${item.slug}`, item.updatedAt]),
  ];
  const entries = [
    ...staticPaths.map((path) => [path]),
    ...dynamic,
  ].map(([path, date]) => `<url><loc>${base}${path}</loc>${date ? `<lastmod>${new Date(date).toISOString()}</lastmod>` : ""}</url>`).join("");
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600").type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`);
}));
router.get("/robots.txt", (_req, res) => {
  if (!env.PUBLIC_URL) return res.type("text/plain").send("User-agent: *\nDisallow: /");
  res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/v1/admin\nSitemap: ${env.PUBLIC_URL.replace(/\/$/, "")}/api/v1/sitemap.xml\n`);
});
export default router;
