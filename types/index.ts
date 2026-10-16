import { z } from "zod";

// Resume content schemas
export const LinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  platform: z.string().optional(),
});

export const BasicsSchema = z.object({
  fullName: z.string().default(""),
  headline: z.string().default(""),
  email: z.string().email().or(z.literal("")).default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  website: z.string().url().or(z.literal("")).default(""),
  links: z.array(LinkSchema).default([]),
  photo: z.string().optional(), // Base64 or URL
});

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

export const SkillItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  skills: z.array(z.string()),
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const CertificationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string().url().optional(),
  expiryDate: z.string().optional(),
});

export const LanguageItemSchema = z.object({
  id: z.string(),
  language: z.string(),
  proficiency: z.string(), // e.g., "Native", "Fluent", "Professional", "Basic"
});

export const ReferenceItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(),
});

export const CustomItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "references",
    "custom",
  ]),
  title: z.string(),
  visible: z.boolean().default(true),
  items: z.array(z.any()), // Specific type depends on section type
});

export const ResumeContentSchema = z.object({
  basics: BasicsSchema,
  summary: z.string().default(""),
  sections: z.array(SectionSchema).default([]),
});

export const ThemeSchema = z.object({
  color: z.string().default("#0066cc"),
  font: z.enum(["inter", "roboto", "arial", "times"]).default("inter"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  spacing: z.enum(["compact", "normal", "relaxed"]).default("normal"),
  margins: z.enum(["narrow", "normal", "wide"]).default("normal"),
  pageSize: z.enum(["a4", "letter", "folio"]).default("a4"),
});

// Infer types from schemas
export type Link = z.infer<typeof LinkSchema>;
export type Basics = z.infer<typeof BasicsSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type SkillItem = z.infer<typeof SkillItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type ReferenceItem = z.infer<typeof ReferenceItemSchema>;
export type CustomItem = z.infer<typeof CustomItemSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type ResumeContent = z.infer<typeof ResumeContentSchema>;
export type Theme = z.infer<typeof ThemeSchema>;

// Plan types
export type Plan = "free" | "pro";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "incomplete";
