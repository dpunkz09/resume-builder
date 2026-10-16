import type { CSSProperties, ReactNode } from "react";
import { ResumeContent, Theme } from "@/types";

type ExecutiveTemplateProps = {
  content: ResumeContent;
  theme: Theme;
};

type Section = ResumeContent["sections"][number];

// Map platform IDs to icon paths
const getIconPath = (label: string): string => {
  const labelLower = label.toLowerCase();
  if (labelLower.includes("linkedin")) return "/social-icons/linkedin.png";
  if (labelLower.includes("github")) return "/social-icons/github-sign.png";
  if (labelLower.includes("twitter") || labelLower.includes("x.com")) return "/social-icons/twitter.png";
  if (labelLower.includes("instagram")) return "/social-icons/instagram.png";
  if (labelLower.includes("youtube")) return "/social-icons/video.png";
  if (labelLower.includes("email") || labelLower.includes("gmail")) return "/social-icons/gmail.png";
  if (labelLower.includes("facebook")) return "/social-icons/facebook.png";
  return "/social-icons/others.png";
};

// Extract username from social media URL
const extractUsername = (url: string): string => {
  let cleaned = url.replace(/^https?:\/\//, "");
  cleaned = cleaned.replace(/^www\./, "");
  const parts = cleaned.split("/");
  if (parts.length > 1) {
    return parts.slice(1).join("/").replace(/^@/, "");
  }
  return cleaned;
};

/**
 * Executive resume layout.
 *
 * PROPORTIONS: every size in this file is in `em`, and the root font size is
 * derived from the width of the printable area (1/65 of it, i.e. 10px on A4
 * with normal margins). That means the whole layout scales as one unit with
 * the page size and margin settings instead of keeping fixed pixel sizes that
 * only looked right on one paper size.
 *
 * Page margins come from the preview/export (theme.margins), so the template
 * adds no outer padding of its own.
 *
 * Column plan (in em, content width ≈ 65em):
 *   sidebar 19.5em | gap 2.5em | main 43em   (≈ 30% / 4% / 66%)
 */

// Sections that live in the right column. Everything else goes in the left sidebar.
const RIGHT_COLUMN = new Set(["experience", "projects", "references"]);

const DEFAULT_TITLES: Record<string, string> = {
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  references: "References",
  projects: "Projects",
  custom: "Achievements",
};

// --lh holds the line-height number so the bullet dot can centre itself on the first line.
const BULLET =
  "relative pl-[1.75em] text-justify before:absolute before:left-[0.375em] before:top-[calc(var(--lh)*0.5em_-_0.1875em)] before:h-[0.375em] before:w-[0.375em] before:rounded-full before:bg-black before:content-['']";

const ICONS = {
  phone:
    "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  globe:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
} as const;

// Pulls a 4-digit year out of any date string; falls back to the raw text instead of "NaN".
const year = (d?: unknown) => {
  if (!d) return "";
  const s = String(d);
  return s.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? s;
};

const range = (item: { startDate?: unknown; endDate?: unknown; current?: boolean }) => {
  const start = year(item.startDate);
  const end = item.current ? "Present" : year(item.endDate);
  return [start, end].filter(Boolean).join(" – ");
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.25em] w-[1.25em] shrink-0"
      style={{ marginTop: "0.05em" }}
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
    <div className="flex min-w-0 items-start gap-[0.75em]">
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

// Sidebar titles are a little smaller so long words (CERTIFICATIONS) always fit the narrow column.
function SectionTitle({ children, compact }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="mb-[1.25em] border-b border-black pb-[0.75em] break-after-avoid">
      <h3
        className="font-bold uppercase leading-tight text-black"
        style={{ fontSize: compact ? "1.7em" : "2.1em", letterSpacing: "0.02em" }}
      >
        {children}
      </h3>
    </div>
  );
}

function BulletList({ lines }: { lines: ReactNode[] }) {
  if (!lines.length) return null;
  return (
    <ul>
      {lines.map((line, i) => (
        <li key={i} className={BULLET}>
          {line}
        </li>
      ))}
    </ul>
  );
}

