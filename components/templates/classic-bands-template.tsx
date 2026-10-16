import type { CSSProperties, ReactNode } from "react";
import { ResumeContent, Theme } from "@/types";

type ClassicBandsTemplateProps = {
  content: ResumeContent;
  theme: Theme;
};

type Section = ResumeContent["sections"][number];

/**
 * "Classic Bands" template: centered name header, a contact line separated by
 * pipes, and full-width light blue-gray bands for each section title.
 * Titles/dates sit on one line (title left, date right).
 *
 * Single column, uses the normal page margins from the theme (NOT full-bleed).
 *
 * Proportions: every size is in `em`; 1em = 1/52 of the printable width
 * (≈12.5px on A4 with normal margins), so the layout scales with page size.
 */

const BAND_BG = "#d9e2e8";
const TEXT = "#1f2328";
const MUTED = "#4b5563";
const RULE = "#e5e7eb";

const DEFAULT_TITLES: Record<string, string> = {
  summary: "Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Key Skills",
  certifications: "Certifications",
  languages: "Languages",
  references: "References",
  projects: "Projects",
  custom: "Achievements",
};

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2023-10" / "2023-10-01" -> "Oct 2023"; anything else is shown as typed.
const fmtDate = (d?: unknown): string => {
  if (!d) return "";
  const s = String(d).trim();
  const iso = s.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?/);
  if (iso) {
    const m = Number(iso[2]);
    if (m >= 1 && m <= 12) return `${MONTHS[m - 1]} ${iso[1]}`;
  }
  return s;
};

const range = (item: { startDate?: unknown; endDate?: unknown; current?: boolean }) => {
  const start = fmtDate(item.startDate);
  const end = item.current ? "Present" : fmtDate(item.endDate);
  return [start, end].filter(Boolean).join(" - ");
};

const extractUsername = (url: string): string => {
  const cleaned = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const parts = cleaned.split("/");
  return parts.length > 1 ? parts.slice(1).join("/").replace(/^@/, "") : cleaned;
};

// ── Building blocks ────────────────────────────────────────────────────────

function SectionBand({ children }: { children: ReactNode }) {
  return (
    <div
      className="break-after-avoid"
      style={{ backgroundColor: BAND_BG, padding: "0.55em 1.9em", marginBottom: "1.2em" }}
    >
      <h3 className="font-medium uppercase leading-tight" style={{ fontSize: "1.2em", color: TEXT }}>
        {children}
      </h3>
    </div>
  );
}

// Title on the left, date on the right
function TitleRow({ title, meta, sub }: { title: ReactNode; meta?: string; sub?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between" style={{ gap: "1.5em" }}>
      <p className="min-w-0 break-words font-semibold" style={{ fontSize: "1.05em" }}>
        {title}
        {sub && (
          <span className="font-normal" style={{ color: MUTED }}>
            {sub}
          </span>
        )}
      </p>
      {meta && (
        <p className="shrink-0 font-medium" style={{ fontSize: "1em" }}>
          {meta}
        </p>
      )}
    </div>
  );
}

function BulletList({ lines, justify = true }: { lines: ReactNode[]; justify?: boolean }) {
  if (!lines.length) return null;
  return (
    <ul>
      {lines.map((line, i) => (
        <li
          key={i}
          className={`relative ${justify ? "text-justify" : ""}`}
          style={{ paddingLeft: "1.75em", marginBottom: "0.1em" }}
        >
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: "0.7em",
              top: "calc(var(--lh) * 0.5em - 0.18em)",
              width: "0.36em",
              height: "0.36em",
              backgroundColor: TEXT,
            }}
          />
          {line}
        </li>
      ))}
    </ul>
  );
}

function Details({ item }: { item: { description?: string; highlights?: string[] } }) {
  const highlights = item.highlights ?? [];
  const description = item.description?.trim();

  if (highlights.length > 0) {
    return (
      <>
        {description && (
          <p className="text-justify" style={{ marginBottom: "0.3em" }}>
            {description}
          </p>
        )}
        <BulletList lines={highlights} />
      </>
    );
  }

  const lines = description
    ? description
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];
  return <BulletList lines={lines} />;
}

