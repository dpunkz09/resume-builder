import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import Link from "next/link";
import { BRAND } from "@/components/landing/brand";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: `Verify your email address to complete your ${BRAND.name} account registration and start building resumes.`,
  robots: {
    index: false,
    follow: false,
  },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export default function VerifyEmailPage() {
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
            Verify your email
          </h1>
          <p className="mt-2 text-zinc-600">
            We sent a verification code to your email address.
          </p>

          <div className="mt-8">
            <Suspense fallback={<div>Loading...</div>}>
              <VerifyEmailForm />
            </Suspense>
          </div>

          <p className="mt-8 text-sm text-zinc-600">
            Didn't receive the code?{" "}
            <Link
              href="/signup"
              className={`rounded-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-indigo-700 ${focusRing}`}
            >
              Try again
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
