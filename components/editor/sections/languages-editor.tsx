"use client";

import { LanguageItem } from "@/types";
import { useState } from "react";

type LanguagesEditorProps = {
  items: LanguageItem[];
  onChange: (items: LanguageItem[]) => void;
};

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Professional", "Intermediate", "Basic"];

export function LanguagesEditor({ items, onChange }: LanguagesEditorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: "",
      proficiency: "Professional",
    };
    onChange([...items, newLang]);
    setExpandedItems(new Set([...expandedItems, newLang.id]));
  };

  const updateLanguage = (id: string, updates: Partial<LanguageItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeLanguage = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {items.map((lang) => {
        const isExpanded = expandedItems.has(lang.id);
        const displayName = lang.language || "Untitled Language";

        return (
          <div key={lang.id} className="rounded-lg border border-gray-200 bg-gray-50">
            {/* Item Header */}
            <div className="flex items-center justify-between p-3">
              <button
                onClick={() => toggleExpanded(lang.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="font-medium text-gray-900">{displayName}</span>
                {lang.proficiency && (
                  <span className="text-sm text-gray-500">• {lang.proficiency}</span>
                )}
              </button>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="rounded p-1 text-red-600 hover:bg-red-50"
                title="Remove language"
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

            {/* Item Form */}
            {isExpanded && (
              <div className="space-y-3 border-t border-gray-200 p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Language *</label>
                  <input
                    type="text"
                    value={lang.language}
                    onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                    placeholder="Spanish"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Proficiency Level *
                  </label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-gray-500">
                  Choose the proficiency level that best describes your ability:
                  <br />
                  <strong>Native:</strong> Your first language
                  <br />
                  <strong>Fluent:</strong> Near-native proficiency
                  <br />
                  <strong>Professional:</strong> Can work effectively in the language
                  <br />
                  <strong>Intermediate:</strong> Can hold conversations with ease
                  <br />
                  <strong>Basic:</strong> Elementary proficiency
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Button */}
      <button
        onClick={addLanguage}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600"
      >
        + Add Language
      </button>
    </div>
  );
}
