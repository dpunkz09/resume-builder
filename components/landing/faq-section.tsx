"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { BRAND } from "./brand";

const faqs = [
  {
    question: `Is ${BRAND.name} really free?`,
    answer:
      "Yes. The Free plan is free forever with 1 resume and 2 templates, and needs no credit card. Upgrade to Pro for unlimited resumes and AI features.",
  },
  {
    question: "Are the templates ATS-friendly?",
    answer:
      "They're designed to be. We use clean, semantic HTML and avoid complex formatting that can confuse applicant tracking systems.",
  },
  {
    question: "Can I export my resume to PDF?",
    answer: "Yes, in A4, US Letter or Folio. Free plans add a small watermark. Pro exports are clean.",
  },
  {
    question: "How does the AI feature work?",
    answer:
      "The AI (powered by Google Gemini) can rewrite your bullet points, generate a professional summary, and analyze your whole resume for things to improve.",
  },
  {
    question: "Can I cancel my Pro subscription any time?",
    answer:
      "Yes. Cancel from your billing dashboard and Pro stays active until the end of your billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your resume data is encrypted and never shared with third parties. You can delete your account and all of your data at any time.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes. If you're not satisfied within the first 7 days, contact support for a full refund.",
  },
  {
    question: "Can I share my resume publicly?",
    answer:
      "Not yet. We're working on a public share feature that will give you a link to your resume.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-zinc-200 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Questions, answered
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-zinc-600">
            Can't find what you need?{" "}
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="font-medium text-zinc-900 underline underline-offset-4 hover:text-indigo-700"
            >
              Contact support
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200 lg:col-span-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div key={faq.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                  >
                    <span className="text-base font-medium text-zinc-900 sm:text-lg">{faq.question}</span>
                    {isOpen ? (
                      <Minus className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                    )}
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 leading-relaxed text-zinc-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
