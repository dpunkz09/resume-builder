import { ClassicTemplate } from "@/components/templates/classic-template";
import { ModernTemplate } from "@/components/templates/modern-template";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { ATSTemplate } from "@/components/templates/ats-template";
import { ProfessionalTemplate } from "@/components/templates/professional-template";
import { ExecutiveTemplate } from "@/components/templates/executive-template";
import { WhiteClean } from "@/components/templates/white-clean-template";
import { CorporateTemplate } from "@/components/templates/corporate-template";
import { ClassicBandsTemplate } from "@/components/templates/classic-bands-template";
import { ResumeContent, Theme } from "@/types";
import { ReactElement } from "react";

export type TemplateId = "classic" | "modern" | "minimal" | "ats" | "professional" | "executive" | "white-clean" | "corporate" | "classic-bands";

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  component: (props: { content: ResumeContent; theme: Theme }) => ReactElement;
  preview: string; // Preview image path
  isPro?: boolean; // Whether template requires Pro plan
};

export const templates: Record<TemplateId, Template> = {
  professional: {
    id: "professional",
    name: "Professional",
    description: "Clean single-column layout with bold headers and horizontal line",
    component: ProfessionalTemplate,
    preview: "/templates/professional-preview.png",
    isPro: false,
  },
  executive: {
    id: "executive",
    name: "Executive",
    description: "Two-column layout with photo sidebar and professional content area",
    component: ExecutiveTemplate,
    preview: "/templates/executive-preview.png",
    isPro: false,
  },
  "white-clean": {
    id: "white-clean",
    name: "White Clean",
    description: "Modern two-column design with colored sidebar and elegant typography",
    component: WhiteClean,
    preview: "/templates/white-clean-preview.png",
    isPro: false,
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Professional full-bleed design with light sidebar, navy banner, and timeline",
    component: CorporateTemplate,
    preview: "/templates/corporate-preview.png",
    isPro: true,
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout with clear section headers",
    component: ClassicTemplate,
    preview: "/templates/classic-preview.png",
    isPro: false,
  },
  "classic-bands": {
    id: "classic-bands",
    name: "Classic Bands",
    description: "Centered header with full-width colored bands for section titles",
    component: ClassicBandsTemplate,
    preview: "/templates/classic-bands-preview.png",
    isPro: true,
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Bold header with colored background and clean formatting",
    component: ModernTemplate,
    preview: "/templates/modern-preview.png",
    isPro: true, // Pro only
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Elegant centered design with subtle styling",
    component: MinimalTemplate,
    preview: "/templates/minimal-preview.png",
    isPro: true, // Pro only
  },
  ats: {
    id: "ats",
    name: "ATS Friendly",
    description: "Plain text format optimized for applicant tracking systems",
    component: ATSTemplate,
    preview: "/templates/ats-preview.png",
    isPro: false,
  },
};

export const getTemplate = (templateId: string): Template => {
  const template = templates[templateId as TemplateId];
  return template || templates.classic;
};

export const getTemplateComponent = (templateId: string) => {
  return getTemplate(templateId).component;
};

export const getAvailableTemplates = (isPro: boolean): Template[] => {
  return Object.values(templates).filter((t) => !t.isPro || isPro);
};
