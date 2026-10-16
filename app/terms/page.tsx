import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/components/landing/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Usage Terms and Conditions",
  description: `Read ${BRAND.name}'s terms of service to understand your rights and responsibilities when using our resume builder platform.`,
  openGraph: {
    title: `Terms of Service | ${BRAND.name}`,
    description: "Terms and conditions for using our resume building platform.",
  },
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Set this to the date the terms text was last changed.
// (The old page used new Date(), which always showed today's date.)
const LAST_UPDATED = "October 15, 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Acceptance of terms",
    body: (
      <p>
        By accessing and using {BRAND.name}, you accept and agree to be bound by the terms and
        provision of this agreement.
      </p>
    ),
  },
  {
    title: "Use license",
    body: (
      <p>
        Permission is granted to temporarily download one copy of the materials on {BRAND.name} for
        personal, non-commercial transitory viewing only.
      </p>
    ),
  },
  {
    title: "User accounts",
    body: (
      <p>
        You are responsible for maintaining the confidentiality of your account and password. You
        agree to accept responsibility for all activities that occur under your account.
      </p>
    ),
  },
  {
    title: "Subscriptions",
    body: (
      <p>
        Some parts of the Service are billed on a subscription basis. You will be billed in advance
        on a recurring and periodic basis. Billing cycles are set on a monthly basis.
      </p>
    ),
  },
  {
    title: "Refunds",
    body: (
      <p>
        We offer a 7-day money-back guarantee. If you are not satisfied with your subscription, you
        can request a full refund within 7 days of your purchase.
      </p>
    ),
  },
  {
    title: "Termination",
    body: (
      <p>
        We may terminate or suspend your account immediately, without prior notice or liability, for
        any reason whatsoever, including without limitation if you breach the Terms.
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a
          href={`mailto:${BRAND.supportEmail}`}
          className="font-medium text-zinc-900 underline underline-offset-4 hover:text-indigo-700"
        >
          {BRAND.supportEmail}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      <header className="border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="rounded-md text-lg font-semibold tracking-tight text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            {BRAND.name}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md text-sm text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-zinc-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-14 sm:mt-20">
          {sections.map((section, i) => (
            <section
              key={section.title}
              className="grid gap-3 border-t border-zinc-200 py-8 md:grid-cols-[1fr_2fr] md:gap-12"
            >
              <h2 className="text-lg font-semibold text-zinc-900">
                <span className="mr-2 text-zinc-400">{i + 1}.</span>
                {section.title}
              </h2>
              <div className="max-w-2xl space-y-4 leading-relaxed text-zinc-600 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}