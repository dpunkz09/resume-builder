"use client";

import { useState } from "react";
import { Resume } from "@/db/schema";
import {
  createResume,
  deleteResume,
  duplicateResume,
  renameResume,
} from "@/app/actions/resume-actions";
import { useRouter } from "next/navigation";

export function ResumeList({ initialResumes }: { initialResumes: Resume[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleCreateResume = async () => {
    setLoading(true);
    setError("");

    const result = await createResume();

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  };

  const handleRename = async (resumeId: string) => {
    if (!editTitle.trim()) {
      setError("Title cannot be empty");
      return;
    }

    const result = await renameResume(resumeId, editTitle);

    if (result.error) {
      setError(result.error);
      return;
    }

    setEditingId(null);
    setEditTitle("");
    router.refresh();
  };

  const handleDuplicate = async (resumeId: string) => {
    setLoading(true);
    setError("");

    const result = await duplicateResume(resumeId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    setLoading(true);
    setError("");

    const result = await deleteResume(resumeId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  };

  const startEditing = (resume: Resume) => {
    setEditingId(resume.id);
    setEditTitle(resume.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {initialResumes.length} {initialResumes.length === 1 ? "Resume" : "Resumes"}
        </h2>
        <button
          onClick={handleCreateResume}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "+ New Resume"}
        </button>
      </div>

      {initialResumes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new resume.</p>
          <div className="mt-6">
            <button
              onClick={handleCreateResume}
              disabled={loading}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + New Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialResumes.map((resume) => (
            <div
              key={resume.id}
              className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md"
            >
              {editingId === resume.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(resume.id);
                      if (e.key === "Escape") cancelEditing();
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRename(resume.id)}
                      className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900">{resume.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => router.push(`/resumes/${resume.id}/edit`)}
                      className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => startEditing(resume)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDuplicate(resume.id)}
                      disabled={loading}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      title="Duplicate"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      disabled={loading}
                      className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
