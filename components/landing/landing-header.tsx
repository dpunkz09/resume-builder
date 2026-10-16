"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BRAND } from "./brand";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#templates", label: "Templates" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className={`rounded-md text-lg font-semibold tracking-tight text-zinc-900 ${focusRing}`}
        >
          {BRAND.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-md text-sm text-zinc-600 transition-colors hover:text-zinc-900 ${focusRing}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className={`rounded-md text-sm text-zinc-600 transition-colors hover:text-zinc-900 ${focusRing}`}
          >
            Log in
          </Link>
          <Link
            href="/login"
            className={`rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 ${focusRing}`}
          >
            Build for free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 md:hidden ${focusRing}`}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-zinc-200 bg-white md:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-zinc-800"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-4">
              <Link
                href="/login"
                className="rounded-lg border border-zinc-300 px-4 py-3 text-center text-base text-zinc-800"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-zinc-900 px-4 py-3 text-center text-base font-medium text-white"
              >
                Build for free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
