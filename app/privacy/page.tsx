import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/components/landing/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description: `Read ${BRAND.name}'s privacy policy to understand how we collect, use, and protect your personal information and resume data.`,
  openGraph: {
    title: `Privacy Policy | ${BRAND.name}`,
    description: "Our commitment to protecting your privacy and data security.",
  },
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Set this to the date the policy text was last changed.
// (The old page used new Date(), which always showed today's date.)
const LAST_UPDATED = "October 15, 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Information we collect",
    body: (
      <p>
        We collect information you provide directly to us, such as when you create an account,
        build a resume, or contact us for support. This includes your name, email address, and
        resume content.
      </p>
    ),
  },
  {
    title: "How we use your information",
    body: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
        </ul>
      </>
    ),
  },
  {
    title: "Information sharing",
    body: (
      <>
        <p>
          We do not share, sell, rent, or trade your personal information with third parties for
          their promotional purposes. We may share your information in the following situations:
        </p>
        <ul>
          <li>With your consent</li>
          <li>For legal reasons or to protect rights</li>
          <li>With service providers who help us operate our business</li>
        </ul>
      </>
    ),
  },
  {
    title: "Data security",
    body: (
      <p>
        We take reasonable measures to help protect your personal information from loss, theft,
        misuse, unauthorized access, disclosure, alteration, and destruction.
      </p>
    ),
  },
  {
    title: "Data retention",
    body: (
      <p>
        We store your information for as long as necessary to provide our services. You can delete
        your account at any time, which will remove all your personal data from our systems.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and data</li>
          <li>Export your data</li>
        </ul>
      </>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        If you have any questions about this Privacy Policy, please contact us at{" "}
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

export default function PrivacyPage() {
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
          Privacy Policy
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