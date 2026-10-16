"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { BRAND } from "./brand";

const ORIGINAL = "Responsible for managing the team's customer support tickets.";
const IMPROVED =
  "Cut first-response time by 32% by rebuilding the ticket triage queue for a team of six.";

type Status = "idle" | "thinking" | "typing" | "done";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export function HeroSection() {
  const [text, setText] = useState(ORIGINAL);
  const [status, setStatus] = useState<Status>("idle");
  const timers = useRef<{
    timeout?: ReturnType<typeof setTimeout>;
    interval?: ReturnType<typeof setInterval>;
  }>({});

  const clearTimers = () => {
    clearTimeout(timers.current.timeout);
    clearInterval(timers.current.interval);
  };

  const rewrite = useCallback(() => {
    clearTimers();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(IMPROVED);
      setStatus("done");
      return;
    }
    setText("");
    setStatus("thinking");
    timers.current.timeout = setTimeout(() => {
      setStatus("typing");
      let i = 0;
      timers.current.interval = setInterval(() => {
        i += 2;
        setText(IMPROVED.slice(0, i));
        if (i >= IMPROVED.length) {
          clearInterval(timers.current.interval);
          setText(IMPROVED);
          setStatus("done");
        }
      }, 22);
    }, 600);
  }, []);

  const reset = () => {
    clearTimers();
    setText(ORIGINAL);
    setStatus("idle");
  };

  // One orchestrated moment: plays once after load (skipped for reduced motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = setTimeout(rewrite, 1800);
    return () => {
      clearTimeout(start);
      clearTimers();
    };
  }, [rewrite]);

  const busy = status === "thinking" || status === "typing";
  const statusLabel = {
    idle: "Original bullet",
    thinking: "Reading your bullet…",
    typing: "Rewriting…",
    done: "Rewritten with a measurable result",
  }[status];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.03] tracking-tight text-zinc-900 sm:text-7xl">
          Build a resume that gets read.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
          Write your experience once, pick an ATS-friendly template, let AI sharpen your bullet
          points, and export a clean PDF.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/login"
            className={`group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 ${focusRing}`}
          >
            Create your resume
            <ArrowRight
              className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <a
            href="#templates"
            className={`rounded-md px-2 py-2 text-base font-medium text-zinc-700 underline-offset-4 hover:text-zinc-900 hover:underline ${focusRing}`}
          >
            Browse templates
          </a>
          <span className="text-sm text-zinc-500 sm:ml-2">Free plan, no credit card required.</span>
        </div>

        {/* Product */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.18)] sm:mt-20">
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
            <span className="ml-3 text-xs text-zinc-500">{BRAND.name} · Resume editor</span>
          </div>

          <div className="grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            {/* Editor */}
            <div className="border-b border-zinc-200 p-6 sm:p-8 md:border-b-0 md:border-r">
              <p className="text-sm font-medium text-zinc-900">Experience</p>
              <p className="mt-0.5 text-xs text-zinc-500">Support Lead · Northwind Co.</p>

              <p className="mt-7 text-xs font-medium text-zinc-500">Bullet point</p>
              <div
                aria-live="polite"
                className={`mt-2 min-h-[7.5rem] rounded-lg border p-4 text-sm leading-relaxed text-zinc-800 transition-colors ${
                  busy ? "border-indigo-600" : "border-zinc-200"
                }`}
              >
                {text}
                {busy && (
                  <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-indigo-600 motion-safe:animate-pulse" />
                )}
              </div>
              <p className="mt-2 text-xs text-zinc-500">{statusLabel}</p>

              <button
                type="button"
                onClick={status === "done" ? reset : rewrite}
                disabled={busy}
                className={`mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
              >
                {status === "done" ? (
                  <>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                    {busy ? "Working…" : "Rewrite with AI"}
                  </>
                )}
              </button>
            </div>

            {/* Preview */}
            <div className="bg-zinc-50 p-6 sm:p-10">
              <article
                aria-label="Sample resume preview"
                className="mx-auto max-w-sm rounded-md border border-zinc-200 bg-white p-7 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-zinc-900">Alex Rivera</h2>
                <p className="text-sm text-zinc-600">Customer Support Lead</p>
                <p className="mt-1 text-[11px] text-zinc-500">alex@example.com · linkedin.com/in/alexrivera</p>

                <h3 className="mt-6 border-b border-zinc-200 pb-1 text-xs font-semibold text-zinc-900">
                  Experience
                </h3>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-[13px] font-medium text-zinc-900">Support Lead, Northwind Co.</p>
                  <p className="shrink-0 text-[11px] text-zinc-500">2021 – Present</p>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-zinc-700">
                  <li
                    className={`min-h-[2.5rem] transition-colors duration-500 motion-reduce:transition-none ${
                      status === "done" ? "bg-indigo-50" : ""
                    }`}
                  >
                    {text}
                  </li>
                  <li>Trained nine new hires with a documented onboarding playbook.</li>
                </ul>

                <h3 className="mt-6 border-b border-zinc-200 pb-1 text-xs font-semibold text-zinc-900">
                  Skills
                </h3>
                <p className="mt-2 text-xs text-zinc-700">Zendesk, SQL, Team coaching, Process design</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
