"use client";

import { CertificationItem } from "@/types";
import { useState } from "react";

type CertificationsEditorProps = {
  items: CertificationItem[];
  onChange: (items: CertificationItem[]) => void;
};

export function CertificationsEditor({ items, onChange }: CertificationsEditorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const addCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      url: "",
      expiryDate: "",
    };
    onChange([...items, newCert]);
    setExpandedItems(new Set([...expandedItems, newCert.id]));
  };

  const updateCertification = (id: string, updates: Partial<CertificationItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeCertification = (id: string) => {
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
      {items.map((cert) => {
        const isExpanded = expandedItems.has(cert.id);
        const displayName = cert.name || "Untitled Certification";

        return (
          <div key={cert.id} className="rounded-lg border border-gray-200 bg-gray-50">
            {/* Item Header */}
            <div className="flex items-center justify-between p-3">
              <button
                onClick={() => toggleExpanded(cert.id)}
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
                {cert.issuer && <span className="text-sm text-gray-500">• {cert.issuer}</span>}
              </button>
              <button
                onClick={() => removeCertification(cert.id)}
                className="rounded p-1 text-red-600 hover:bg-red-50"
                title="Remove certification"
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
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                      placeholder="AWS Certified Solutions Architect"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                      placeholder="Amazon Web Services"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Issue Date *
                    </label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                      placeholder="January 2024"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={cert.expiryDate || ""}
                      onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                      placeholder="January 2027"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Credential URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={cert.url || ""}
                      onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                      placeholder="https://www.credly.com/badges/..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Button */}
      <button
        onClick={addCertification}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600"
      >
        + Add Certification
      </button>
    </div>
  );
}
