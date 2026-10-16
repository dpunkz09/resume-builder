"use client";

import { Theme } from "@/types";
import { Check, Type, Palette as PaletteIcon } from "lucide-react";

type ThemeCustomizerProps = {
  theme: Theme;
  onUpdate: (updates: Partial<Theme>) => void;
};

const PRESET_COLORS = [
  { name: "Blue", value: "#0066cc" },
  { name: "Green", value: "#059669" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Teal", value: "#0d9488" },
  { name: "Pink", value: "#db2777" },
  { name: "Gray", value: "#4b5563" },
];

export function ThemeCustomizer({ theme, onUpdate }: ThemeCustomizerProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-base font-semibold text-zinc-900">Customize Style</h2>

      <div className="space-y-6">
        {/* Accent Color */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700">
            <PaletteIcon className="h-4 w-4" />
            Accent Color
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onUpdate({ color: color.value })}
                className={`relative h-12 rounded-lg border-2 transition-all ${
                  theme.color === color.value
                    ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-2 scale-105"
                    : "border-zinc-200 hover:border-zinc-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={color.name}
              >
                {theme.color === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/90 p-1">
                      <Check className="h-3 w-3 text-zinc-900" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          <input
            type="color"
            value={theme.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="h-12 w-full cursor-pointer rounded-lg border-2 border-zinc-200 bg-white transition-all hover:border-zinc-300"
          />
        </div>

        {/* Font */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Type className="h-4 w-4" />
            Font Family
          </label>
          <select
            value={theme.font}
            onChange={(e) => onUpdate({ font: e.target.value as Theme["font"] })}
            className="w-full rounded-lg border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-all focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          >
            <option value="inter">Inter (Sans-serif)</option>
            <option value="roboto">Roboto (Sans-serif)</option>
            <option value="arial">Arial (Sans-serif)</option>
            <option value="times">Times New Roman (Serif)</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-700">Font Size</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onUpdate({ fontSize: "small" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.fontSize === "small"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Small
            </button>
            <button
              onClick={() => onUpdate({ fontSize: "medium" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.fontSize === "medium"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => onUpdate({ fontSize: "large" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.fontSize === "large"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Large
            </button>
          </div>
        </div>

        {/* Line Spacing */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-700">Line Spacing</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onUpdate({ spacing: "compact" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.spacing === "compact"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => onUpdate({ spacing: "normal" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.spacing === "normal"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onUpdate({ spacing: "relaxed" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.spacing === "relaxed"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Relaxed
            </button>
          </div>
        </div>

        {/* Page Margins */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-700">Page Margins</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onUpdate({ margins: "narrow" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.margins === "narrow"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Narrow
            </button>
            <button
              onClick={() => onUpdate({ margins: "normal" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.margins === "normal"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onUpdate({ margins: "wide" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.margins === "wide"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Wide
            </button>
          </div>
        </div>

        {/* Page Size */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-700">Page Size</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onUpdate({ pageSize: "a4" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.pageSize === "a4"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              A4
            </button>
            <button
              onClick={() => onUpdate({ pageSize: "letter" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.pageSize === "letter"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              US Letter
            </button>
            <button
              onClick={() => onUpdate({ pageSize: "folio" })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                theme.pageSize === "folio"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Folio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
