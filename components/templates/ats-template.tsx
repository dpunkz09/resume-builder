import { ResumeContent, Theme } from "@/types";
import Image from "next/image";

type ATSTemplateProps = {
  content: ResumeContent;
  theme: Theme;
};

// Map platform IDs to icon paths (for ATS, keep it simple - just text)
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
  let cleaned = url.replace(/^https?:\/\//, '');
  cleaned = cleaned.replace(/^www\./, '');
  const parts = cleaned.split('/');
  if (parts.length > 1) {
    return parts.slice(1).join('/').replace(/^@/, '');
  }
  return cleaned;
};

export function ATSTemplate({ content, theme }: ATSTemplateProps) {
  const { basics, summary, sections } = content;

  return (
    <div
      className="bg-white"
      style={{
        fontFamily: "Arial, sans-serif", // Always use Arial for maximum ATS compatibility
        fontSize: "11px",
        lineHeight: "1.4",
        color: "#000000", // Pure black for best OCR
      }}
    >
      {/* Header - Plain text, no formatting */}
      <div className="mb-4">
        <h1 className="text-xl font-bold" style={{ marginBottom: "4px" }}>
          {basics.fullName || "YOUR NAME"}
        </h1>

        {/* Contact Info - Simple line breaks */}
        <div className="text-xs">
          {basics.email && <div>{basics.email}</div>}
          {basics.phone && <div>{basics.phone}</div>}
          {basics.location && <div>{basics.location}</div>}
          {basics.website && <div>{basics.website.startsWith('http') ? basics.website : `https://${basics.website}`}</div>}
          {basics.headline && <div style={{ marginTop: "4px" }}>{basics.headline}</div>}
        </div>

        {/* Social Links - Plain list for ATS */}
        {basics.links.length > 0 && (
          <div className="mt-1 text-xs space-y-0.5 text-black">
            {basics.links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div style={{ 
                  width: '12px', 
                  height: '12px',
                  backgroundColor: 'currentColor',
                  WebkitMask: `url(${getIconPath(link.label)}) no-repeat center / contain`,
                  mask: `url(${getIconPath(link.label)}) no-repeat center / contain`
                }} />
                <span>{extractUsername(link.url)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-1 break-after-avoid">PROFESSIONAL SUMMARY</h2>
          <p className="text-xs">{summary}</p>
        </div>
      )}

      {/* Sections - Completely plain, no decorations */}
      {sections
        .filter((section) => section.visible)
        .map((section) => (
          <div key={section.id} className="mb-4 break-inside-avoid-page">
            <h2 className="text-sm font-bold uppercase mb-2 break-after-avoid">{section.title.toUpperCase()}</h2>

            {section.items.length === 0 ? null : (
              <div className="space-y-3">
                {section.type === "experience" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page text-xs">
                      <div className="font-bold">{item.position}</div>
                      <div>{item.company}</div>
                      {item.startDate && (
                        <div>
                          {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                          {item.location && ` | ${item.location}`}
                        </div>
                      )}
                      {item.description && <div className="mt-1 italic">{item.description}</div>}
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-1 pl-4">
                          {item.highlights.map((highlight: string, hIdx: number) => (
                            <li key={hIdx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {section.type === "education" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page text-xs">
                      <div className="font-bold">{item.degree}</div>
                      <div>{item.institution}</div>
                      {item.field && <div>{item.field}</div>}
                      <div>
                        {item.startDate && (
                          <>
                            {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                          </>
                        )}
                        {item.location && ` | ${item.location}`}
                        {item.gpa && ` | GPA: ${item.gpa}`}
                      </div>
                      {item.description && <div className="mt-1">{item.description}</div>}
                    </div>
                  ))}

                {section.type === "skills" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid text-xs">
                      <div>
                        <span className="font-bold">{item.category}:</span> {item.skills.join(", ")}
                      </div>
                    </div>
                  ))}

                {section.type === "certifications" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page text-xs">
                      <div className="font-bold">{item.name}</div>
                      <div>
                        {item.issuer}
                        {item.date && ` | ${item.date}`}
                        {item.expiryDate && ` | Expires: ${item.expiryDate}`}
                      </div>
                      {item.url && <div className="break-all">{item.url.startsWith('http') ? item.url : `https://${item.url}`}</div>}
                    </div>
                  ))}

                {section.type === "projects" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page text-xs">
                      <div className="font-bold">{item.name}</div>
                      <div>
                        {item.startDate && (
                          <>
                            {item.startDate}
                            {item.endDate && ` - ${item.endDate}`}
                          </>
                        )}
                      </div>
                      {item.url && <div className="break-all">{item.url.startsWith('http') ? item.url : `https://${item.url}`}</div>}
                      {item.description && <div className="mt-1">{item.description}</div>}
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-1 pl-4">
                          {item.highlights.map((highlight: string, hIdx: number) => (
                            <li key={hIdx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {section.type === "custom" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page text-xs">
                      <div className="font-bold">{item.title}</div>
                      {item.subtitle && <div>{item.subtitle}</div>}
                      {item.date && <div>{item.date}</div>}
                      {item.description && <div className="mt-1">{item.description}</div>}
                    </div>
                  ))}

                {section.type === "languages" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid text-xs">
                      <div>
                        {item.language}: {item.proficiency}
                      </div>
                    </div>
                  ))}

                {section.type === "references" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page text-xs">
                      <div className="font-bold">{item.name}</div>
                      <div>{item.title}</div>
                      {item.company && <div>{item.company}</div>}
                      {item.relationship && <div>{item.relationship}</div>}
                      {item.email && <div>{item.email}</div>}
                      {item.phone && <div>{item.phone}</div>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
