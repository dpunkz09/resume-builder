"use client";

import { useState } from "react";
import { Loader2, Sparkles, X, Check } from "lucide-react";

type AISuggestionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  original: string;
  suggestions: string[];
  onAccept: (suggestion: string) => void;
  loading?: boolean;
};

export function AISuggestionDialog({
  isOpen,
  onClose,
  title,
  original,
  suggestions,
  onAccept,
  loading = false,
}: AISuggestionDialogProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (suggestions[selectedIndex]) {
      onAccept(suggestions[selectedIndex]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Generating suggestions...</span>
            </div>
          ) : (
            <>
              {/* Original */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                  {original}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Suggestions
                </label>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full text-left p-4 rounded-md border-2 transition-all ${
                        selectedIndex === index
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedIndex === index
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedIndex === index && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 text-gray-700">{suggestion}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={loading || suggestions.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use This Suggestion
          </button>
        </div>
      </div>
    </div>
  );
}
