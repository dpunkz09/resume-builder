"use client";

import { EducationItem } from "@/types";

type EducationEditorProps = {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
};

export function EducationEditor({ items, onChange }: EducationEditorProps) {
  const addItem = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<EducationItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Education {index + 1}</span>
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
              <label className="block text-sm font-medium text-gray-700">Institution *</label>
              <input
                type="text"
                value={item.institution}
                onChange={(e) => updateItem(index, { institution: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="University of California"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree *</label>
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) => updateItem(index, { degree: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                <input
                  type="text"
                  value={item.field || ""}
                  onChange={(e) => updateItem(index, { field: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={item.location || ""}
                  onChange={(e) => updateItem(index, { location: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Berkeley, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">GPA</label>
                <input
                  type="text"
                  value={item.gpa || ""}
                  onChange={(e) => updateItem(index, { gpa: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(e) => updateItem(index, { startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="2018"
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
                  placeholder="2022"
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
              <span className="ml-2 text-sm text-gray-700">Currently enrolled</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={item.description || ""}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="Honors, activities, coursework..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-md border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700"
      >
        + Add Education
      </button>
    </div>
  );
}
