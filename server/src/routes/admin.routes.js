import { Router } from "express";
import multer from "multer";
import { requireAuth, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  idSchema,
  listSchema,
  projectBody,
  serviceBody,
  technologyBody,
  articleBody,
  testimonialBody,
  teamBody,
  wrapBody,
  wrapPatch,
} from "../validators/schemas.js";
import {
  adminList,
  adminGet,
  adminCreate,
  adminUpdate,
  adminArchive,
  adminSubmissions,
} from "../controllers/content.controller.js";
import {
  ContactLead,
  SiteVisitRequest,
  SiteContent,
  SiteSettings,
  Project,
  Service,
  Technology,
  Article,
  Media,
  ActivityLog,
} from "../models/index.js";
import { success, asyncHandler } from "../utils/api.js";
import {
  upload,
  list as mediaList,
  remove as mediaRemove,
} from "../controllers/media.controller.js";
const router = Router();
const pick = (source, allowed) => Object.fromEntries(allowed.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));
router.use(requireAuth, authorize("super_admin", "admin"));
const resources = {
  projects: projectBody,
  services: serviceBody,
  technologies: technologyBody,
  insights: articleBody,
  testimonials: testimonialBody,
  team: teamBody,
};
for (const [kind, schema] of Object.entries(resources)) {
  router.post(`/${kind}`, validate(wrapBody(schema)), adminCreate(kind));
  router.get(`/${kind}`, validate(listSchema), adminList(kind));
  router.get(`/${kind}/:id`, validate(idSchema), adminGet(kind));
  router.patch(`/${kind}/:id`, validate(wrapPatch(schema)), adminUpdate(kind));
  router.delete(`/${kind}/:id`, validate(idSchema), adminArchive(kind));
}
router.get(
  "/contact-leads",
  validate(listSchema),
  adminSubmissions(ContactLead),
);
router.get("/dashboard", asyncHandler(async (_req, res) => {
  const [projects,publishedProjects,draftProjects,services,technologies,publishedInsights,newLeads,activeVisits,mediaAssets,recentLeads,recentVisits,recentActivity]=await Promise.all([
    Project.countDocuments(),Project.countDocuments({status:"published"}),Project.countDocuments({status:"draft"}),Service.countDocuments(),Technology.countDocuments(),Article.countDocuments({status:"published"}),ContactLead.countDocuments({status:"new"}),SiteVisitRequest.countDocuments({status:{$in:["new","reviewing","scheduled"]}}),Media.countDocuments(),ContactLead.find().sort({createdAt:-1}).limit(5).lean(),SiteVisitRequest.find().sort({createdAt:-1}).limit(5).lean(),ActivityLog.find().sort({createdAt:-1}).limit(10).populate("actor","name email").lean()
  ]);success(res,{metrics:{projects,publishedProjects,draftProjects,services,technologies,publishedInsights,newLeads,activeVisits,mediaAssets},recentLeads,recentVisits,recentActivity});
}));
router.get("/activity", asyncHandler(async (_req,res)=>success(res,await ActivityLog.find().sort({createdAt:-1}).limit(100).populate("actor","name email").lean())));
router.get(
  "/site-visits",
  validate(listSchema),
  adminSubmissions(SiteVisitRequest),
);
router.patch(
  "/contact-leads/:id",
  validate(idSchema),
  asyncHandler(async (req, res) =>
    success(
      res,
      await ContactLead.findByIdAndUpdate(req.params.id, pick(req.body, ["status", "internalNotes"]), {
        new: true,
        runValidators: true,
      }),
    ),
  ),
);
router.patch(
  "/site-visits/:id",
  validate(idSchema),
  asyncHandler(async (req, res) =>
    success(
      res,
      await SiteVisitRequest.findByIdAndUpdate(req.params.id, pick(req.body, ["status", "assignedTeamMembers", "scheduledDate", "scheduledTime", "internalNotes"]), {
        new: true,
        runValidators: true,
      }),
    ),
  ),
);
router.put(
  "/site-content/:key",
  asyncHandler(async (req, res) =>
    success(
      res,
      await SiteContent.findOneAndUpdate(
        { key: req.params.key },
        { sections: req.body.sections, status: req.body.status || "draft" },
        { upsert: true, new: true, runValidators: true },
      ),
    ),
  ),
);
router.put(
  "/site-settings",
  asyncHandler(async (req, res) =>
    success(
      res,
      await SiteSettings.findOneAndUpdate(
        { key: "public" },
        { $set: { ...pick(req.body, ["companyName", "publicEmail", "publicPhone", "businessHours", "socialLinks", "legalLinks", "defaultSeo", "logo"]), key: "public" } },
        { upsert: true, new: true, runValidators: true },
      ),
    ),
  ),
);
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    cb(
      null,
      [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ].includes(file.mimetype),
    );
  },
}).single("file");
router.post("/media", uploadMiddleware, upload);
router.get("/media", mediaList);
router.patch("/media/:id", validate(idSchema), asyncHandler(async(req,res)=>success(res,await Media.findByIdAndUpdate(req.params.id,pick(req.body,["alt","caption"]),{new:true,runValidators:true}))));
router.delete("/media/:id", mediaRemove);
export default router;
