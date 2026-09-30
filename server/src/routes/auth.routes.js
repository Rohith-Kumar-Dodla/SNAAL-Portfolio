import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { validate } from "../middleware/validate.js";
import { wrapBody, authLoginBody } from "../validators/schemas.js";
import { requireAuth } from "../middleware/auth.js";
import { login, refresh, logout, me } from "../controllers/auth.controller.js";
const router = Router();
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
});
router.post("/login", loginLimit, validate(wrapBody(authLoginBody)), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
export default router;
