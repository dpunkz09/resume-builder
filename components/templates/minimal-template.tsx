import { ResumeContent, Theme } from "@/types";
import Image from "next/image";

type MinimalTemplateProps = {
  content: ResumeContent;
  theme: Theme;
};

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
  let cleaned = url.replace(/^https?:\/\//, '');
  cleaned = cleaned.replace(/^www\./, '');
  const parts = cleaned.split('/');
  if (parts.length > 1) {
    return parts.slice(1).join('/').replace(/^@/, '');
  }
  return cleaned;
};

export function MinimalTemplate({ content, theme }: MinimalTemplateProps) {
  const { basics, summary, sections } = content;

  return (
    <div
      className="bg-white"
      style={{
        fontFamily:
          theme.font === "inter"
            ? "Inter, sans-serif"
            : theme.font === "roboto"
              ? "Roboto, sans-serif"
              : theme.font === "times"
                ? "Times New Roman, serif"
                : "Arial, sans-serif",
        fontSize:
          theme.fontSize === "small" ? "12px" : theme.fontSize === "large" ? "14px" : "13px",
        lineHeight:
          theme.spacing === "compact" ? "1.3" : theme.spacing === "relaxed" ? "1.7" : "1.5",
      }}
    >
      {/* Header - Minimal centered design */}
      <div className="mb-8 text-center">
        <h1
          className="text-2xl font-light tracking-wide"
          style={{ color: theme.color, letterSpacing: "0.1em" }}
        >
          {basics.fullName || "YOUR NAME"}
        </h1>
        {basics.headline && (
          <p className="mt-2 text-sm text-gray-600 font-light">{basics.headline}</p>
        )}

        {/* Contact Info - single line */}
        <div className="mt-3 flex justify-center flex-wrap gap-x-3 text-xs text-gray-600">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>•</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.location && <span>•</span>}
          {basics.location && <span>{basics.location}</span>}
          {basics.website && <span>•</span>}
          {basics.website && (
            <a href={basics.website.startsWith('http') ? basics.website : `https://${basics.website}`} style={{ color: theme.color }}>
              {basics.website.startsWith('http') ? basics.website : `https://${basics.website}`}
            </a>
          )}
        </div>

        {/* Social Links */}
        {basics.links.length > 0 && (
          <div className="mt-2 flex justify-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700">
            {basics.links.map((link, idx) => (
              <div key={idx} className="inline-flex items-center gap-1">
                <div style={{ 
                  width: '12px', 
                  height: '12px',
                  backgroundColor: theme.color,
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
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed text-center italic">{summary}</p>
        </div>
      )}

      {/* Sections - minimal styling */}
      {sections
        .filter((section) => section.visible)
        .map((section) => (
          <div key={section.id} className="mb-6 break-inside-avoid-page">
            <h2
              className="mb-4 text-sm font-light uppercase tracking-widest text-center break-after-avoid"
              style={{ color: theme.color, letterSpacing: "0.15em" }}
            >
              {section.title}
            </h2>

            {section.items.length === 0 ? (
              <p className="text-sm italic text-gray-400 text-center">
                No {section.title.toLowerCase()} added yet
              </p>
            ) : (
              <div className="space-y-4">
                {section.type === "experience" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-medium text-gray-900">{item.position}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-700">{item.company}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.startDate && (
                            <span>
                              {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.location && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-700 italic">{item.description}</p>
                      )}
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm">
                          {item.highlights.map((highlight: string, hIdx: number) => (
                            <li
                              key={hIdx}
                              className="text-gray-700 pl-4 relative before:content-['—'] before:absolute before:left-0"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {section.type === "education" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-medium text-gray-900">{item.degree}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-700">{item.institution}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.startDate && (
                            <span>
                              {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                            </span>
                          )}
                        </div>
                      </div>
                      {(item.field || item.location || item.gpa) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.field}
                          {item.field && item.location && " • "}
                          {item.location}
                          {(item.field || item.location) && item.gpa && " • "}
                          {item.gpa && `GPA: ${item.gpa}`}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                      )}
                    </div>
                  ))}

                {section.type === "skills" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid">
                      <div className="text-center">
                        <span className="font-medium text-gray-900">{item.category}: </span>
                        <span className="text-gray-700">{item.skills.join(" • ")}</span>
                      </div>
                    </div>
                  ))}

                {section.type === "certifications" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-700">{item.issuer}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.date && <span>{item.date}</span>}
                        </div>
                      </div>
                      {item.expiryDate && (
                        <p className="text-xs text-gray-500 mt-0.5">Expires: {item.expiryDate}</p>
                      )}
                      {item.url && (
                        <a 
                          href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                          className="text-xs mt-0.5 hover:underline break-all block" 
                          style={{ color: theme.color }}
                        >
                          {item.url.startsWith('http') ? item.url : `https://${item.url}`}
                        </a>
                      )}
                    </div>
                  ))}

                {section.type === "projects" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.startDate && (
                            <span>
                              {item.startDate}
                              {item.endDate && ` - ${item.endDate}`}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.url && (
                        <a 
                          href={item.url}
                          className="text-xs hover:underline block mt-0.5" 
                          style={{ color: theme.color }}
                        >
                          {item.url}
                        </a>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-700">{item.description}</p>
                      )}
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm">
                          {item.highlights.map((highlight: string, hIdx: number) => (
                            <li
                              key={hIdx}
                              className="text-gray-700 pl-4 relative before:content-['—'] before:absolute before:left-0"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {section.type === "custom" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between items-baseline">
                        <span className="font-medium text-gray-900">{item.title}</span>
                        {item.date && (
                          <span className="text-sm text-gray-500">{item.date}</span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-sm text-gray-700 mt-0.5">{item.subtitle}</p>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-700">{item.description}</p>
                      )}
                    </div>
                  ))}

                {section.type === "languages" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid text-center">
                      <span className="font-medium text-gray-900">{item.language}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">{item.proficiency}</span>
                    </div>
                  ))}

                {section.type === "references" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-700">{item.title}</p>
                        {item.company && <p className="text-xs text-gray-600">{item.company}</p>}
                        {item.relationship && (
                          <p className="text-xs text-gray-600 italic">{item.relationship}</p>
                        )}
                        {item.email && <p className="text-xs text-gray-600 mt-1">{item.email}</p>}
                        {item.phone && <p className="text-xs text-gray-600">{item.phone}</p>}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
