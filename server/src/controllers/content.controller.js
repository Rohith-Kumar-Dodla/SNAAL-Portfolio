import {
  Project,
  Service,
  Technology,
  Article,
  Testimonial,
  SiteContent,
  SiteSettings,
  ContactLead,
  SiteVisitRequest,
  ActivityLog,
  TeamMember,
} from "../models/index.js";
import {
  success,
  asyncHandler,
  pageQuery,
  publicProjection,
  slugify,
} from "../utils/api.js";
import { AppError } from "../utils/AppError.js";
const config = {
  projects: {
    Model: Project,
    sort: { displayOrder: 1, publishedAt: -1 },
    slug: true,
  },
  services: { Model: Service, sort: { displayOrder: 1 }, slug: true },
  technologies: { Model: Technology, sort: { displayOrder: 1 }, slug: true },
  insights: { Model: Article, sort: { publishedAt: -1 }, slug: true },
  testimonials: { Model: Testimonial, sort: { displayOrder: 1 }, slug: false },
  team: { Model: TeamMember, sort: { name: 1 }, slug: false },
};
export const publicList = (kind) =>
  asyncHandler(async (req, res) => {
    const { Model, sort } = config[kind];
    const { page, limit, skip } = pageQuery(req.validated?.query || req.query);
    const q = { status: "published" };
    const query = req.validated?.query || req.query;
    if (query.category) q.category = query.category;
    if (query.featured !== undefined)
      q.featured = String(query.featured) === "true";
    const [data, total] = await Promise.all([
      Model.find(q)
        .select(publicProjection())
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Model.countDocuments(q),
    ]);
    success(res, data, 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });
export const publicFeatured = (kind) =>
  asyncHandler(async (req, res) => {
    const { Model, sort } = config[kind];
    const data = await Model.find({ status: "published", featured: true })
      .select(publicProjection())
      .sort(sort)
      .limit(12)
      .lean();
    success(res, data);
  });
export const publicDetail = (kind) =>
  asyncHandler(async (req, res) => {
    const { Model } = config[kind];
    const data = await Model.findOne({
      slug: req.validated.params.slug,
      status: "published",
    })
      .select(publicProjection())
      .lean();
    if (!data) throw new AppError("Content not found", 404, "NOT_FOUND");
    success(res, data);
  });
export const publicSiteContent = asyncHandler(async (_req, res) =>
  success(
    res,
    await SiteContent.find({ status: "published" })
      .select("key sections updatedAt")
      .lean(),
  ),
);
export const publicSiteSettings = asyncHandler(async (_req, res) =>
  success(
    res,
    (await SiteSettings.findOne({ key: "public" })
      .select(
        "companyName publicEmail publicPhone businessHours socialLinks legalLinks defaultSeo logo updatedAt",
      )
      .lean()) || {},
  ),
);
export const submitContact = asyncHandler(async (req, res) => {
  const lead = await ContactLead.create(req.validated.body);
  success(
    res,
    { id: lead.id, message: "Thank you. Your message has been received." },
    201,
  );
});
export const submitVisit = asyncHandler(async (req, res) => {
  const visit = await SiteVisitRequest.create(req.validated.body);
  success(
    res,
    {
      id: visit.id,
      message:
        "Your site visit request has been received. Our team will review the request and contact you to confirm the schedule.",
    },
    201,
  );
});
const prepare = (kind, body) => {
  const next = { ...body };
  if (config[kind]?.slug && body.name && !body.slug)
    next.slug = slugify(body.name);
  if (kind === "insights" && body.title && !body.slug)
    next.slug = slugify(body.title);
  if (next.status === "published" && !next.publishedAt)
    next.publishedAt = new Date();
  return next;
};
const log = (req, action, entityType, entityId) =>
  ActivityLog.create({
    actor: req.user.sub,
    action,
    entityType,
    entityId,
    ip: req.ip,
  }).catch(() => {});
export const adminList = (kind) =>
  asyncHandler(async (req, res) => {
    const { Model } = config[kind];
    const { page, limit, skip } = pageQuery(req.validated?.query || req.query);
    const q = {};
    const query = req.validated?.query || req.query;
    if (query.status) q.status = query.status;
    if (query.category) q.category = query.category;
    const [data, total] = await Promise.all([
      Model.find(q).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Model.countDocuments(q),
    ]);
    success(res, data, 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });
export const adminGet = (kind) =>
  asyncHandler(async (req, res) => {
    const data = await config[kind].Model.findById(
      req.validated.params.id,
    ).lean();
    if (!data) throw new AppError("Record not found", 404, "NOT_FOUND");
    success(res, data);
  });
export const adminCreate = (kind) =>
  asyncHandler(async (req, res) => {
    const data = await config[kind].Model.create(
      prepare(kind, req.validated.body),
    );
    await log(req, `${kind}.created`, kind, data._id);
    success(res, data, 201);
  });
export const adminUpdate = (kind) =>
  asyncHandler(async (req, res) => {
    const data = await config[kind].Model.findByIdAndUpdate(
      req.validated.params.id,
      prepare(kind, req.validated.body),
      { new: true, runValidators: true },
    );
    if (!data) throw new AppError("Record not found", 404, "NOT_FOUND");
    await log(req, `${kind}.updated`, kind, data._id);
    success(res, data);
  });
export const adminArchive = (kind) =>
  asyncHandler(async (req, res) => {
    const data = await config[kind].Model.findByIdAndUpdate(
      req.validated.params.id,
      { status: kind === "team" ? "inactive" : "archived" },
      { new: true },
    );
    if (!data) throw new AppError("Record not found", 404, "NOT_FOUND");
    await log(req, `${kind}.archived`, kind, data._id);
    success(res, { id: data.id, status: data.status });
  });
export const adminSubmissions = (Model) =>
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = pageQuery(req.validated?.query || req.query);
    const q = req.query.status ? { status: req.query.status } : {};
    const [data, total] = await Promise.all([
      Model.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Model.countDocuments(q),
    ]);
    success(res, data, 200, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  });
