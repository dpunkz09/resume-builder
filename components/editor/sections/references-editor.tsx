"use client";

import { ReferenceItem } from "@/types";
import { useState } from "react";

type ReferencesEditorProps = {
  items: ReferenceItem[];
  onChange: (items: ReferenceItem[]) => void;
};

export function ReferencesEditor({ items, onChange }: ReferencesEditorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const addReference = () => {
    const newRef: ReferenceItem = {
      id: `ref-${Date.now()}`,
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
      relationship: "",
    };
    onChange([...items, newRef]);
    setExpandedItems(new Set([...expandedItems, newRef.id]));
  };

  const updateReference = (id: string, updates: Partial<ReferenceItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeReference = (id: string) => {
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
      {items.map((ref) => {
        const isExpanded = expandedItems.has(ref.id);
        const displayName = ref.name || "Untitled Reference";

        return (
          <div key={ref.id} className="rounded-lg border border-gray-200 bg-gray-50">
            {/* Item Header */}
            <div className="flex items-center justify-between p-3">
              <button
                onClick={() => toggleExpanded(ref.id)}
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
                {ref.title && <span className="text-sm text-gray-500">• {ref.title}</span>}
              </button>
              <button
                onClick={() => removeReference(ref.id)}
                className="rounded p-1 text-red-600 hover:bg-red-50"
                title="Remove reference"
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => updateReference(ref.id, { name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Title/Position *
                    </label>
                    <input
                      type="text"
                      value={ref.title}
                      onChange={(e) => updateReference(ref.id, { title: e.target.value })}
                      placeholder="Senior Engineering Manager"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={ref.company || ""}
                      onChange={(e) => updateReference(ref.id, { company: e.target.value })}
                      placeholder="Acme Corporation"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={ref.email || ""}
                      onChange={(e) => updateReference(ref.id, { email: e.target.value })}
                      placeholder="john.smith@example.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={ref.phone || ""}
                      onChange={(e) => updateReference(ref.id, { phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Relationship (Optional)
                    </label>
                    <input
                      type="text"
                      value={ref.relationship || ""}
                      onChange={(e) => updateReference(ref.id, { relationship: e.target.value })}
                      placeholder="Former Manager"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  <strong>Note:</strong> It&apos;s common to write &quot;References available upon
                  request&quot; on your resume instead of listing them directly. Only include
                  references if specifically requested or if space allows.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Button */}
      <button
        onClick={addReference}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600"
      >
        + Add Reference
      </button>
    </div>
  );
}
