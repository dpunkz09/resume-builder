import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { BRAND } from "@/components/landing/brand";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Access Your Account",
  description: `Sign in to your ${BRAND.name} account to access your resumes, edit templates, and manage your subscription.`,
  openGraph: {
    title: `Sign In | ${BRAND.name}`,
    description: "Access your resume builder account.",
  },
  alternates: {
    canonical: "/login",
  },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

function LoginContent() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Welcome back
      </h1>
      <p className="mt-2 text-zinc-600">Sign in to your account to continue.</p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-8 text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className={`rounded-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-indigo-700 ${focusRing}`}
        >
          Sign up
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
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
          <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}