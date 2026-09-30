import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import {
  Project,
  Service,
  Technology,
  Article,
  ContactLead,
  SiteVisitRequest,
  Media,
  Admin,
} from "../src/models/index.js";
const app = createApp();
describe("system endpoints", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
  it("reports database readiness without exposing configuration", async () => {
    const response = await request(app).get("/api/v1/ready");
    expect([200, 503]).toContain(response.status);
    expect(["ready", "not_ready"]).toContain(response.body.status);
    expect(response.body.checks.database).not.toHaveProperty("uri");
  });
  it("returns structured 404 errors", async () => {
    const response = await request(app).get("/api/v1/missing");
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
  it("sets security headers", async () => {
    const response = await request(app).get("/api/v1/health");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
  it("adds and preserves safe request correlation IDs", async () => {
    const generated = await request(app).get("/api/v1/health");
    expect(generated.headers["x-request-id"]).toMatch(/^[a-f0-9-]{36}$/);
    const supplied = await request(app).get("/api/v1/health").set("X-Request-Id", "phase6-request-123");
    expect(supplied.headers["x-request-id"]).toBe("phase6-request-123");
  });
  it("rejects unexpected credentialed origins", async () => {
    const response = await request(app).get("/api/v1/health").set("Origin", "https://attacker.example");
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("CORS_REJECTED");
  });
  it("allows loopback Vite origins during local development", async () => {
    const response = await request(app).get("/api/v1/health").set("Origin", "http://localhost:5176");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5176");
  });
  it("keeps crawlers out when a production origin is not configured", async () => {
    const response = await request(app).get("/api/v1/robots.txt");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Disallow: /");
  });
});
describe("validation and protection", () => {
  it("rejects an invalid contact submission before persistence", async () => {
    const response = await request(app)
      .post("/api/v1/contact")
      .send({ name: "A", email: "bad", message: "short" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
  it("rejects a historical site visit", async () => {
    const response = await request(app)
      .post("/api/v1/site-visits")
      .send({
        name: "Test User",
        company: "Test Company",
        email: "test@example.test",
        phone: "9999999999",
        companyAddress: "Test address",
        city: "Bengaluru",
        state: "Karnataka",
        pinCode: "560001",
        service: "web",
        projectDescription: "A controlled test request",
        preferredVisitDate: "2020-01-01",
        preferredTime: "10:00",
      });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
  it("rejects unsafe pagination", async () => {
    const response = await request(app).get("/api/v1/projects?limit=5000");
    expect(response.status).toBe(400);
  });
  it("protects CMS APIs", async () => {
    const response = await request(app).get("/api/v1/admin/projects");
    expect(response.status).toBe(401);
  });
  it("protects media uploads", async () => {
    const response = await request(app).post("/api/v1/admin/media");
    expect(response.status).toBe(401);
  });
  it("validates login bodies", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "bad", password: "short" });
    expect(response.status).toBe(400);
  });
  it("requires an authenticated session for auth/me", async () => {
    const response = await request(app).get("/api/v1/auth/me");
    expect(response.status).toBe(401);
  });
});
describe("model integrity", () => {
  it("registers the required core models", () => {
    expect(
      [
        Project,
        Service,
        Technology,
        Article,
        ContactLead,
        SiteVisitRequest,
        Media,
        Admin,
      ].every((Model) => Model.modelName),
    ).toBe(true);
  });
  it("enforces project lifecycle and slug requirements", () => {
    const item = new Project({
      name: "Test",
      shortDescription: "A sufficiently long summary",
      category: "Test",
      status: "invalid",
    });
    const error = item.validateSync();
    expect(error.errors.slug).toBeTruthy();
    expect(error.errors.status).toBeTruthy();
  });
  it("does not include Admin password hashes by default", () => {
    expect(Admin.schema.path("passwordHash").options.select).toBe(false);
  });
});
