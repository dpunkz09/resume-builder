import type { CSSProperties, ReactNode } from "react";
import { ResumeContent, Theme } from "@/types";

type CorporateTemplateProps = {
  content: ResumeContent;
  theme: Theme;
};

type Section = ResumeContent["sections"][number];

/**
 * "Corporate" template: light-blue full-height sidebar with a round photo,
 * a navy name banner, and a timeline-style work experience section.
 *
 * This design is FULL-BLEED (the sidebar colour and navy banner run to the
 * page edges), so the preview/export should render it with 0 page margin.
 *
 * Proportions: every size is in `em`; 1em = 1/75 of the page width (≈10.6px on
 * A4), so the whole layout scales together with page size.
 */

// ── Palette ────────────────────────────────────────────────────────────────
const NAVY = "#2b3752";
const SIDEBAR_BG = "#e4eaf4";
const MUTED = "#5b6579";
const BODY = "#2f3748";

// Page height / width, used so the sidebar colour fills a whole sheet.
const PAGE_RATIO = { a4: 297 / 210, letter: 11 / 8.5, folio: 13 / 8.5 } as const;

// Sections that live in the main (right) column; everything else is in the sidebar.
const MAIN_COLUMN = new Set(["experience", "projects", "references"]);

const DEFAULT_TITLES: Record<string, string> = {
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  references: "Reference",
  projects: "Projects",
  custom: "Achievements",
};

const ICONS = {
  phone:
    "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  globe:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
} as const;

// Map platform labels to icon paths
const getIconPath = (label: string): string => {
  const l = label.toLowerCase();
  if (l.includes("linkedin")) return "/social-icons/linkedin.png";
  if (l.includes("github")) return "/social-icons/github-sign.png";
  if (l.includes("twitter") || l.includes("x.com")) return "/social-icons/twitter.png";
  if (l.includes("instagram")) return "/social-icons/instagram.png";
  if (l.includes("youtube")) return "/social-icons/video.png";
  if (l.includes("email") || l.includes("gmail")) return "/social-icons/gmail.png";
  if (l.includes("facebook")) return "/social-icons/facebook.png";
  return "/social-icons/others.png";
};

const extractUsername = (url: string): string => {
  const cleaned = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const parts = cleaned.split("/");
  return parts.length > 1 ? parts.slice(1).join("/").replace(/^@/, "") : cleaned;
};

const year = (d?: unknown) => {
  if (!d) return "";
  const s = String(d);
  return s.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? s;
};

const range = (item: { startDate?: unknown; endDate?: unknown; current?: boolean }) => {
  const start = year(item.startDate);
  const end = item.current ? "Present" : year(item.endDate);
  return [start, end].filter(Boolean).join(" - ");
};

// Proficiency text -> 1..5 dots
const proficiencyLevel = (p?: string): number => {
  const s = (p ?? "").toLowerCase();
  if (/native|mother|bilingual/.test(s)) return 5;
  if (/fluent|proficient|advanced|c1|c2/.test(s)) return 4;
  if (/intermediate|conversational|b1|b2/.test(s)) return 3;
  if (/basic|beginner|elementary|a1|a2/.test(s)) return 2;
  return s ? 3 : 0;
};

// ── Small building blocks ──────────────────────────────────────────────────

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="shrink-0"
      style={{ width: "1.3em", height: "1.3em", marginTop: "0.05em", color: NAVY }}
      fill="currentColor"
      aria-hidden
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

function ContactRow({
  icon,
  href,
  breakAll,
  children,
}: {
  icon: keyof typeof ICONS;
  href?: string;
  breakAll?: boolean;
  children: ReactNode;
}) {
  const text = <span className={breakAll ? "break-all" : "break-words"}>{children}</span>;
  return (
    <div className="flex min-w-0 items-start" style={{ gap: "0.9em" }}>
      <Icon name={icon} />
      {href ? (
        <a href={href} className="min-w-0">
          {text}
        </a>
      ) : (
        text
      )}
    </div>
  );
}

function SectionTitle({ children, size }: { children: ReactNode; size: "side" | "main" }) {
  return (
    <div
      className="break-after-avoid"
      style={{
        borderBottom: `0.12em solid ${NAVY}`,
        paddingBottom: "0.6em",
        marginBottom: size === "side" ? "1.3em" : "1.2em",
      }}
    >
      <h3
        className="font-bold uppercase leading-tight"
        style={{ color: NAVY, fontSize: size === "side" ? "1.2em" : "1.3em", letterSpacing: "0.3em" }}
      >
        {children}
      </h3>
    </div>
  );
}

