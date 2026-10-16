import { ResumeContent, Theme } from "@/types";
import Image from "next/image";

type ClassicTemplateProps = {
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

export function ClassicTemplate({ content, theme }: ClassicTemplateProps) {
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
      {/* Header */}
      <div className="mb-6 border-b-2 pb-4" style={{ borderColor: theme.color }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.color }}>
          {basics.fullName || "Your Name"}
        </h1>
        {basics.headline && <p className="mt-1 text-lg text-gray-700">{basics.headline}</p>}

        {/* Contact Info */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.location && <span>{basics.location}</span>}
          {basics.website && (
            <a href={basics.website.startsWith('http') ? basics.website : `https://${basics.website}`} className="hover:underline" style={{ color: theme.color }}>
              {basics.website.startsWith('http') ? basics.website : `https://${basics.website}`}
            </a>
          )}
        </div>

        {/* Social Links */}
        {basics.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {basics.links.map((link, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5"
              >
                <div style={{ 
                  width: '14px', 
                  height: '14px',
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
          <h2
            className="mb-2 text-lg font-semibold uppercase tracking-wide break-after-avoid"
            style={{ color: theme.color }}
          >
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Sections */}
      {sections
        .filter((section) => section.visible)
        .map((section) => (
          <div key={section.id} className="mb-6 break-inside-avoid-page">
            <h2
              className="mb-3 text-lg font-semibold uppercase tracking-wide break-after-avoid"
              style={{ color: theme.color }}
            >
              {section.title}
            </h2>

            {/* Section Items */}
            {section.items.length === 0 ? (
              <p className="text-sm italic text-gray-400">
                No {section.title.toLowerCase()} added yet
              </p>
            ) : (
              <div className="space-y-4">
                {section.type === "experience" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.position}</h3>
                          <p className="text-gray-700">{item.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {item.startDate && (
                            <span>
                              {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                            </span>
                          )}
                          {item.location && <p>{item.location}</p>}
                        </div>
                      </div>
                      {item.description && (
                        <p className="mt-2 text-gray-700 text-sm italic">{item.description}</p>
                      )}
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-2 list-disc pl-5 space-y-1">
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
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.degree}</h3>
                          <p className="text-gray-700">{item.institution}</p>
                          {item.field && <p className="text-sm text-gray-600">{item.field}</p>}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {item.startDate && (
                            <p>
                              {item.startDate} - {item.current ? "Present" : item.endDate || ""}
                            </p>
                          )}
                          {item.location && <p>{item.location}</p>}
                        </div>
                      </div>
                      {item.gpa && <p className="mt-1 text-sm text-gray-600">GPA: {item.gpa}</p>}
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-700">{item.description}</p>
                      )}
                    </div>
                  ))}

                {section.type === "skills" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid">
                      <div className="flex gap-3">
                        <span className="font-semibold text-gray-900 min-w-[120px]">
                          {item.category}:
                        </span>
                        <span className="text-gray-700">{item.skills.join(", ")}</span>
                      </div>
                    </div>
                  ))}

                {section.type === "certifications" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-gray-700">{item.issuer}</p>
                          {item.url && (
                            <a 
                              href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                              className="text-sm hover:underline break-all" 
                              style={{ color: theme.color }}
                            >
                              {item.url.startsWith('http') ? item.url : `https://${item.url}`}
                            </a>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {item.date && <p>{item.date}</p>}
                          {item.expiryDate && <p className="text-xs">Expires: {item.expiryDate}</p>}
                        </div>
                      </div>
                    </div>
                  ))}

                {section.type === "projects" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          {item.url && (
                            <a 
                              href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                              className="text-sm hover:underline" 
                              style={{ color: theme.color }}
                            >
                              {item.url}
                            </a>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {item.startDate && (
                            <span>
                              {item.startDate}
                              {item.endDate && ` - ${item.endDate}`}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.description && (
                        <p className="mt-2 text-gray-700">{item.description}</p>
                      )}
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-2 list-disc pl-5 space-y-1">
                          {item.highlights.map((highlight: string, hIdx: number) => (
                            <li key={hIdx} className="text-gray-700">
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
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.subtitle && <p className="text-gray-700">{item.subtitle}</p>}
                        </div>
                        {item.date && (
                          <div className="text-right text-sm text-gray-600">{item.date}</div>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-2 text-gray-700">{item.description}</p>
                      )}
                    </div>
                  ))}

                {section.type === "languages" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">{item.language}</span>
                        <span className="text-gray-600">{item.proficiency}</span>
                      </div>
                    </div>
                  ))}

                {section.type === "references" &&
                  section.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid-page">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-700">{item.title}</p>
                        {item.company && <p className="text-sm text-gray-600">{item.company}</p>}
                        {item.relationship && (
                          <p className="text-sm text-gray-600 italic">{item.relationship}</p>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {item.email && <p>{item.email}</p>}
                        {item.phone && <p>{item.phone}</p>}
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
