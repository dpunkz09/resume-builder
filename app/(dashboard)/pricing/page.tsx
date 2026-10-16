import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getUserPlan } from "@/lib/subscription";
import type { Metadata } from "next";
import { BRAND } from "@/components/landing/brand";

export const metadata: Metadata = {
  title: "Pricing Plans - Choose Your Plan",
  description: `Choose between Free and Pro plans for ${BRAND.name}. Get unlimited resumes, premium templates, AI-powered suggestions, and more with Pro.`,
  openGraph: {
    title: `Pricing Plans | ${BRAND.name}`,
    description: "Affordable pricing for professional resume building. Free plan available.",
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default async function PricingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  // Get user's current subscription
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .limit(1);

  const currentPlan = subscription?.plan || "free";
  const userPlan = await getUserPlan(session.user.id);

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 antialiased">
      <DashboardHeader userName={session.user.name || session.user.email} userPlan={userPlan} />
      
      <main className="mx-auto flex-1 w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex flex-col gap-14">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
              Choose your plan
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Upgrade to Pro for unlimited resumes and premium features.
            </p>
          </div>

          <PricingCards currentPlan={currentPlan} />
        </div>
      </main>
    </div>
  );
}