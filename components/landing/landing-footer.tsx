import Link from "next/link";
import { BRAND } from "./brand";

const linkClass =
  "text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:underline";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
              {BRAND.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
              Build an ATS-friendly resume with AI suggestions and export it as a clean PDF.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-medium text-zinc-900">Product</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#features" className={linkClass}>Features</a></li>
              <li><a href="#templates" className={linkClass}>Templates</a></li>
              <li><a href="#pricing" className={linkClass}>Pricing</a></li>
              <li><Link href="/login" className={linkClass}>Log in</Link></li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="text-sm font-medium text-zinc-900">Support</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#faq" className={linkClass}>FAQ</a></li>
              <li><a href={`mailto:${BRAND.supportEmail}`} className={linkClass}>Contact support</a></li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-medium text-zinc-900">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/terms" className={linkClass}>Terms of Service</Link></li>
              <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
            </ul>
          </nav>
        </div>

        <p className="mt-12 text-sm text-zinc-500">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
