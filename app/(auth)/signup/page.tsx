import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { BRAND } from "@/components/landing/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Create Your Free Account",
  description: `Create a free account on ${BRAND.name} and start building your professional resume today. No credit card required.`,
  openGraph: {
    title: `Sign Up | ${BRAND.name}`,
    description: "Create your free account and build professional resumes in minutes.",
  },
  alternates: {
    canonical: "/signup",
  },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 antialiased">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
        <Link
          href="/"
          className={`rounded-md text-lg font-semibold tracking-tight text-zinc-900 ${focusRing}`}
        >
          {BRAND.name}
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-24">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Create an account
          </h1>
          <p className="mt-2 text-zinc-600">Start building your professional resume today.</p>

          <div className="mt-8">
            <SignupForm />
          </div>

          <p className="mt-8 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className={`rounded-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-indigo-700 ${focusRing}`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}