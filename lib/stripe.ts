import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-09-30.endive",
  typescript: true,
});

// Pricing configuration
export const PRICING = {
  free: {
    name: "Free",
    price: 0,
    resumeLimit: 1,
    templates: ["classic", "ats"], // Only 2 templates for free
    pdfWatermark: true,
    aiFeatures: false,
  },
  pro: {
    name: "Pro",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    resumeLimit: Infinity,
    templates: ["classic", "modern", "minimal", "ats"], // All templates
    pdfWatermark: false,
    aiFeatures: true,
  },
} as const;

// Stripe Price IDs (these need to be created in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  proMonthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || "price_pro_monthly",
  proYearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || "price_pro_yearly",
} as const;
