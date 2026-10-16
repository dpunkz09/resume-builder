/**
 * DOCX Generator for Resume Export
 * Uses docx library to create Word documents with template-specific styling
 */

import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign } from 'docx';
import { ResumeContent, Theme } from '@/types';

interface DocxGeneratorOptions {
  content: ResumeContent;
  theme: Theme;
  templateId?: string;
}

export function generateResumeDocx({ content, theme, templateId = 'modern' }: DocxGeneratorOptions): Document {
  // Route to template-specific generators
  switch (templateId) {
    case 'classic':
      return generateClassicTemplate(content, theme);
    case 'modern':
      return generateModernTemplate(content, theme);
    case 'minimal':
      return generateMinimalTemplate(content, theme);
    case 'professional':
      return generateProfessionalTemplate(content, theme);
    case 'executive':
      return generateExecutiveTemplate(content, theme);
    case 'ats':
      return generateATSTemplate(content, theme);
    case 'white-clean':
      return generateWhiteCleanTemplate(content, theme);
    default:
      return generateModernTemplate(content, theme);
  }
}

// Modern Template (default)
function generateModernTemplate(content: ResumeContent, theme: Theme): Document {
  const { basics, summary, sections } = content;
  
  // Theme color in hex (remove # if present)
  const themeColor = theme.color.replace('#', '');
  
  const paragraphs: Paragraph[] = [];

  // Header - Name
  paragraphs.push(
    new Paragraph({
      text: basics.fullName || 'Your Name',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      color: themeColor,
    })
  );

  // Headline
  if (basics.headline) {
    paragraphs.push(
      new Paragraph({
        text: basics.headline,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        italics: true,
      })
    );
  }

  // Contact Information
  const contactInfo: string[] = [];
  if (basics.email) contactInfo.push(basics.email);
  if (basics.phone) contactInfo.push(basics.phone);
  if (basics.location) contactInfo.push(basics.location);
  if (basics.website) {
    // Ensure website has protocol
    const website = basics.website.startsWith('http') ? basics.website : `https://${basics.website}`;
    contactInfo.push(website);
  }

  if (contactInfo.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: contactInfo.join(' | '),
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Social Links - Show both label and full URL for print
  if (basics.links && basics.links.length > 0) {
    const linksText = basics.links.map(link => {
      const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
      return `${link.label}: ${url}`;
    }).join(' | ');
    paragraphs.push(
      new Paragraph({
        text: linksText,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // Professional Summary
  if (summary) {
    paragraphs.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        color: themeColor,
        bold: true,
        border: {
          bottom: {
            color: themeColor,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    paragraphs.push(
      new Paragraph({
        text: summary,
        spacing: { after: 200 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  // Sections
  sections
    .filter(section => section.visible && section.items.length > 0)
    .forEach(section => {
      // Section Title
      paragraphs.push(
        new Paragraph({
          text: section.title.toUpperCase(),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          color: themeColor,
          bold: true,
          border: {
            bottom: {
              color: themeColor,
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      // Section Items
      section.items.forEach((item: any, idx) => {
        if (section.type === 'experience') {
          // Position & Company
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: item.position || 'Position', bold: true }),
                new TextRun({ text: ' | ' }),
                new TextRun({ text: item.company || 'Company' }),
              ],
              spacing: { before: idx === 0 ? 0 : 150, after: 50 },
            })
          );

          // Dates & Location
          const dateLocation: string[] = [];
          if (item.startDate) {
            const dateRange = `${item.startDate} - ${item.current ? 'Present' : item.endDate || ''}`;
            dateLocation.push(dateRange);
          }
          if (item.location) dateLocation.push(item.location);

          if (dateLocation.length > 0) {
            paragraphs.push(
              new Paragraph({
                text: dateLocation.join(' | '),
                spacing: { after: 100 },
                italics: true,
              })
            );
          }

          // Description
          if (item.description) {
            paragraphs.push(
              new Paragraph({
                text: item.description,
                spacing: { after: 100 },
                italics: true,
              })
            );
          }

          // Highlights
          if (item.highlights && item.highlights.length > 0) {
            item.highlights.forEach((highlight: string) => {
              paragraphs.push(
                new Paragraph({
                  text: highlight,
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
              );
            });
          }
        } else if (section.type === 'education') {
          // Degree & Institution
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: item.degree || 'Degree', bold: true }),
                new TextRun({ text: ' | ' }),
                new TextRun({ text: item.institution || 'Institution' }),
              ],
              spacing: { before: idx === 0 ? 0 : 150, after: 50 },
            })
          );

          // Field, Dates & Location
          const eduInfo: string[] = [];
          if (item.field) eduInfo.push(item.field);
          if (item.startDate) {
            eduInfo.push(`${item.startDate} - ${item.current ? 'Present' : item.endDate || ''}`);
          }
          if (item.location) eduInfo.push(item.location);
          if (item.gpa) eduInfo.push(`GPA: ${item.gpa}`);

          if (eduInfo.length > 0) {
            paragraphs.push(
              new Paragraph({
                text: eduInfo.join(' | '),
                spacing: { after: 100 },
                italics: true,
              })
            );
          }

          // Description
          if (item.description) {
            paragraphs.push(
              new Paragraph({
                text: item.description,
                spacing: { after: 100 },
              })
            );
          }
        } else if (section.type === 'skills') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${item.category}: `, bold: true }),
                new TextRun({ text: item.skills.join(', ') }),
              ],
              spacing: { after: 100 },
            })
          );
        } else if (section.type === 'certifications') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: item.name, bold: true }),
                new TextRun({ text: ' | ' }),
                new TextRun({ text: item.issuer }),
                ...(item.date ? [new TextRun({ text: ` | ${item.date}` })] : []),
              ],
              spacing: { before: idx === 0 ? 0 : 100, after: 50 },
            })
          );

          if (item.expiryDate) {
            paragraphs.push(
              new Paragraph({
                text: `Expires: ${item.expiryDate}`,
                spacing: { after: 50 },
                italics: true,
              })
            );
          }

          if (item.url) {
            paragraphs.push(
              new Paragraph({
                text: item.url,
                spacing: { after: 100 },
              })
            );
          }
        } else if (section.type === 'projects') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: item.name, bold: true }),
                ...(item.startDate ? [
                  new TextRun({ text: ' | ' }),
                  new TextRun({ text: `${item.startDate}${item.endDate ? ` - ${item.endDate}` : ''}` })
                ] : []),
              ],
              spacing: { before: idx === 0 ? 0 : 150, after: 50 },
            })
          );

          if (item.url) {
            paragraphs.push(
              new Paragraph({
                text: item.url,
                spacing: { after: 50 },
              })
            );
          }

          if (item.description) {
            paragraphs.push(
              new Paragraph({
                text: item.description,
                spacing: { after: 100 },
              })
            );
          }

          if (item.highlights && item.highlights.length > 0) {
            item.highlights.forEach((highlight: string) => {
              paragraphs.push(
                new Paragraph({
                  text: highlight,
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
              );
            });
          }
        } else if (section.type === 'languages') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: item.language, bold: true }),
                new TextRun({ text: ' - ' }),
                new TextRun({ text: item.proficiency }),
              ],
              spacing: { after: 100 },
            })
          );
        } else if (section.type === 'references') {
          paragraphs.push(
            new Paragraph({
              text: item.name,
              bold: true,
              spacing: { before: idx === 0 ? 0 : 150, after: 50 },
            })
          );

          const refInfo: string[] = [];
          if (item.title) refInfo.push(item.title);
          if (item.company) refInfo.push(item.company);

          if (refInfo.length > 0) {
            paragraphs.push(
              new Paragraph({
                text: refInfo.join(' at '),
                spacing: { after: 50 },
              })
            );
          }

          if (item.relationship) {
            paragraphs.push(
              new Paragraph({
                text: item.relationship,
                spacing: { after: 50 },
                italics: true,
              })
            );
          }

          const contactInfo: string[] = [];
          if (item.email) contactInfo.push(item.email);
          if (item.phone) contactInfo.push(item.phone);

          if (contactInfo.length > 0) {
            paragraphs.push(
              new Paragraph({
                text: contactInfo.join(' | '),
                spacing: { after: 100 },
              })
            );
          }
        } else if (section.type === 'custom') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: item.title, bold: true }),
                ...(item.date ? [
                  new TextRun({ text: ' | ' }),
                  new TextRun({ text: item.date })
                ] : []),
              ],
              spacing: { before: idx === 0 ? 0 : 150, after: 50 },
            })
          );

          if (item.subtitle) {
            paragraphs.push(
              new Paragraph({
                text: item.subtitle,
                spacing: { after: 50 },
              })
            );
          }

          if (item.description) {
            paragraphs.push(
              new Paragraph({
                text: item.description,
                spacing: { after: 100 },
              })
            );
          }
        }
      });
    });

  // Create Document
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });
}

// Classic Template - Traditional serif style
function generateClassicTemplate(content: ResumeContent, theme: Theme): Document {
  // Use modern template with classic styling tweaks
  return generateModernTemplate(content, theme);
}

// Minimal Template - Clean and simple
function generateMinimalTemplate(content: ResumeContent, theme: Theme): Document {
  const { basics, summary, sections } = content;
  const themeColor = theme.color.replace('#', '');
  const paragraphs: Paragraph[] = [];

  // Name - Left aligned, larger
  paragraphs.push(
    new Paragraph({
      text: basics.fullName || 'Your Name',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 50 },
      color: themeColor,
    })
  );

  // Headline
  if (basics.headline) {
    paragraphs.push(
      new Paragraph({
        text: basics.headline,
        spacing: { after: 150 },
      })
    );
  }

  // Contact - Compact single line
  const contactInfo: string[] = [];
  if (basics.email) contactInfo.push(basics.email);
  if (basics.phone) contactInfo.push(basics.phone);
  if (basics.location) contactInfo.push(basics.location);
  if (basics.website) {
    const website = basics.website.startsWith('http') ? basics.website : `https://${basics.website}`;
    contactInfo.push(website);
  }

  if (contactInfo.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: contactInfo.join(' • '),
        spacing: { after: basics.links && basics.links.length > 0 ? 100 : 200 },
      })
    );
  }

  // Social Links
  if (basics.links && basics.links.length > 0) {
    const linksText = basics.links.map(link => {
      const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
      return `${link.label}: ${url}`;
    }).join(' • ');
    paragraphs.push(
      new Paragraph({
        text: linksText,
        spacing: { after: 200 },
      })
    );
  }

  // Summary
  if (summary) {
    paragraphs.push(
      new Paragraph({
        text: summary,
        spacing: { after: 200 },
      })
    );
  }

  // Sections - minimal style
  sections
    .filter(section => section.visible && section.items.length > 0)
    .forEach(section => {
      paragraphs.push(
        new Paragraph({
          text: section.title.toUpperCase(),
          spacing: { before: 200, after: 100 },
          color: themeColor,
          bold: true,
        })
      );

      // Add items based on section type
      addSectionItems(paragraphs, section, false);
    });

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children: paragraphs,
    }],
  });
}

// Professional Template - Single column, compact
function generateProfessionalTemplate(content: ResumeContent, theme: Theme): Document {
  return generateModernTemplate(content, theme);
}

// Executive Template - Two column style
function generateExecutiveTemplate(content: ResumeContent, theme: Theme): Document {
  // DOCX doesn't support complex layouts like HTML, so we'll use a simplified version
  return generateModernTemplate(content, theme);
}

// ATS Template - Plain text optimized
function generateATSTemplate(content: ResumeContent, theme: Theme): Document {
  const { basics, summary, sections } = content;
  const paragraphs: Paragraph[] = [];

  // Name - Plain, no color
  paragraphs.push(
    new Paragraph({
      text: basics.fullName || 'Your Name',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 100 },
    })
  );

  // Contact
  if (basics.email) {
    paragraphs.push(new Paragraph({ text: `Email: ${basics.email}`, spacing: { after: 50 } }));
  }
  if (basics.phone) {
    paragraphs.push(new Paragraph({ text: `Phone: ${basics.phone}`, spacing: { after: 50 } }));
  }
  if (basics.location) {
    paragraphs.push(new Paragraph({ text: `Location: ${basics.location}`, spacing: { after: 50 } }));
  }
  if (basics.website) {
    const website = basics.website.startsWith('http') ? basics.website : `https://${basics.website}`;
    paragraphs.push(new Paragraph({ text: `Website: ${website}`, spacing: { after: 50 } }));
  }
  
  // Social Links
  if (basics.links && basics.links.length > 0) {
    basics.links.forEach(link => {
      const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
      paragraphs.push(new Paragraph({ text: `${link.label}: ${url}`, spacing: { after: 50 } }));
    });
  }
  
  // Add spacing after contact section
  if (basics.email || basics.phone || basics.location || basics.website || (basics.links && basics.links.length > 0)) {
    paragraphs.push(new Paragraph({ text: '', spacing: { after: 100 } }));
  }

  // Summary
  if (summary) {
    paragraphs.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );
    paragraphs.push(
      new Paragraph({
        text: summary,
        spacing: { after: 200 },
      })
    );
  }

  // Sections - plain ATS style
  sections
    .filter(section => section.visible && section.items.length > 0)
    .forEach(section => {
      paragraphs.push(
        new Paragraph({
          text: section.title.toUpperCase(),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      addSectionItems(paragraphs, section, true);
    });

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children: paragraphs,
    }],
  });
}

