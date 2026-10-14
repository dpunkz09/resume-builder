import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResumeList } from "@/components/dashboard/resume-list";
import { getUserResumes } from "@/app/actions/resume-actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const result = await getUserResumes();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={session.user.name || session.user.email} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {result.error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{result.error}</p>
          </div>
        ) : (
          <ResumeList initialResumes={result.resumes || []} />
        )}
      </main>
    </div>
  );
}
