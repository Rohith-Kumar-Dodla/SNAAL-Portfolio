import { z } from "zod";
const text = (min, max) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .transform((v) => v.replace(/[<>]/g, ""));
const optionalText = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v.replace(/[<>]/g, ""))
    .optional()
    .or(z.literal(""));
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(160);
const url = z.string().url().max(1000).optional().or(z.literal(""));
const status = z.enum(["draft", "published", "archived"]);
const objectId = z.string().regex(/^[a-f\d]{24}$/i);
const mediaRef = z.object({media:objectId.optional(),url:url,alt:optionalText(180)}).strict().optional();
const seo = z
  .object({ title: optionalText(70), description: optionalText(170) })
  .optional();
export const listSchema = z.object({
  body: z.any().optional(),
  params: z.object({}).passthrough(),
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
      category: optionalText(80),
      featured: z.enum(["true", "false"]).optional(),
      status: z.enum(["draft", "published", "archived", "active", "inactive"]).optional(),
      folder: optionalText(120),
      type: optionalText(40),
      date: optionalText(30),
    })
    .strict(),
});
export const slugSchema = z.object({
  body: z.any().optional(),
  params: z.object({ slug }),
  query: z.object({}).passthrough(),
});
export const idSchema = z.object({
  body: z.any().optional(),
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  query: z.object({}).passthrough(),
});
const contentBase = {
  slug: slug.optional(),
  status: status.optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).max(100000).optional(),
  seo,
};
export const projectBody = z
  .object({
    name: text(2, 120),
    shortDescription: text(10, 320),
    description: optionalText(1500),
    category: text(2, 80),
    categories: z.array(text(1, 80)).max(20).optional(),
    type: optionalText(80),
    year: optionalText(40),
    thumbnail: mediaRef,
    heroImage: mediaRef,
    gallery: z.array(mediaRef.unwrap()).max(30).optional(),
    challenge: optionalText(5000),
    approach: optionalText(5000),
    solution: optionalText(5000),
    features: z.array(text(1, 300)).max(30).optional(),
    technologies: z.array(text(1, 100)).max(30).optional(),
    architecture: optionalText(5000),
    developmentProcess: optionalText(5000),
    results: z.array(text(1, 500)).max(30).optional(),
    liveUrl: url,
    repositoryUrl: url,
    tone: optionalText(30),
    publishedAt: z.coerce.date().optional(),
    ...contentBase,
  })
  .strict();
export const serviceBody = z
  .object({
    name: text(2, 120),
    summary: text(10, 320),
    description: optionalText(5000),
    icon: optionalText(80),
    visual: optionalText(80),
    accent: optionalText(30),
    capabilities: z.array(text(1, 300)).max(30).optional(),
    technologies: z.array(text(1, 100)).max(30).optional(),
    problems: z.array(text(1, 500)).max(30).optional(),
    process: z.array(text(1, 500)).max(30).optional(),
    relatedProjects: z.array(objectId).max(30).optional(),
    publishedAt: z.coerce.date().optional(),
    ...contentBase,
  })
  .strict();
export const technologyBody = z
  .object({
    name: text(1, 80),
    slug: slug.optional(),
    category: z.enum([
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
    ]),
    description: optionalText(500),
    logo: mediaRef,
    websiteUrl: url,
    ...contentBase,
  })
  .strict();
export const articleBody = z
  .object({
    title: text(3, 180),
    excerpt: text(10, 400),
    category: text(2, 80),
    author: text(2, 120),
    coverImage: mediaRef,
    content: z
      .array(
        z.object({
          heading: text(2, 180),
          paragraphs: z.array(text(1, 5000)).min(1).max(20),
        }),
      )
      .min(1)
      .max(50),
    readingTime: z.number().int().min(1).max(120),
    tone: optionalText(30),
    publishedAt: z.coerce.date().optional(),
    ...contentBase,
  })
  .strict();
export const testimonialBody = z
  .object({
    clientName: text(2, 120),
    clientRole: optionalText(120),
    company: optionalText(160),
    quote: text(10, 2000),
    photo: mediaRef,
    companyLogo: mediaRef,
    project: objectId.optional().or(z.literal("")),
    status: status.optional(),
    featured: z.boolean().optional(),
    displayOrder: z.number().int().min(0).optional(),
  })
  .strict();
export const teamBody = z
  .object({
    name: text(2, 120),
    designation: text(2, 120),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: optionalText(30),
    profileImage: mediaRef,
    status: z.enum(["active", "inactive"]).optional(),
  })
  .strict();
export const contactBody = z
  .object({
    name: text(2, 120),
    company: optionalText(160),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: optionalText(30),
    service: optionalText(120),
    message: text(10, 5000),
  })
  .strict();
export const visitBody = z
  .object({
    name: text(2, 120),
    company: text(2, 160),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: text(6, 30),
    companyAddress: text(5, 500),
    city: text(2, 100),
    state: text(2, 100),
    pinCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/),
    service: text(2, 120),
    projectDescription: text(10, 5000),
    preferredVisitDate: z.coerce
      .date()
      .refine(
        (d) => d >= new Date(new Date().toDateString()),
        "Preferred date cannot be in the past",
      ),
    preferredTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    expectedAttendees: z.coerce.number().int().min(1).max(100).optional(),
    additionalNotes: optionalText(3000),
  })
  .strict();
export const authLoginBody = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).max(128),
  })
  .strict();
export const wrapBody = (schema) =>
  z.object({
    body: schema,
    params: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
  });
export const wrapPatch = (schema) =>
  z.object({
    body: schema
      .partial()
      .refine(
        (v) => Object.keys(v).length > 0,
        "At least one field is required",
      ),
    params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
    query: z.object({}).passthrough(),
  });
