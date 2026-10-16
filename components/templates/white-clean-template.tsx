import { ResumeContent, Theme } from "@/types";
import Image from "next/image";

type WhiteCleanProps = {
  content: ResumeContent;
  theme: Theme;
};

const SIDEBAR_TYPES = ["skills", "languages", "certifications"];

// Map platform IDs to icon paths
const getIconPath = (label: string): string => {
  const labelLower = label.toLowerCase();
  if (labelLower.includes('linkedin')) return '/social-icons/linkedin.png';
  if (labelLower.includes('github')) return '/social-icons/github-sign.png';
  if (labelLower.includes('twitter') || labelLower.includes('x.com')) return '/social-icons/twitter.png';
  if (labelLower.includes('instagram')) return '/social-icons/instagram.png';
  if (labelLower.includes('youtube')) return '/social-icons/video.png';
  if (labelLower.includes('email') || labelLower.includes('gmail')) return '/social-icons/gmail.png';
  if (labelLower.includes('facebook')) return '/social-icons/facebook.png';
  return '/social-icons/others.png';
};

// Extract username from social media URL
const extractUsername = (url: string): string => {
  // Remove protocol
  let cleaned = url.replace(/^https?:\/\//, '');
  // Remove www.
  cleaned = cleaned.replace(/^www\./, '');
  // Remove domain and get the path
  const parts = cleaned.split('/');
  if (parts.length > 1) {
    // Get everything after the domain
    return parts.slice(1).join('/').replace(/^@/, '');
  }
  // If it's just a domain or single word, return as is
  return cleaned;
};

export function WhiteClean({ content, theme }: WhiteCleanProps) {
  const { basics, summary, sections } = content;

  const visibleSections = sections.filter((section) => section.visible);
  const sidebarSections = visibleSections.filter((s) => SIDEBAR_TYPES.includes(s.type));
  const mainSections = visibleSections.filter((s) => !SIDEBAR_TYPES.includes(s.type));

  const fontFamily =
    theme.font === "inter"
      ? "Inter, sans-serif"
      : theme.font === "roboto"
        ? "Roboto, sans-serif"
        : theme.font === "times"
          ? "Times New Roman, serif"
          : "Arial, sans-serif";

  const fontSize =
    theme.fontSize === "small" ? "12px" : theme.fontSize === "large" ? "14px" : "13px";

  const lineHeight =
    theme.spacing === "compact" ? "1.3" : theme.spacing === "relaxed" ? "1.7" : "1.5";

  const printColors = {
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  } as React.CSSProperties;

  return (
    <div className="flex bg-white" style={{ fontFamily, fontSize, lineHeight, minHeight: "100%", pageBreakInside: "auto" }}>
      {/* Sidebar */}
      <aside
        className="w-[32%] shrink-0 px-5 py-8 text-white"
        style={{ backgroundColor: theme.color, ...printColors, pageBreakInside: "avoid" }}
      >
        {/* Profile Photo */}
        {basics.photo && (
          <div className="mb-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-white/20">
              <img 
                src={basics.photo} 
                alt={basics.fullName || "Profile"} 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest opacity-80">Contact</h2>
          <div className="space-y-1 break-words text-sm">
            {basics.email && <p>{basics.email}</p>}
            {basics.phone && <p>{basics.phone}</p>}
            {basics.location && <p>{basics.location}</p>}
            {basics.website && (
              <p>
                <a href={basics.website.startsWith('http') ? basics.website : `https://${basics.website}`} className="underline">
                  {basics.website.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        {basics.links.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest opacity-80">Links</h2>
            <div className="space-y-2 text-sm text-white">
              {basics.links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div style={{ 
                    width: '16px', 
                    height: '16px',
                    backgroundColor: 'white',
                    WebkitMask: `url(${getIconPath(link.label)}) no-repeat center / contain`,
                    mask: `url(${getIconPath(link.label)}) no-repeat center / contain`
                  }} />
                  <span className="break-all">{extractUsername(link.url)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar sections */}
        {sidebarSections.map((section) => (
          <div key={section.id} className="mb-6 break-inside-avoid">
            <h2 className="mb-2 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-widest">
              {section.title}
            </h2>

            {section.items.length === 0 ? (
              <p className="text-xs italic opacity-70">
                No {section.title.toLowerCase()} added yet
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                {section.type === "skills" &&
                  section.items.map((item, idx) => (
                    <div key={idx}>
                      <p className="font-semibold">{item.category}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.skills.map((skill: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="rounded-full bg-white/20 px-2 py-0.5 text-xs"
                            style={printColors}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                {section.type === "languages" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between gap-2">
                      <span className="font-semibold">{item.language}</span>
                      <span className="text-xs opacity-80">{item.proficiency}</span>
                    </div>
                  ))}

                {section.type === "certifications" &&
                  section.items.map((item, idx) => (
                    <div key={idx}>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs opacity-90">{item.issuer}</p>
                      {item.date && <p className="text-xs opacity-70">{item.date}</p>}
                      {item.expiryDate && (
                        <p className="text-xs opacity-70">Expires: {item.expiryDate}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* Main column */}
      <main className="flex-1 px-7 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1
            className="text-4xl font-extrabold leading-tight tracking-tight"
            style={{ color: theme.color }}
          >
            {basics.fullName || "Your Name"}
          </h1>
          {basics.headline && (
            <p className="mt-1 text-lg uppercase tracking-wide text-gray-600">{basics.headline}</p>
          )}
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <SectionHeading color={theme.color}>Profile</SectionHeading>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {/* Main sections */}
        {mainSections.map((section) => (
          <section key={section.id} className="mb-6">
            <SectionHeading color={theme.color}>{section.title}</SectionHeading>

            {section.items.length === 0 ? (
              <p className="text-sm italic text-gray-400">
                No {section.title.toLowerCase()} added yet
              </p>
            ) : (
              <div className="space-y-4">
                {section.type === "experience" &&
                  section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="break-inside-avoid-page border-l-2 pl-4"
                      style={{ borderColor: theme.color, pageBreakInside: "avoid" }}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-semibold text-gray-900">{item.position}</h3>
                        {item.startDate && (
                          <span className="shrink-0 text-xs font-medium text-gray-500">
                            {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">
                        {item.company}
                        {item.location && <span className="text-gray-500"> · {item.location}</span>}
                      </p>
                      {item.description && (
                        <p className="mt-2 text-sm italic text-gray-700">{item.description}</p>
                      )}
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {item.highlights.map((highlight: string, hIdx: number) => (
                            <li key={hIdx} className="text-gray-700">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {section.type === "education" &&
                  section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="break-inside-avoid-page border-l-2 pl-4"
                      style={{ borderColor: theme.color, pageBreakInside: "avoid" }}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-semibold text-gray-900">{item.degree}</h3>
                        {item.startDate && (
                          <span className="shrink-0 text-xs font-medium text-gray-500">
                            {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">
                        {item.institution}
                        {item.location && <span className="text-gray-500"> · {item.location}</span>}
                      </p>
                      {item.field && <p className="text-sm text-gray-600">{item.field}</p>}
                      {item.gpa && <p className="mt-1 text-sm text-gray-600">GPA: {item.gpa}</p>}
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-700">{item.description}</p>
                      )}
                    </div>
                  ))}

                {section.type === "references" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page" style={{ pageBreakInside: "avoid" }}>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-700">
                        {item.title}
                        {item.company && <span className="text-gray-500"> · {item.company}</span>}
                      </p>
                      {item.relationship && (
                        <p className="text-sm italic text-gray-600">{item.relationship}</p>
                      )}
                      <div className="mt-1 text-sm text-gray-600">
                        {item.email && <p>{item.email}</p>}
                        {item.phone && <p>{item.phone}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}

function SectionHeading({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <h2
      className="mb-3 border-b pb-1 text-sm font-bold uppercase tracking-widest break-after-avoid"
      style={{ color, borderColor: color }}
    >
      {children}
    </h2>
  );
}