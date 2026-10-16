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
import { Edit2, Copy, Trash2, Plus, FileText, MoreVertical, Calendar } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2";

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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">
            Your Resumes
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            {initialResumes.length} {initialResumes.length === 1 ? 'resume' : 'resumes'}
          </p>
        </div>
        <button
          onClick={handleCreateResume}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
        >
          <Plus className="h-4 w-4" />
          {loading ? "Creating..." : "New Resume"}
        </button>
      </div>

      {initialResumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-6">
          <div className="rounded-full bg-zinc-100 p-3 mb-3">
            <FileText className="h-6 w-6 text-zinc-600" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">No resumes yet</h3>
          <p className="text-sm text-zinc-600 mb-4 text-center max-w-sm">
            Create your first professional resume in minutes with our easy-to-use builder.
          </p>
          <button
            onClick={handleCreateResume}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 ${focusRing}`}
          >
            <Plus className="h-4 w-4" />
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {initialResumes.map((resume) => (
            <div 
              key={resume.id} 
              className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-zinc-300"
            >
              {/* Resume Preview Card */}
              <button
                onClick={() => router.push(`/resumes/${resume.id}/edit`)}
                className={`aspect-[8.5/11] w-full overflow-hidden rounded-t-xl border-b border-zinc-200 bg-white transition-colors relative ${focusRing}`}
                aria-label={`Edit ${resume.title}`}
              >
                {/* Actual Resume Preview using iframe */}
                <iframe
                  src={`/resumes/${resume.id}/preview`}
                  className="absolute inset-0 w-full h-full pointer-events-none scale-[0.35] origin-top-left"
                  style={{
                    width: '285.7%', // 100% / 0.35
                    height: '285.7%', // 100% / 0.35
                  }}
                  title={`Preview of ${resume.title}`}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 transition-all group-hover:bg-zinc-900/5">
                  <div className="rounded-full bg-white/0 p-2 shadow-lg transition-all group-hover:bg-white/90 group-hover:scale-110">
                    <Edit2 className="h-4 w-4 text-zinc-900 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </button>

              {/* Resume Info */}
              <div className="flex flex-col gap-2 p-3">
                {editingId === resume.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className={`w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 ${focusRing}`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(resume.id);
                        if (e.key === "Escape") cancelEditing();
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRename(resume.id)}
                        className={`flex-1 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 ${focusRing}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className={`flex-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 ${focusRing}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-semibold text-sm text-zinc-900" title={resume.title}>
                          {resume.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(resume.updatedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at {new Date(resume.updatedAt).toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions Menu */}
                      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(resume);
                          }}
                          className={`rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 ${focusRing}`}
                          title="Rename"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(resume.id);
                          }}
                          disabled={loading}
                          className={`rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 ${focusRing}`}
                          title="Duplicate"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume.id);
                          }}
                          disabled={loading}
                          className={`rounded-lg p-1.5 text-zinc-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 ${focusRing}`}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}