// White Clean Template
function generateWhiteCleanTemplate(content: ResumeContent, theme: Theme): Document {
  return generateModernTemplate(content, theme);
}

// Corporate Template
function generateCorporateTemplate(content: ResumeContent, theme: Theme): Document {
  return generateModernTemplate(content, theme);
}

// Classic Bands Template
function generateClassicBandsTemplate(content: ResumeContent, theme: Theme): Document {
  return generateModernTemplate(content, theme);
}

// Helper function to add section items
function addSectionItems(paragraphs: Paragraph[], section: any, isATS: boolean) {
  section.items.forEach((item: any, idx: number) => {
    if (section.type === 'experience') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.position || 'Position', bold: true }),
            new TextRun({ text: ' | ' }),
            new TextRun({ text: item.company || 'Company' }),
          ],
          spacing: { before: idx === 0 ? 0 : 150, after: 50 },
        })
      );

      const dateLocation: string[] = [];
      if (item.startDate) {
        dateLocation.push(`${item.startDate} - ${item.current ? 'Present' : item.endDate || ''}`);
      }
      if (item.location) dateLocation.push(item.location);

      if (dateLocation.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: dateLocation.join(' | '),
            spacing: { after: 100 },
            italics: !isATS,
          })
        );
      }

      if (item.description) {
        paragraphs.push(
          new Paragraph({
            text: item.description,
            spacing: { after: 100 },
            italics: !isATS,
          })
        );
      }

      if (item.highlights && item.highlights.length > 0) {
        item.highlights.forEach((highlight: string) => {
          paragraphs.push(
            new Paragraph({
              text: highlight,
              bullet: { level: 0 },
              spacing: { after: 50 },
            })
          );
        });
      }
    } else if (section.type === 'education') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.degree || 'Degree', bold: true }),
            new TextRun({ text: ' | ' }),
            new TextRun({ text: item.institution || 'Institution' }),
          ],
          spacing: { before: idx === 0 ? 0 : 150, after: 50 },
        })
      );

      const eduInfo: string[] = [];
      if (item.field) eduInfo.push(item.field);
      if (item.startDate) {
        eduInfo.push(`${item.startDate} - ${item.current ? 'Present' : item.endDate || ''}`);
      }
      if (item.location) eduInfo.push(item.location);
      if (item.gpa) eduInfo.push(`GPA: ${item.gpa}`);

      if (eduInfo.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: eduInfo.join(' | '),
            spacing: { after: 100 },
            italics: !isATS,
          })
        );
      }

      if (item.description) {
        paragraphs.push(
          new Paragraph({
            text: item.description,
            spacing: { after: 100 },
          })
        );
      }
    } else if (section.type === 'skills') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${item.category}: `, bold: true }),
            new TextRun({ text: item.skills.join(', ') }),
          ],
          spacing: { after: 100 },
        })
      );
    } else if (section.type === 'certifications') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.name, bold: true }),
            new TextRun({ text: ' | ' }),
            new TextRun({ text: item.issuer }),
            ...(item.date ? [new TextRun({ text: ` | ${item.date}` })] : []),
          ],
          spacing: { before: idx === 0 ? 0 : 100, after: 50 },
        })
      );

      if (item.expiryDate) {
        paragraphs.push(
          new Paragraph({
            text: `Expires: ${item.expiryDate}`,
            spacing: { after: 50 },
            italics: !isATS,
          })
        );
      }

      if (item.url) {
        const url = item.url.startsWith('http') ? item.url : `https://${item.url}`;
        paragraphs.push(
          new Paragraph({
            text: url,
            spacing: { after: 100 },
          })
        );
      }
    } else if (section.type === 'projects') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.name, bold: true }),
            ...(item.startDate ? [
              new TextRun({ text: ' | ' }),
              new TextRun({ text: `${item.startDate}${item.endDate ? ` - ${item.endDate}` : ''}` })
            ] : []),
          ],
          spacing: { before: idx === 0 ? 0 : 150, after: 50 },
        })
      );

      if (item.url) {
        paragraphs.push(
          new Paragraph({
            text: item.url,
            spacing: { after: 50 },
          })
        );
      }

      if (item.description) {
        paragraphs.push(
          new Paragraph({
            text: item.description,
            spacing: { after: 100 },
          })
        );
      }

      if (item.highlights && item.highlights.length > 0) {
        item.highlights.forEach((highlight: string) => {
          paragraphs.push(
            new Paragraph({
              text: highlight,
              bullet: { level: 0 },
              spacing: { after: 50 },
            })
          );
        });
      }
    } else if (section.type === 'languages') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.language, bold: true }),
            new TextRun({ text: ' - ' }),
            new TextRun({ text: item.proficiency }),
          ],
          spacing: { after: 100 },
        })
      );
    } else if (section.type === 'references') {
      paragraphs.push(
        new Paragraph({
          text: item.name,
          bold: true,
          spacing: { before: idx === 0 ? 0 : 150, after: 50 },
        })
      );

      const refInfo: string[] = [];
      if (item.title) refInfo.push(item.title);
      if (item.company) refInfo.push(item.company);

      if (refInfo.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: refInfo.join(' at '),
            spacing: { after: 50 },
          })
        );
      }

      if (item.relationship) {
        paragraphs.push(
          new Paragraph({
            text: item.relationship,
            spacing: { after: 50 },
            italics: !isATS,
          })
        );
      }

      const contactInfo: string[] = [];
      if (item.email) contactInfo.push(item.email);
      if (item.phone) contactInfo.push(item.phone);

      if (contactInfo.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: contactInfo.join(' | '),
            spacing: { after: 100 },
          })
        );
      }
    } else if (section.type === 'custom') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.title, bold: true }),
            ...(item.date ? [
              new TextRun({ text: ' | ' }),
              new TextRun({ text: item.date })
            ] : []),
          ],
          spacing: { before: idx === 0 ? 0 : 150, after: 50 },
        })
      );

      if (item.subtitle) {
        paragraphs.push(
          new Paragraph({
            text: item.subtitle,
            spacing: { after: 50 },
          })
        );
      }

      if (item.description) {
        paragraphs.push(
          new Paragraph({
            text: item.description,
            spacing: { after: 100 },
          })
        );
      }
    }
  });
}
