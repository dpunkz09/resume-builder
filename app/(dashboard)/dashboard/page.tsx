import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResumeList } from "@/components/dashboard/resume-list";
import { getUserResumes } from "@/app/actions/resume-actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getUserPlan } from "@/lib/subscription";
import { PlanInfoBanner } from "@/components/dashboard/plan-info-banner";
import type { Metadata } from "next";
import { BRAND } from "@/components/landing/brand";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Dashboard - ${BRAND.name}`,
  description: "Manage your resumes, view your subscription plan, and access premium features.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [result, userPlan] = await Promise.all([getUserResumes(), getUserPlan(session.user.id)]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 to-white">
      <DashboardHeader userName={session.user.name || session.user.email} userPlan={userPlan} />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="space-y-8 sm:space-y-10">
          {/* Welcome Section */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
              Welcome back, {session.user.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl">
              Create, edit, and manage your professional resumes. Export to PDF when you're ready to apply.
            </p>
          </div>

          <PlanInfoBanner userPlan={userPlan} resumeCount={result.resumes?.length || 0} />

          {result.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {result.error}
            </div>
          ) : (
            <ResumeList initialResumes={result.resumes || []} />
          )}
        </div>
      </main>
    </div>
  );
}