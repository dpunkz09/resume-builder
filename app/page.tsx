import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import type { Metadata } from "next";
import { BRAND } from "@/components/landing/brand";

// Mark this route as dynamic to prevent prerendering
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${BRAND.name} - Create Professional ATS-Friendly Resumes Online`,
  description: `Build your perfect resume with ${BRAND.name}. Choose from professional templates, customize with AI-powered suggestions, and export to PDF or DOCX. Free and Pro plans available.`,
  openGraph: {
    title: `${BRAND.name} - Professional Resume Builder`,
    description: "Create ATS-friendly resumes with AI assistance. Multiple templates, real-time preview, PDF/DOCX export.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If logged in, go to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Show landing page for visitors
  return <LandingPage />;
}