// Bulleted multi-column grid (skills, languages)
function BulletGrid({ lines, columns = 3 }: { lines: ReactNode[]; columns?: number }) {
  if (!lines.length) return null;
  return (
    <ul className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: "1.5em" }}>
      {lines.map((line, i) => (
        <li key={i} className="relative break-inside-avoid" style={{ paddingLeft: "1.75em", marginBottom: "0.1em" }}>
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: "0.7em",
              top: "calc(var(--lh) * 0.5em - 0.18em)",
              width: "0.36em",
              height: "0.36em",
              backgroundColor: TEXT,
            }}
          />
          {line}
        </li>
      ))}
    </ul>
  );
}

// ── Section bodies ─────────────────────────────────────────────────────────

function renderSectionBody(section: Section): ReactNode {
  const type = section.type as string;
  const items = section.items as any[];

  switch (type) {
    case "experience":
      return (
        <div style={{ display: "grid", rowGap: "1.9em" }}>
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid-page">
              <TitleRow
                title={[item.position || "Position", item.company].filter(Boolean).join(", ")}
                sub={item.location ? ` | ${item.location}` : undefined}
                meta={range(item)}
              />
              <div style={{ marginTop: "0.15em" }}>
                <Details item={item} />
              </div>
            </div>
          ))}
        </div>
      );

    case "education":
      return (
        <div style={{ display: "grid", rowGap: "1.2em" }}>
          {items.map((item, idx) => {
            const bullets: ReactNode[] = [];
            if (item.field) bullets.push(`Major in ${item.field}.`);
            if (item.gpa) bullets.push(`Final CGPA: ${item.gpa}`);
            if (item.description) bullets.push(item.description);
            return (
              <div key={idx} className="break-inside-avoid-page">
                <TitleRow title={item.degree || "Degree"} meta={range(item)} />
                <p style={{ marginTop: "0.1em" }}>
                  {[item.institution || "University", item.location].filter(Boolean).join(", ")}
                </p>
                <BulletList lines={bullets} />
              </div>
            );
          })}
        </div>
      );

    case "skills": {
      const grouped = items.length > 1 && items.some((i) => i.category);
      if (!grouped) {
        const all = items.flatMap((i) => i.skills ?? []);
        return <BulletGrid lines={all} />;
      }
      return (
        <div style={{ display: "grid", rowGap: "0.9em" }}>
          {items.map((item, idx) => (
            <div key={idx}>
              {item.category && (
                <p className="break-after-avoid font-semibold" style={{ marginBottom: "0.1em" }}>
                  {item.category}
                </p>
              )}
              <BulletGrid lines={item.skills ?? []} />
            </div>
          ))}
        </div>
      );
    }

    case "languages":
      return (
        <BulletGrid
          lines={items.map((item) => (
            <>
              {item.language}
              {item.proficiency && <span style={{ color: MUTED }}> ({item.proficiency})</span>}
            </>
          ))}
        />
      );

    case "projects":
      return (
        <div style={{ display: "grid", rowGap: "1.6em" }}>
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid-page">
              <TitleRow
                title={item.name || "Project Name"}
                sub={item.organization ? `, ${item.organization}` : undefined}
                meta={range(item)}
              />
              <div style={{ marginTop: "0.15em" }}>
                <Details item={item} />
              </div>
            </div>
          ))}
        </div>
      );

    case "certifications":
      return (
        <div style={{ display: "grid", rowGap: "0.9em" }}>
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid-page">
              <TitleRow title={item.name || "Certification"} meta={fmtDate(item.date)} />
              {item.issuer && <p>{item.issuer}</p>}
              {item.expiryDate && (
                <p style={{ color: MUTED }}>Expires: {fmtDate(item.expiryDate)}</p>
              )}
              {item.url && (
                <p className="break-all" style={{ color: MUTED }}>
                  {item.url.startsWith("http") ? item.url : `https://${item.url}`}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case "references":
      return (
        <div className="grid grid-cols-3" style={{ columnGap: "1.8em", rowGap: "1.4em" }}>
          {items.map((item, idx) => (
            <div key={idx} className="min-w-0 break-inside-avoid-page">
              <p className="font-semibold" style={{ fontSize: "1.05em" }}>
                {item.name || "Reference Name"}
              </p>
              {(item.title || item.company) && (
                <p>{[item.title, item.company].filter(Boolean).join(", ")}</p>
              )}
              {item.relationship && (
                <p className="italic" style={{ color: MUTED }}>
                  {item.relationship}
                </p>
              )}
              {item.phone && <p style={{ color: MUTED }}>{item.phone}</p>}
              {item.email && (
                <p className="break-all" style={{ color: MUTED }}>
                  {item.email}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    // "custom" and any unknown section type
    default:
      return (
        <BulletList
          lines={items.map((item) => (
            <>
              {item.title || item.name}
              {item.description && <span className="block">{item.description}</span>}
            </>
          ))}
        />
      );
  }
}

// ── Template ───────────────────────────────────────────────────────────────

export function ClassicBandsTemplate({ content, theme }: ClassicBandsTemplateProps) {
  const { basics, summary, sections } = content;

  const visible = sections.filter((s) => s.visible);

  const lineHeight = theme.spacing === "compact" ? 1.3 : theme.spacing === "relaxed" ? 1.6 : 1.45;
  const sizeScale = theme.fontSize === "small" ? 0.925 : theme.fontSize === "large" ? 1.075 : 1;
  const fontSize = `calc(100cqw / 52 * ${sizeScale})`;

  // Contact line: email | phone | location | website | links
  const contact: string[] = [
    basics.email,
    basics.phone,
    basics.location,
    basics.website ? basics.website.replace(/^https?:\/\//, "") : "",
    ...(basics.links ?? []).map((l) => extractUsername(l.url)),
  ].filter(Boolean) as string[];

  const renderSection = (section: Section) => {
    const type = section.type as string;
    const title = section.title || DEFAULT_TITLES[type] || type;
    if (!section.items?.length) return null;

    return (
      <section key={section.id} style={{ marginBottom: "2.4em" }}>
        <SectionBand>{title}</SectionBand>
        <div style={{ padding: "0 1.9em" }}>{renderSectionBody(section)}</div>
      </section>
    );
  };

  return (
    // Container so `cqw` resolves to the printable-area width
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <div
        className="box-border w-full bg-white"
        style={
          {
            color: TEXT,
            fontFamily:
              theme.font === "times"
                ? "Times New Roman, serif"
                : theme.font === "roboto"
                  ? "Roboto, sans-serif"
                  : theme.font === "arial"
                    ? "Arial, sans-serif"
                    : "Inter, sans-serif",
            fontSize,
            lineHeight,
            "--lh": lineHeight,
          } as CSSProperties
        }
      >
        {/* Header */}
        <header className="text-center" style={{ marginBottom: "2.2em" }}>
          <h1
            className="font-semibold uppercase leading-[1.1]"
            style={{ fontSize: "2.9em", letterSpacing: "0.01em" }}
          >
            {basics.fullName || "Your Name"}
          </h1>
          {basics.headline && (
            <h2 className="font-semibold" style={{ fontSize: "1.15em", marginTop: "0.3em" }}>
              {basics.headline}
            </h2>
          )}

          <div style={{ borderTop: `1px solid ${RULE}`, margin: "1.2em 0 1.1em" }} />

          {contact.length > 0 && (
            <p className="break-words" style={{ fontSize: "1.05em", color: MUTED }}>
              {contact.map((c, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ margin: "0 0.45em" }}>|</span>}
                  {c}
                </span>
              ))}
            </p>
          )}
        </header>

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: "2.4em" }}>
            <SectionBand>Summary</SectionBand>
            <div style={{ padding: "0 1.9em" }}>
              <p className="text-justify" style={{ fontSize: "0.92em" }}>
                {summary}
              </p>
            </div>
          </section>
        )}

        {visible.map(renderSection)}
      </div>
    </div>
  );
}