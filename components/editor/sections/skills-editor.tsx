"use client";

import { SkillItem } from "@/types";
import { useState } from "react";

type SkillsEditorProps = {
  items: SkillItem[];
  onChange: (items: SkillItem[]) => void;
};

export function SkillsEditor({ items, onChange }: SkillsEditorProps) {
  // Store raw input text separately
  const [inputTexts, setInputTexts] = useState<{ [key: string]: string }>({});

  const addItem = () => {
    const newItem: SkillItem = {
      id: `skill-${Date.now()}`,
      category: "",
      skills: [],
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<SkillItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    // Clean up input text state
    const newInputTexts = { ...inputTexts };
    delete newInputTexts[items[index].id];
    setInputTexts(newInputTexts);
  };

  const handleSkillsChange = (item: SkillItem, index: number, value: string) => {
    // Update the input text state
    setInputTexts((prev) => ({ ...prev, [item.id]: value }));

    // Parse skills from the text
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateItem(index, { skills });
  };

  const getSkillsInputValue = (item: SkillItem) => {
    // Use stored input text if available, otherwise join skills array
    return inputTexts[item.id] !== undefined ? inputTexts[item.id] : item.skills.join(", ");
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Skill Category {index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <input
                type="text"
                value={item.category}
                onChange={(e) => updateItem(index, { category: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="Programming Languages"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills (comma-separated) *
              </label>
              <input
                type="text"
                value={getSkillsInputValue(item)}
                onChange={(e) => handleSkillsChange(item, index, e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="JavaScript, TypeScript, React, Node.js"
              />
              <p className="mt-1 text-xs text-gray-500">
                {item.skills.length} skill{item.skills.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-md border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
      >
        + Add Skill Category
      </button>
    </div>
  );
}