// "a | b | c" line for dates, company, location, organization
function MetaLine({ parts }: { parts: ReactNode[] }) {
  const shown = parts.filter(Boolean);
  if (!shown.length) return null;
  return (
    <p className="text-neutral-700">
      {shown.map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-[0.9em]">|</span>}
          {part}
        </span>
      ))}
    </p>
  );
}

// Experience / project body: an optional description paragraph plus highlight bullets.
// With no highlights, each line of the description becomes a bullet.
function Details({ item }: { item: { description?: string; highlights?: string[] } }) {
  const highlights = item.highlights ?? [];
  const description = item.description?.trim();

  if (highlights.length > 0) {
    return (
      <>
        {description && <p className="mb-[0.5em] text-justify">{description}</p>}
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

function renderSectionBody(section: Section): ReactNode {
  const type = section.type as string;
  const items = section.items as any[];

  switch (type) {
    case "experience":
      return (
        <div className="space-y-[2em]">
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid-page">
              <MetaLine parts={[range(item), item.company, item.location]} />
              <p className="mb-[0.5em] mt-[0.2em] break-words text-[1.3em] font-bold leading-tight">
                {item.position || "Position"}
              </p>
              <Details item={item} />
            </div>
          ))}
        </div>
      );

    case "projects":
      return (
        <div className="grid grid-cols-2 items-start gap-x-[2em] gap-y-[2em]">
          {items.map((item, idx) => (
            <div key={idx} className="min-w-0 break-inside-avoid-page">
              <MetaLine parts={[year(item.startDate || item.endDate), item.organization]} />
              <p className="mb-[0.5em] mt-[0.2em] break-words text-[1.3em] font-bold leading-tight">
                {item.name || "Project Name"}
              </p>
              <Details item={item} />
            </div>
          ))}
        </div>
      );

    case "references":
      return (
        <div className="grid grid-cols-2 gap-x-[2em] gap-y-[1.5em]">
          {items.map((item, idx) => (
            <div key={idx} className="min-w-0 break-inside-avoid-page">
              <p className="mb-[0.2em] text-[1.3em] font-bold leading-tight">{item.name || "Reference Name"}</p>
              {(item.title || item.company) && (
                <p>
                  {item.title}
                  {item.title && item.company && " at "}
                  {item.company}
                </p>
              )}
              {item.relationship && <p className="italic">{item.relationship}</p>}
              {item.email && <p className="break-all">{item.email}</p>}
              {item.phone && <p>{item.phone}</p>}
            </div>
          ))}
        </div>
      );

    case "education":
      return (
        <div className="space-y-[1.5em]">
          {items.map((item, idx) => (
            <div key={idx} className="break-inside-avoid-page">
              {range(item) && <p className="mb-[0.2em] text-neutral-700">{range(item)}</p>}
              <p className="mb-[0.2em]">{item.institution || "University"}</p>
              <p className="text-[1.25em] font-bold leading-tight">{item.degree || "Degree"}</p>
              {item.field && <p>{item.field}</p>}
              {item.location && <p>{item.location}</p>}
              {item.gpa && <p>GPA: {item.gpa}</p>}
              {item.description && <p className="mt-[0.5em] text-justify">{item.description}</p>}
            </div>
          ))}
        </div>
      );

    case "skills":
      return (
        <div className="space-y-[0.9em]">
          {items.map((item, idx) => (
            <p key={idx} className="break-inside-avoid text-justify">
              {item.category && <span className="font-bold">{item.category}: </span>}
              {(item.skills ?? []).join(", ")}
            </p>
          ))}
        </div>
      );

    case "languages":
      return (
        <div className="space-y-[0.6em]">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-[0.75em] break-inside-avoid">
              <span className="font-bold">{item.language}</span>
              <span className="text-neutral-700">{item.proficiency}</span>
            </div>
          ))}
        </div>
      );

    case "certifications":
      return (
        <BulletList
          lines={items.map((item) => (
            <>
              {item.name || "Certification"}
              {(item.issuer || item.date) && (
                <span className="block text-neutral-700">
                  {[item.issuer, item.date].filter(Boolean).join(" · ")}
                </span>
              )}
              {item.expiryDate && <span className="block text-neutral-700">Expires: {item.expiryDate}</span>}
              {item.url && (
                <span className="block break-all">
                  {item.url.startsWith("http") ? item.url : `https://${item.url}`}
                </span>
              )}
            </>
          ))}
        />
      );

    // "custom" and any unknown section type: simple bullet list
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