// Plain bullet list with small round bullets
function DotList({ lines, justify }: { lines: ReactNode[]; justify?: boolean }) {
  if (!lines.length) return null;
  return (
    <ul>
      {lines.map((line, i) => (
        <li
          key={i}
          className={`relative break-inside-avoid ${justify ? "text-justify" : ""}`}
          style={{ paddingLeft: "1.6em", marginBottom: "0.35em" }}
        >
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: "0.4em",
              top: "calc(var(--lh) * 0.5em - 0.17em)",
              width: "0.34em",
              height: "0.34em",
              backgroundColor: NAVY,
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
        {description && <p className="text-justify" style={{ marginBottom: "0.5em" }}>{description}</p>}
        <DotList lines={highlights} justify />
      </>
    );
  }

  const lines = description
    ? description
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];
  return <DotList lines={lines} justify />;
}

function LanguageDots({ level }: { level: number }) {
  if (!level) return null;
  return (
    <span className="inline-flex shrink-0" style={{ gap: "0.35em" }} aria-label={`${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: "0.7em",
            height: "0.7em",
            backgroundColor: i < level ? NAVY : "#9aa3b5",
            opacity: i < level ? 1 : 0.55,
          }}
        />
      ))}
    </span>
  );
}

// ── Section bodies ─────────────────────────────────────────────────────────

function renderSectionBody(section: Section): ReactNode {
  const type = section.type as string;
  const items = section.items as any[];

  switch (type) {
    case "experience":
      // Timeline: a vertical rule with a square node at every entry
      return (
        <div>
          {items.map((item, idx) => {
            const last = idx === items.length - 1;
            return (
              <div
                key={idx}
                className="relative break-inside-avoid-page"
                style={{ paddingLeft: "2em", marginBottom: last ? 0 : "2.2em" }}
              >
                {/* line segment (runs through the gap to the next node) */}
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    left: "0.3em",
                    top: "0.45em",
                    bottom: last ? "0.2em" : "-2.2em",
                    width: "0.1em",
                    backgroundColor: NAVY,
                  }}
                />
                {/* node */}
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    left: 0,
                    top: "0.3em",
                    width: "0.7em",
                    height: "0.7em",
                    border: `0.1em solid ${NAVY}`,
                    backgroundColor: "#fff",
                  }}
                />
                <div className="flex items-baseline justify-between" style={{ gap: "1em" }}>
                  <p className="min-w-0 break-words font-bold" style={{ fontSize: "1.15em", color: NAVY }}>
                    {item.company || "Company"}
                  </p>
                  <p className="shrink-0 uppercase" style={{ fontSize: "0.9em", color: MUTED }}>
                    {range(item)}
                  </p>
                </div>
                <p style={{ marginBottom: "0.7em", color: BODY }}>
                  {[item.position || "Position", item.location].filter(Boolean).join(" · ")}
                </p>
                <Details item={item} />
              </div>
            );
          })}
        </div>
      );

    case "projects":
      return (
        <div className="grid grid-cols-2 items-start" style={{ columnGap: "2em", rowGap: "1.8em" }}>
          {items.map((item, idx) => (
            <div key={idx} className="min-w-0 break-inside-avoid-page">
              <p className="break-words font-bold" style={{ fontSize: "1.15em", color: NAVY }}>
                {item.name || "Project Name"}
              </p>
              <p className="uppercase" style={{ fontSize: "0.9em", color: MUTED, marginBottom: "0.6em" }}>
                {[year(item.startDate || item.endDate), item.organization].filter(Boolean).join(" · ")}
              </p>
              <Details item={item} />
            </div>
          ))}
        </div>
      );

    case "references":
      return (
        <div className="grid grid-cols-2" style={{ columnGap: "2em", rowGap: "1.4em" }}>
          {items.map((item, idx) => (
            <div key={idx} className="min-w-0 break-inside-avoid-page">
              <p className="font-bold" style={{ fontSize: "1.15em", color: NAVY }}>
                {item.name || "Reference Name"}
              </p>
              {(item.title || item.company) && (
                <p style={{ marginBottom: "0.4em" }}>
                  {[item.title, item.company].filter(Boolean).join(" / ")}
                </p>
              )}
              {item.relationship && <p className="italic">{item.relationship}</p>}
              {item.phone && (
                <p style={{ fontSize: "0.9em" }}>
                  <span className="font-bold">Phone: </span>
                  {item.phone}
                </p>
              )}
              {item.email && (
                <p className="break-all" style={{ fontSize: "0.9em" }}>
                  <span className="font-bold">Email: </span>
                  {item.email}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case "education":
      return (
        <div style={{ display: "grid", rowGap: "1.5em" }}>
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid-page" style={{ color: MUTED }}>
              {range(item) && (
                <p className="font-bold" style={{ color: BODY }}>
                  {range(item)}
                </p>
              )}
              <p className="font-bold uppercase" style={{ fontSize: "0.92em", marginBottom: "0.2em" }}>
                {item.institution || "University"}
              </p>
              <p>{[item.degree, item.field].filter(Boolean).join(" in ") || "Degree"}</p>
              {item.location && <p>{item.location}</p>}
              {item.gpa && <p>GPA: {item.gpa}</p>}
              {item.description && <p style={{ marginTop: "0.4em" }}>{item.description}</p>}
            </div>
          ))}
        </div>
      );

    case "skills": {
      const grouped = items.length > 1 && items.some((i) => i.category);
      return (
        <div style={{ color: MUTED }}>
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid" style={{ marginBottom: grouped ? "0.9em" : 0 }}>
              {grouped && item.category && (
                <p className="font-bold" style={{ color: BODY, marginBottom: "0.3em" }}>
                  {item.category}
                </p>
              )}
              <DotList lines={item.skills ?? []} />
            </div>
          ))}
        </div>
      );
    }

    case "languages":
      return (
        <div style={{ display: "grid", rowGap: "0.55em", color: MUTED }}>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between break-inside-avoid" style={{ gap: "0.8em" }}>
              <span className="relative" style={{ paddingLeft: "1.6em" }}>
                <span
                  aria-hidden
                  className="absolute rounded-full"
                  style={{ left: "0.4em", top: "0.55em", width: "0.34em", height: "0.34em", backgroundColor: NAVY }}
                />
                {item.language}
              </span>
              <LanguageDots level={proficiencyLevel(item.proficiency)} />
            </div>
          ))}
        </div>
      );

    case "certifications":
      return (
        <div style={{ color: MUTED }}>
          <DotList
            lines={items.map((item) => (
              <>
                <span style={{ color: BODY }} className="font-bold">
                  {item.name || "Certification"}
                </span>
                {(item.issuer || item.date) && (
                  <span className="block">{[item.issuer, item.date].filter(Boolean).join(" · ")}</span>
                )}
                {item.expiryDate && <span className="block">Expires: {item.expiryDate}</span>}
                {item.url && (
                  <span className="block break-all">
                    {item.url.startsWith("http") ? item.url : `https://${item.url}`}
                  </span>
                )}
              </>
            ))}
          />
        </div>
      );

    default:
      return (
        <div style={{ color: MUTED }}>
          <DotList
            lines={items.map((item) => (
              <>
                {item.title || item.name}
                {item.description && <span className="block">{item.description}</span>}
              </>
            ))}
          />
        </div>
      );
  }
}

