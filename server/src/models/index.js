import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
const lifecycle = ["draft", "published", "archived"];
const seoSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 70 },
    description: { type: String, trim: true, maxlength: 170 },
  },
  { _id: false },
);
const mediaRefSchema = new Schema(
  {
    media: { type: Schema.Types.ObjectId, ref: "Media" },
    url: { type: String, trim: true },
    alt: { type: String, trim: true, maxlength: 180 },
  },
  { _id: false },
);
const common = {
  status: { type: String, enum: lifecycle, default: "draft", index: true },
  featured: { type: Boolean, default: false, index: true },
  displayOrder: { type: Number, default: 0, index: true },
  seo: seoSchema,
  publishedAt: Date,
};
const cleanJson = {
  virtuals: false,
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
};
const register = (name, schema) => models[name] || model(name, schema);

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 320,
    },
    description: { type: String, trim: true, maxlength: 1500 },
    category: { type: String, required: true, trim: true, index: true },
    categories: [{ type: String, trim: true }],
    type: { type: String, trim: true },
    year: { type: String, trim: true },
    ...common,
    heroImage: mediaRefSchema,
    thumbnail: mediaRefSchema,
    gallery: [mediaRefSchema],
    overview: String,
    challenge: String,
    approach: String,
    solution: String,
    features: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    architecture: String,
    developmentProcess: String,
    results: [{ type: String, trim: true }],
    liveUrl: String,
    repositoryUrl: String,
    tone: { type: String, default: "blue" },
  },
  { timestamps: true, toJSON: cleanJson },
);
projectSchema.index({ status: 1, displayOrder: 1, publishedAt: -1 });
projectSchema.index({ status: 1, featured: 1, displayOrder: 1 });
projectSchema.index({ status: 1, category: 1 });
export const Project = register("Project", projectSchema);

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    summary: { type: String, required: true, trim: true, maxlength: 320 },
    description: String,
    icon: String,
    visual: String,
    accent: { type: String, default: "blue" },
    capabilities: [String],
    technologies: [String],
    problems: [String],
    process: [String],
    relatedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    ...common,
  },
  { timestamps: true, toJSON: cleanJson },
);
serviceSchema.index({ status: 1, displayOrder: 1 });
export const Service = register("Service", serviceSchema);

const technologySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "frontend",
        "backend",
        "mobile",
        "database",
        "cloud",
        "devops",
        "data",
        "ai",
        "automation",
        "other",
      ],
      index: true,
    },
    description: { type: String, trim: true, maxlength: 500 },
    logo: mediaRefSchema,
    websiteUrl: String,
    ...common,
  },
  { timestamps: true, toJSON: cleanJson },
);
technologySchema.index({ status: 1, category: 1, displayOrder: 1 });
export const Technology = register("Technology", technologySchema);

const contentBlockSchema = new Schema(
  {
    heading: { type: String, required: true, trim: true, maxlength: 180 },
    paragraphs: [{ type: String, trim: true, maxlength: 5000 }],
  },
  { _id: false },
);
const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    excerpt: { type: String, required: true, trim: true, maxlength: 400 },
    coverImage: mediaRefSchema,
    category: { type: String, required: true, trim: true, index: true },
    author: { type: String, required: true, trim: true },
    content: [contentBlockSchema],
    ...common,
    readingTime: { type: Number, min: 1, max: 120 },
    tone: { type: String, default: "blue" },
  },
  { timestamps: true, toJSON: cleanJson },
);
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ status: 1, featured: 1, publishedAt: -1 });
export const Article = register("Article", articleSchema);

const testimonialSchema = new Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientRole: String,
    company: String,
    quote: { type: String, required: true, trim: true, maxlength: 2000 },
    photo: mediaRefSchema,
    companyLogo: mediaRefSchema,
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    ...common,
  },
  { timestamps: true, toJSON: cleanJson },
);
testimonialSchema.index({ status: 1, displayOrder: 1 });
export const Testimonial = register("Testimonial", testimonialSchema);

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, trim: true, maxlength: 160 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true, maxlength: 30 },
    service: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "discussion",
        "proposal",
        "won",
        "closed",
        "spam",
      ],
      default: "new",
      index: true,
    },
    source: { type: String, default: "website" },
    internalNotes: { type: String, maxlength: 5000 },
  },
  { timestamps: true, toJSON: cleanJson },
);
contactSchema.index({ status: 1, createdAt: -1 });
export const ContactLead = register("ContactLead", contactSchema);

const visitSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    companyAddress: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    projectDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    preferredVisitDate: { type: Date, required: true, index: true },
    preferredTime: { type: String, required: true },
    expectedAttendees: { type: Number, min: 1, max: 100 },
    additionalNotes: { type: String, maxlength: 3000 },
    status: {
      type: String,
      enum: ["new", "reviewing", "scheduled", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    assignedTeamMembers: [{ type: Schema.Types.ObjectId, ref: "TeamMember" }],
    scheduledDate: Date,
    scheduledTime: String,
    internalNotes: { type: String, maxlength: 5000 },
  },
  { timestamps: true, toJSON: cleanJson },
);
visitSchema.index({ status: 1, createdAt: -1 });
export const SiteVisitRequest = register("SiteVisitRequest", visitSchema);

const mediaSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    resourceType: { type: String, default: "image" },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    url: String,
    secureUrl: { type: String, required: true },
    alt: { type: String, trim: true, maxlength: 180 },
    caption: { type: String, trim: true, maxlength: 500 },
    folder: { type: String, required: true, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true, toJSON: cleanJson },
);
export const Media = register("Media", mediaSchema);

const siteContentSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    sections: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: lifecycle, default: "draft", index: true },
  },
  { timestamps: true, toJSON: cleanJson },
);
export const SiteContent = register("SiteContent", siteContentSchema);
const siteSettingsSchema = new Schema(
  {
    key: { type: String, default: "public", unique: true },
    companyName: String,
    publicEmail: String,
    publicPhone: String,
    businessHours: String,
    socialLinks: { type: Map, of: String },
    legalLinks: { type: Map, of: String },
    defaultSeo: seoSchema,
    logo: mediaRefSchema,
  },
  { timestamps: true, toJSON: cleanJson },
);
export const SiteSettings = register("SiteSettings", siteSettingsSchema);

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["super_admin", "admin"], default: "admin" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    refreshTokenHash: { type: String, select: false },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.refreshTokenHash;
        delete ret.__v;
        return ret;
      },
    },
  },
);
export const Admin = register("Admin", adminSchema);
const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    designation: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, maxlength: 30 },
    profileImage: mediaRefSchema,
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
  },
  { timestamps: true, toJSON: cleanJson },
);
export const TeamMember = register("TeamMember", teamSchema);
const activitySchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "Admin", index: true },
    action: { type: String, required: true, index: true },
    entityType: String,
    entityId: Schema.Types.ObjectId,
    summary: String,
    ip: String,
  },
  { timestamps: true, toJSON: cleanJson },
);
activitySchema.index({ createdAt: -1 });
export const ActivityLog = register("ActivityLog", activitySchema);
