"use client";

import { useState } from "react";
import { ExperienceItem } from "@/types";
import { AIButton } from "@/components/ai/ai-button";
import { AISuggestionDialog } from "@/components/ai/ai-suggestion-dialog";

type ExperienceEditorProps = {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
};

export function ExperienceEditor({ items, onChange }: ExperienceEditorProps) {
  const [aiDialog, setAiDialog] = useState<{
    open: boolean;
    itemIndex: number;
    highlightIndex: number;
    original: string;
    suggestions: string[];
    loading: boolean;
  }>({
    open: false,
    itemIndex: -1,
    highlightIndex: -1,
    original: "",
    suggestions: [],
    loading: false,
  });

  const addItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<ExperienceItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addHighlight = (index: number) => {
    const newItems = [...items];
    newItems[index].highlights.push("");
    onChange(newItems);
  };

  const updateHighlight = (itemIndex: number, highlightIndex: number, value: string) => {
    const newItems = [...items];
    newItems[itemIndex].highlights[highlightIndex] = value;
    onChange(newItems);
  };

  const removeHighlight = (itemIndex: number, highlightIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].highlights = newItems[itemIndex].highlights.filter(
      (_, i) => i !== highlightIndex
    );
    onChange(newItems);
  };

  const handleAIRewrite = async (itemIndex: number, highlightIndex: number, text: string) => {
    if (!text.trim()) return;

    setAiDialog({
      open: true,
      itemIndex,
      highlightIndex,
      original: text,
      suggestions: [],
      loading: true,
    });

    try {
      const response = await fetch("/api/ai/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulletPoint: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to generate suggestions");
        setAiDialog((prev) => ({ ...prev, open: false, loading: false }));
        return;
      }

      setAiDialog((prev) => ({
        ...prev,
        suggestions: data.suggestions || [],
        loading: false,
      }));
    } catch (error) {
      console.error("AI rewrite error:", error);
      alert("Failed to generate suggestions. Please try again.");
      setAiDialog((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    const { itemIndex, highlightIndex } = aiDialog;
    updateHighlight(itemIndex, highlightIndex, suggestion);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Position {index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company *</label>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => updateItem(index, { company: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Tech Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Position *</label>
                <input
                  type="text"
                  value={item.position}
                  onChange={(e) => updateItem(index, { position: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Senior Developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={item.location || ""}
                onChange={(e) => updateItem(index, { location: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(e) => updateItem(index, { startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="2022-01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="text"
                  value={item.endDate || ""}
                  onChange={(e) => updateItem(index, { endDate: e.target.value })}
                  disabled={item.current}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 bg-white text-gray-900"
                  placeholder="2024-03"
                />
              </div>
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={item.current}
                onChange={(e) => updateItem(index, { current: e.target.checked, endDate: "" })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">I currently work here</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={item.description || ""}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="Brief description of your role..."
              />
            </div>

            {/* Highlights/Achievements */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
                <button
                  type="button"
                  onClick={() => addHighlight(index)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-3">
                {item.highlights.map((highlight, hIndex) => (
                  <div key={hIndex}>
                    <div className="flex gap-2 items-start">
                      <span className="text-sm text-gray-500 pt-2.5 select-none">•</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => updateHighlight(index, hIndex, e.target.value)}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                          placeholder="Describe your achievement..."
                        />
                        {highlight.trim() && (
                          <div className="mt-2">
                            <AIButton
                              onClick={() => handleAIRewrite(index, hIndex, highlight)}
                              className="text-xs"
                            >
                              Improve with AI
                            </AIButton>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHighlight(index, hIndex)}
                        className="text-red-600 hover:text-red-700 pt-2"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-md border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
      >
        + Add Experience
      </button>

      {/* AI Suggestion Dialog */}
      <AISuggestionDialog
        isOpen={aiDialog.open}
        onClose={() => setAiDialog((prev) => ({ ...prev, open: false }))}
        title="AI-Improved Achievement"
        original={aiDialog.original}
        suggestions={aiDialog.suggestions}
        onAccept={handleAcceptSuggestion}
        loading={aiDialog.loading}
      />
    </div>
  );
}
