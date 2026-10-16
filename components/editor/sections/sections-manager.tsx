"use client";

import { Section } from "@/types";
import { ExperienceEditor } from "./experience-editor";
import { EducationEditor } from "./education-editor";
import { SkillsEditor } from "./skills-editor";
import { CertificationsEditor } from "./certifications-editor";
import { LanguagesEditor } from "./languages-editor";
import { ReferencesEditor } from "./references-editor";
import { useState } from "react";

type SectionsManagerProps = {
  sections: Section[];
  onChange: (sections: Section[]) => void;
};

export function SectionsManager({ sections, onChange }: SectionsManagerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const addSection = (type: Section["type"]) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      title: getSectionTitle(type),
      visible: true,
      items: [],
    };
    const updated = [...sections, newSection];
    onChange(updated);
    // Auto-expand the new section
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    onChange(sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)));
  };

  const removeSection = (sectionId: string) => {
    onChange(sections.filter((s) => s.id !== sectionId));
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
  };

  const toggleExpanded = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...sections];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Existing Sections */}
      {sections.map((section, index) => {
        const isExpanded = expandedSections.has(section.id);

        return (
          <div key={section.id} className="rounded-lg bg-white shadow-sm">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleExpanded(section.id)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={isExpanded ? "Collapse section" : "Expand section"}
                >
                  {isExpanded ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <span className="text-sm text-gray-500">
                  {section.items.length} {section.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <button
                  onClick={() => updateSection(section.id, { visible: !section.visible })}
                  className={`rounded px-2 py-1 text-sm ${
                    section.visible
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  title={section.visible ? "Hide from preview" : "Show in preview"}
                >
                  {section.visible ? "Visible" : "Hidden"}
                </button>

                {/* Move Up/Down */}
                <button
                  onClick={() => moveSection(section.id, "up")}
                  disabled={index === 0}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move up"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => moveSection(section.id, "down")}
                  disabled={index === sections.length - 1}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Move down"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Remove Section */}
                <button
                  onClick={() => removeSection(section.id)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                  title="Remove section"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Section Content */}
            {isExpanded && (
              <div className="p-4">
                {section.type === "experience" && (
                  <ExperienceEditor
                    items={section.items}
                    onChange={(items) => updateSection(section.id, { items })}
                  />
                )}
                {section.type === "education" && (
                  <EducationEditor
                    items={section.items}
                    onChange={(items) => updateSection(section.id, { items })}
                  />
                )}
                {section.type === "skills" && (
                  <SkillsEditor
                    items={section.items}
                    onChange={(items) => updateSection(section.id, { items })}
                  />
                )}
                {section.type === "certifications" && (
                  <CertificationsEditor
                    items={section.items}
                    onChange={(items) => updateSection(section.id, { items })}
                  />
                )}
                {section.type === "languages" && (
                  <LanguagesEditor
                    items={section.items}
                    onChange={(items) => updateSection(section.id, { items })}
                  />
                )}
                {section.type === "references" && (
                  <ReferencesEditor
                    items={section.items}
                    onChange={(items) => updateSection(section.id, { items })}
                  />
                )}
                {section.type === "projects" && (
                  <p className="text-sm text-gray-500">
                    Editor for projects coming soon. You can still add this section to your resume.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Section Card */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Add Section</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addSection("experience")}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
          >
            + Experience
          </button>
          <button
            onClick={() => addSection("education")}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
          >
            + Education
          </button>
          <button
            onClick={() => addSection("skills")}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
          >
            + Skills
          </button>
          <button
            onClick={() => addSection("projects")}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
          >
            + Projects
          </button>
          <button
            onClick={() => addSection("certifications")}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
          >
            + Certifications
          </button>
          <button
            onClick={() => addSection("languages")}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
          >
            + Languages
          </button>
          <button
            onClick={() => addSection("references")}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
          >
            + References
          </button>
        </div>
      </div>
    </div>
  );
}

function getSectionTitle(type: Section["type"]): string {
  const titles: Record<Section["type"], string> = {
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    references: "References",
    custom: "Custom Section",
  };
  return titles[type];
}
