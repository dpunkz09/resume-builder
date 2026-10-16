"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ResumeContent, Theme } from "@/types";
import { getTemplateComponent } from "@/lib/templates";

type ResumePreviewProps = {
  content: ResumeContent;
  theme: Theme;
  templateId?: string;
};

// CSS reference pixels: 96px = 1in, so 1mm = 96 / 25.4px
const PX_PER_IN = 96;
const PX_PER_MM = 96 / 25.4;

const PAGE_SIZES = {
  a4: { width: 210 * PX_PER_MM, height: 297 * PX_PER_MM, label: "A4 (210mm × 297mm)" },
  letter: { width: 8.5 * PX_PER_IN, height: 11 * PX_PER_IN, label: 'US Letter (8.5" × 11")' },
  folio: { width: 8.5 * PX_PER_IN, height: 13 * PX_PER_IN, label: 'Folio (8.5" × 13")' },
} as const;

const MARGINS = {
  narrow: 0.5 * PX_PER_IN,
  normal: 0.75 * PX_PER_IN,
  wide: 1.25 * PX_PER_IN,
} as const;

type Band = { top: number; bottom: number };
type PageSlice = { start: number; end: number };

/**
 * Collect the vertical extent of every individual line of text (and every
 * image/svg) inside `root`, relative to the top of `root`. A page break must
 * never fall inside one of these bands, otherwise a line gets sliced in half.
 */
function collectBands(root: HTMLElement): Band[] {
  const baseTop = root.getBoundingClientRect().top;
  const bands: Band[] = [];
  const range = document.createRange();

  const push = (r: DOMRect) => {
    if (r.height < 1) return;
    bands.push({ top: r.top - baseTop, bottom: r.bottom - baseTop });
  };

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    // One rect per rendered line of text
    Array.from(range.getClientRects()).forEach(push);
  }

  root.querySelectorAll("img, svg, canvas, hr").forEach((el) => {
    push(el.getBoundingClientRect());
  });

  return bands;
}

/**
 * Greedily split the content into pages. Each page is at most `pageHeight`
 * tall, and is cut at the nearest gap between lines above the hard limit.
 */
function computePages(root: HTMLElement, pageHeight: number, total: number): PageSlice[] {
  const bands = collectBands(root);
  const pages: PageSlice[] = [];
  const EPS = 0.5;
  let start = 0;

  while (total - start > pageHeight + EPS) {
    let cut = start + pageHeight;

    // Move the cut up until it no longer slices through any line
    for (let guard = 0; guard < 2000; guard++) {
      let moved = false;
      for (const b of bands) {
        if (b.top < cut - EPS && b.bottom > cut + EPS) {
          cut = Math.min(cut, b.top);
          moved = true;
        }
      }
      if (!moved) break;
    }

    // Safety net: a single block taller than a page -> hard cut
    if (cut <= start + 20) cut = start + pageHeight;

    pages.push({ start, end: cut });
    start = cut;
  }

  pages.push({ start, end: Math.max(total, start + 1) });
  return pages;
}

export function ResumePreview({ content, theme, templateId = "classic" }: ResumePreviewProps) {
  const TemplateComponent = getTemplateComponent(templateId);

  const size = PAGE_SIZES[(theme.pageSize as keyof typeof PAGE_SIZES) || "a4"] ?? PAGE_SIZES.a4;
  const margin = MARGINS[(theme.margins as keyof typeof MARGINS) || "normal"] ?? MARGINS.normal;

  // Printable area inside the margins
  const contentWidth = size.width - margin * 2;
  const contentHeight = size.height - margin * 2;

  // Render the resume once (hidden) to measure it, then slice it into pages
  // at line boundaries.
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PageSlice[]>([{ start: 0, end: contentHeight }]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const update = () => {
      const next = computePages(el, contentHeight, el.scrollHeight);
      setPages((prev) =>
        prev.length === next.length &&
        prev.every((p, i) => Math.abs(p.start - next[i].start) < 0.5 && Math.abs(p.end - next[i].end) < 0.5)
          ? prev
          : next
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);

    // Web fonts can change line heights after first paint
    if (document.fonts?.ready) document.fonts.ready.then(update).catch(() => {});

    return () => observer.disconnect();
  }, [content, theme, templateId, contentWidth, contentHeight]);

  const pageCount = pages.length;

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen">
      {/* Page size indicator */}
      <div className="sticky top-4 z-10 text-sm text-gray-600 font-medium bg-white px-4 py-2 rounded-full shadow-md mb-6">
        {size.label} • {pageCount} {pageCount === 1 ? "page" : "pages"}
      </div>

      {/* Hidden measuring copy (same width as the printable area) */}
      <div
        ref={measureRef}
        aria-hidden
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          left: -99999,
          top: 0,
          width: contentWidth,
        }}
      >
        <TemplateComponent content={content} theme={theme} />
      </div>

      <div className="flex flex-col gap-8 relative">
        {pages.map((page, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-16 top-0 text-sm text-gray-400 font-medium">
              Page {i + 1}
              <div className="w-12 h-px bg-gray-300 mt-2" />
            </div>

            {/* The sheet of paper */}
            <div
              className="bg-white shadow-2xl relative"
              style={{ width: size.width, height: size.height, overflow: "hidden" }}
            >
              {/* Printable area: identical margins on every page. Its height
                  is trimmed to the page's actual cut so no half-line peeks
                  through at the bottom. */}
              <div
                style={{
                  position: "absolute",
                  top: margin,
                  left: margin,
                  width: contentWidth,
                  height: Math.min(contentHeight, page.end - page.start),
                  overflow: "hidden",
                }}
              >
                {/* Slide the full resume up to this page's start */}
                <div
                  style={{
                    width: contentWidth,
                    transform: `translateY(-${page.start}px)`,
                  }}
                >
                  <TemplateComponent content={content} theme={theme} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}