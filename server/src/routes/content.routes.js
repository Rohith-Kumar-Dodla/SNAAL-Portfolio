import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { validate } from "../middleware/validate.js";
import {
  listSchema,
  slugSchema,
  contactBody,
  visitBody,
  wrapBody,
} from "../validators/schemas.js";
import {
  publicList,
  publicFeatured,
  publicDetail,
  publicSiteContent,
  publicSiteSettings,
  submitContact,
  submitVisit,
} from "../controllers/content.controller.js";
const router = Router();
const submitLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
});
router.get("/projects", validate(listSchema), publicList("projects"));
router.get("/projects/featured", publicFeatured("projects"));
router.get("/projects/:slug", validate(slugSchema), publicDetail("projects"));
router.get("/services", validate(listSchema), publicList("services"));
router.get("/services/:slug", validate(slugSchema), publicDetail("services"));
router.get("/technologies", validate(listSchema), publicList("technologies"));
router.get("/insights", validate(listSchema), publicList("insights"));
router.get("/insights/featured", publicFeatured("insights"));
router.get("/insights/:slug", validate(slugSchema), publicDetail("insights"));
router.get("/testimonials", validate(listSchema), publicList("testimonials"));
router.get("/site-content", publicSiteContent);
router.get("/site-settings", publicSiteSettings);
router.post(
  "/contact",
  submitLimit,
  validate(wrapBody(contactBody)),
  submitContact,
);
router.post(
  "/site-visits",
  submitLimit,
  validate(wrapBody(visitBody)),
  submitVisit,
);
export default router;