export function ExecutiveTemplate({ content, theme }: ExecutiveTemplateProps) {
  const { basics, summary, sections } = content;

  const visible = sections.filter((s) => s.visible);
  const leftSections = visible.filter((s) => !RIGHT_COLUMN.has(s.type as string));
  const rightSections = visible.filter((s) => RIGHT_COLUMN.has(s.type as string));

  const lineHeight = theme.spacing === "compact" ? 1.3 : theme.spacing === "relaxed" ? 1.6 : 1.42;
  const sizeScale = theme.fontSize === "small" ? 0.925 : theme.fontSize === "large" ? 1.075 : 1;

  // 1em = 1/65 of the printable width (10px on A4 with normal margins), so the
  // whole design scales with the page instead of using fixed pixel sizes.
  const fontSize = `calc(100cqw / 65 * ${sizeScale})`;

  const renderSection = (section: Section, compact: boolean) => {
    const type = section.type as string;
    const title = section.title || DEFAULT_TITLES[type] || type;

    // Empty sections are hidden in the reference design.
    if (!section.items?.length) return null;

    return (
      <section key={section.id} className="mb-[3em]">
        <SectionTitle compact={compact}>{title}</SectionTitle>
        {renderSectionBody(section)}
      </section>
    );
  };

  return (
    // Container so `cqw` above resolves to the printable-area width.
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <div
        className="box-border flex w-full items-start gap-[2.5em] bg-white text-black"
        style={
          {
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
        {/* ───────── Left column (≈30%) ───────── */}
        <div className="w-[19.5em] shrink-0">
          {/* Photo: 6:7 portrait */}
          <div className="mb-[2em] flex aspect-[6/7] w-full items-center justify-center overflow-hidden bg-neutral-100">
            {basics.photo ? (
              <img src={basics.photo} alt={basics.fullName || "Profile"} className="h-full w-full object-cover" />
            ) : basics.fullName ? (
              <span className="text-[5em] font-bold text-gray-300">
                {basics.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            ) : (
              <span className="text-[1.5em] text-gray-400">Photo</span>
            )}
          </div>

          {/* Contact */}
          <div className="mb-[3em] space-y-[1em]">
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
              <div key={idx} className="flex min-w-0 items-start gap-[0.75em] text-black">
                <div
                  style={{
                    width: "1.25em",
                    height: "1.25em",
                    minWidth: "1.25em",
                    backgroundColor: "currentColor",
                    WebkitMask: `url(${getIconPath(link.label)}) no-repeat center / contain`,
                    mask: `url(${getIconPath(link.label)}) no-repeat center / contain`,
                  }}
                />
                <span className="min-w-0 break-all">{extractUsername(link.url)}</span>
              </div>
            ))}
          </div>

          {leftSections.map((s) => renderSection(s, true))}
        </div>

        {/* ───────── Right column (≈66%) ───────── */}
        <div className="min-w-0 flex-1">
          {/* Name + headline: top of the name lines up with the top of the photo */}
          <div className="mb-[3em]">
            <div className="border-b-2 border-black pb-[1em]">
              <h1
                className="font-bold uppercase leading-[1.1] text-black"
                style={{ fontSize: "3.1em", letterSpacing: "0.01em" }}
              >
                {basics.fullName || "Your Name"}
              </h1>
            </div>
            {basics.headline && (
              <h2 className="mt-[0.8em] text-[1.7em] font-normal leading-tight text-neutral-800">
                {basics.headline}
              </h2>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <section className="mb-[3em]">
              <SectionTitle>Professional Summary</SectionTitle>
              <p className="text-justify">{summary}</p>
            </section>
          )}

          {rightSections.map((s) => renderSection(s, false))}
        </div>
      </div>
    </div>
  );
}