import Link from "next/link";
import { Check } from "lucide-react";

const freeFeatures = [
  "1 resume",
  "2 templates (Classic and ATS)",
  "PDF export with watermark",
  "Basic customization",
];

const proFeatures = [
  "Unlimited resumes",
  "All templates",
  "PDF export without watermark",
  "AI-powered suggestions",
  "Resume analysis",
  "Priority support",
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-zinc-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Start free. Upgrade when you need more.
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
          No hidden fees, and you can cancel any time.
        </p>

        <div className="mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-zinc-200 p-8">
            <h3 className="text-base font-medium text-zinc-900">Free</h3>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight text-zinc-900">$0</span>
              <span className="text-zinc-500">forever</span>
            </p>

            <ul className="mt-8 flex-1 space-y-3.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-zinc-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className={`mt-10 block rounded-lg border border-zinc-300 px-6 py-3 text-center font-medium text-zinc-900 transition-colors hover:bg-zinc-50 ${focusRing}`}
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="flex flex-col rounded-2xl border-2 border-zinc-900 p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-zinc-900">Pro</h3>
              <span className="text-sm font-medium text-indigo-600">Most popular</span>
            </div>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight text-zinc-900">$9</span>
              <span className="text-zinc-500">per month</span>
            </p>

            <ul className="mt-8 flex-1 space-y-3.5">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-zinc-900">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className={`mt-10 block rounded-lg bg-zinc-900 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-zinc-700 ${focusRing}`}
            >
              Start 7-day free trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
