import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="border-t border-zinc-200 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
          Your next application deserves a better resume.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
          Build your first resume on the Free plan. No credit card required.
        </p>
        <Link
          href="/login"
          className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          Create your resume
          <ArrowRight
            className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