// ── Template ───────────────────────────────────────────────────────────────

export function CorporateTemplate({ content, theme }: CorporateTemplateProps) {
  const { basics, summary, sections } = content;

  const visible = sections.filter((s) => s.visible);
  const sideSections = visible.filter((s) => !MAIN_COLUMN.has(s.type as string));
  const mainSections = visible.filter((s) => MAIN_COLUMN.has(s.type as string));

  const lineHeight = theme.spacing === "compact" ? 1.3 : theme.spacing === "relaxed" ? 1.6 : 1.45;
  const sizeScale = theme.fontSize === "small" ? 0.925 : theme.fontSize === "large" ? 1.075 : 1;
  const fontSize = `calc(100cqw / 75 * ${sizeScale})`;

  // Keep the sidebar colour running to the bottom of a single sheet.
  const ratio = PAGE_RATIO[(theme.pageSize as keyof typeof PAGE_RATIO) || "a4"] ?? PAGE_RATIO.a4;
  const minHeight = `calc(${(ratio * 100).toFixed(3)}cqw - 2px)`;

  const initials = (basics.fullName || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const renderSection = (section: Section, area: "side" | "main") => {
    const type = section.type as string;
    const title = section.title || DEFAULT_TITLES[type] || type;
    if (!section.items?.length) return null;

    return (
      <section key={section.id} style={{ marginBottom: area === "side" ? "2.6em" : "2.4em" }}>
        <SectionTitle size={area}>{title}</SectionTitle>
        {renderSectionBody(section)}
      </section>
    );
  };

  return (
    // Container so `cqw` resolves to the full page width
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <div
        className="box-border flex w-full items-stretch bg-white"
        style={
          {
            minHeight,
            color: BODY,
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
        {/* ───────── Sidebar ───────── */}
        <aside
          className="shrink-0 box-border"
          style={{ width: "24em", backgroundColor: SIDEBAR_BG, padding: "3em 2.6em 2em" }}
        >
          {/* Round photo */}
          <div
            className="mx-auto flex items-center justify-center overflow-hidden rounded-full"
            style={{ width: "16em", height: "16em", marginBottom: "3.2em", backgroundColor: "#cfd8e8" }}
          >
            {basics.photo ? (
              <img src={basics.photo} alt={basics.fullName || "Profile"} className="h-full w-full object-cover" />
            ) : initials ? (
              <span className="font-bold" style={{ fontSize: "4.5em", color: "#fff" }}>
                {initials}
              </span>
            ) : (
              <span style={{ color: MUTED }}>Photo</span>
            )}
          </div>

          {/* Contact */}
          <section style={{ marginBottom: "2.6em" }}>
            <SectionTitle size="side">Contact</SectionTitle>
            <div style={{ display: "grid", rowGap: "1em", color: MUTED }}>
              {basics.phone && <ContactRow icon="phone">{basics.phone}</ContactRow>}
              {basics.email && (
                <ContactRow icon="mail" breakAll>
                  {basics.email}
                </ContactRow>
              )}
              {basics.location && <ContactRow icon="pin">{basics.location}</ContactRow>}
              {basics.website && (
                <ContactRow
                  icon="globe"
                  href={basics.website.startsWith("http") ? basics.website : `https://${basics.website}`}
                  breakAll
                >
                  {basics.website.replace(/^https?:\/\//, "")}
                </ContactRow>
              )}
              {(basics.links ?? []).map((link, idx) => (
                <div key={idx} className="flex min-w-0 items-start" style={{ gap: "0.9em" }}>
                  <div
                    style={{
                      width: "1.3em",
                      height: "1.3em",
                      minWidth: "1.3em",
                      backgroundColor: NAVY,
                      WebkitMask: `url(${getIconPath(link.label)}) no-repeat center / contain`,
                      mask: `url(${getIconPath(link.label)}) no-repeat center / contain`,
                    }}
                  />
                  <span className="min-w-0 break-all">{extractUsername(link.url)}</span>
                </div>
              ))}
            </div>
          </section>

          {sideSections.map((s) => renderSection(s, "side"))}
        </aside>

        {/* ───────── Main column ───────── */}
        <div className="min-w-0 flex-1">
          {/* Navy banner with outlined name box */}
          <header style={{ backgroundColor: NAVY, padding: "2.4em" }}>
            <div
              className="text-center"
              style={{ border: "0.1em solid rgba(255,255,255,0.85)", padding: "2.6em 1.5em 2.4em" }}
            >
              <h1
                className="font-medium uppercase leading-[1.15] text-white"
                style={{
                  fontSize: "3.3em",
                  letterSpacing: "0.12em",
                  fontFamily: "Oswald, 'Bebas Neue', 'Arial Narrow', Inter, sans-serif",
                }}
              >
                {basics.fullName || "Your Name"}
              </h1>
              {basics.headline && (
                <p
                  className="uppercase"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "1.1em",
                    letterSpacing: "0.32em",
                    marginTop: "1.4em",
                  }}
                >
                  {basics.headline}
                </p>
              )}
            </div>
          </header>

          <div style={{ padding: "3em 2.6em 2.4em" }}>
            {summary && (
              <section style={{ marginBottom: "2.6em" }}>
                <SectionTitle size="main">Profile</SectionTitle>
                <p className="text-justify">{summary}</p>
              </section>
            )}

            {mainSections.map((s) => renderSection(s, "main"))}
          </div>
        </div>
      </div>
    </div>
  );
}