import { ResumeContent, Theme } from "@/types";
import Image from "next/image";

type ProfessionalTemplateProps = {
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

export function ProfessionalTemplate({ content, theme }: ProfessionalTemplateProps) {
  const { basics, summary, sections } = content;

  // Helper to find section by type
  const getSection = (type: string) => sections.find(s => s.type === type && s.visible);

  return (
    <div
      className="bg-white text-black px-8 py-6"
      style={{
        fontFamily:
          theme.font === "times"
            ? "Times New Roman, serif"
            : theme.font === "roboto"
              ? "Roboto, sans-serif"
              : theme.font === "arial"
                ? "Arial, sans-serif"
                : "Inter, sans-serif",
        fontSize: theme.fontSize === "small" ? "11px" : theme.fontSize === "large" ? "13px" : "12px",
        lineHeight: theme.spacing === "compact" ? "1.4" : theme.spacing === "relaxed" ? "1.7" : "1.5",
      }}
    >
      {/* Header - Name and Title */}
      <div className="mb-2">
        <h1 className="text-4xl font-bold uppercase mb-1" style={{ letterSpacing: '0.1em' }}>
          {basics.fullName || "ESTELLE DARCY"}
        </h1>
        {basics.headline && (
          <h2 className="text-xl font-bold uppercase mb-2">
            {basics.headline}
          </h2>
        )}
        {/* Contact Info - Single Line */}
        <div className="text-sm">
          {[
            basics.location,
            basics.email,
            basics.website ? (basics.website.startsWith('http') ? basics.website : `https://${basics.website}`) : null,
            basics.phone
          ]
            .filter(Boolean)
            .join(" | ")}
        </div>
        {/* Social Links */}
        {basics.links && basics.links.length > 0 && (
          <div className="text-xs mt-1 flex flex-wrap gap-x-2 gap-y-1 text-black">
            {basics.links.map((link, idx) => {
              return (
                <span key={idx} className="inline-flex items-center gap-1">
                  <div style={{ 
                    width: '12px', 
                    height: '12px',
                    backgroundColor: 'currentColor',
                    WebkitMask: `url(${getIconPath(link.label)}) no-repeat center / contain`,
                    mask: `url(${getIconPath(link.label)}) no-repeat center / contain`
                  }} />
                  <span>{extractUsername(link.url)}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Thick Horizontal Line */}
      <div className="border-t-[2.5px] border-black mb-3"></div>

      {/* Summary Section */}
      {summary && (
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-1.5 break-after-avoid">SUMMARY</h3>
          <div className="border-b border-gray-400 mb-2"></div>
          <p className="text-sm leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {getSection("experience") && getSection("experience")!.items.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-1.5 break-after-avoid">PROFESSIONAL EXPERIENCE</h3>
          <div className="border-b border-gray-400 mb-2"></div>
          <div className="space-y-2.5">
            {getSection("experience")!.items.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm">
                    <span className="font-bold">{item.company || item.organization}</span>
                    {item.position && <span>, {item.position}</span>}
                  </p>
                  <p className="text-sm whitespace-nowrap ml-4">
                    {item.startDate && (
                      <>
                        {new Date(item.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                        {" - "}
                        {item.current
                          ? "Present"
                          : item.endDate
                            ? new Date(item.endDate).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })
                            : "Present"}
                      </>
                    )}
                  </p>
                </div>
                {(item.description || (item.highlights && item.highlights.length > 0)) && (
                  <ul className="list-disc ml-5 space-y-0.5">
                    {item.description
                      ? item.description.split("\n").filter((line: string) => line.trim()).map((line: string, i: number) => (
                          <li key={i} className="text-sm leading-relaxed">
                            {line.trim()}
                          </li>
                        ))
                      : item.highlights?.map((highlight: string, i: number) => (
                          <li key={i} className="text-sm leading-relaxed">
                            {highlight}
                          </li>
                        ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {getSection("projects") && getSection("projects")!.items.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-1.5 break-after-avoid">PROJECTS</h3>
          <div className="border-b border-gray-400 mb-2"></div>
          <div className="space-y-2.5">
            {getSection("projects")!.items.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm font-bold">{item.name || "Project Name"}</p>
                  <p className="text-sm whitespace-nowrap ml-4">
                    {item.startDate && item.endDate && (
                      <>
                        {new Date(item.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                        {" - "}
                        {new Date(item.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </p>
                </div>
                {item.organization && <p className="text-sm mb-0.5">{item.organization}</p>}
                {(item.description || (item.highlights && item.highlights.length > 0)) && (
                  <ul className="list-disc ml-5 space-y-0.5">
                    {item.description
                      ? item.description.split("\n").filter((line: string) => line.trim()).map((line: string, i: number) => (
                          <li key={i} className="text-sm leading-relaxed">
                            {line.trim()}
                          </li>
                        ))
                      : item.highlights?.map((highlight: string, i: number) => (
                          <li key={i} className="text-sm leading-relaxed">
                            {highlight}
                          </li>
                        ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {getSection("skills") && getSection("skills")!.items.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-1.5 break-after-avoid">SKILLS</h3>
          <div className="border-b border-gray-400 mb-2"></div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            {getSection("skills")!.items.map((item, idx) => {
              const displayText = item.category || 
                                 item.name || 
                                 item.skill || 
                                 (item.skills && Array.isArray(item.skills) ? item.skills.join(", ") : "Skill");
              return (
                <div key={idx} className="text-sm">
                  {displayText}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {getSection("education") && getSection("education")!.items.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-1.5 break-after-avoid">EDUCATION</h3>
          <div className="border-b border-gray-400 mb-2"></div>
          <div className="space-y-2">
            {getSection("education")!.items.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm font-bold">
                    {item.degree || "Bachelor"} {item.field && `of ${item.field} in ${item.field}`}
                  </p>
                  <p className="text-sm whitespace-nowrap ml-4">
                    {item.startDate && item.endDate && (
                      <>
                        {new Date(item.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                        {" - "}
                        {item.current ? "Present" : new Date(item.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </p>
                </div>
                <p className="text-sm">{item.institution || "University Name"}</p>
                {item.description && (
                  <ul className="list-disc ml-5 mt-0.5">
                    {item.description.split("\n").filter((line: string) => line.trim()).map((line: string, i: number) => (
                      <li key={i} className="text-sm leading-relaxed">
                        {line.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      {(getSection("languages") || getSection("certifications") || getSection("custom")) && (
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-1.5 break-after-avoid">ADDITIONAL INFORMATION</h3>
          <div className="border-b border-gray-400 mb-2"></div>
          
          {/* Languages */}
          {getSection("languages") && getSection("languages")!.items.length > 0 && (
            <div className="mb-1">
              <p className="text-sm">
                <span className="font-bold">Languages:</span>{" "}
                {getSection("languages")!.items.map((item, idx) => (
                  <span key={idx}>
                    {item.language || "Language"}
                    {item.proficiency && ` (${item.proficiency})`}
                    {idx < getSection("languages")!.items.length - 1 && ", "}
                  </span>
                ))}
                .
              </p>
            </div>
          )}

          {/* Certifications */}
          {getSection("certifications") && getSection("certifications")!.items.length > 0 && (
            <div className="mb-1">
              <p className="text-sm">
                <span className="font-bold">Certifications:</span>{" "}
                {getSection("certifications")!.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name || "Certification"}
                    {item.issuer && ` (${item.issuer})`}
                    {idx < getSection("certifications")!.items.length - 1 && ", "}
                  </span>
                ))}
                .
              </p>
            </div>
          )}

          {/* Awards/Activities - from custom section */}
          {getSection("custom") && getSection("custom")!.items.length > 0 && (
            <div className="mb-1">
              <p className="text-sm">
                <span className="font-bold">Awards/Activities:</span>{" "}
                {getSection("custom")!.items.map((item, idx) => (
                  <span key={idx}>
                    {item.title || item.name}
                    {item.subtitle && ` (${item.subtitle})`}
                    {item.date && ` (${new Date(item.date).getFullYear()})`}
                    {idx < getSection("custom")!.items.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      )}

      {/* References */}
      {getSection("references") && getSection("references")!.items.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-bold uppercase mb-1.5 break-after-avoid">REFERENCES</h3>
          <div className="border-b border-gray-400 mb-2"></div>
          <div className="space-y-2">
            {getSection("references")!.items.map((item, idx) => (
              <div key={idx}>
                <p className="text-sm font-bold">{item.name || "Reference Name"}</p>
                {(item.title || item.company) && (
                  <p className="text-sm">
                    {item.title}
                    {item.title && item.company && " at "}
                    {item.company}
                  </p>
                )}
                {(item.email || item.phone) && (
                  <p className="text-sm">
                    {item.email}
                    {item.email && item.phone && " | "}
                    {item.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
