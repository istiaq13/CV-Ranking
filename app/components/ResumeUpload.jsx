"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, CheckCircle2, Loader2, Edit3, Trash2, FileCheck } from "lucide-react";

export default function ResumeUpload({
  resumeText,
  onChangeResumeText,
  fileName,
  setFileName,
  showToast,
}) {
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload-resume", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success) {
          onChangeResumeText(data.text);
          setFileName(data.fileName);
          showToast({
            type: "success",
            message: `Extracted ${data.wordCount} words from ${data.fileName}!`,
          });
        } else {
          showToast({
            type: "error",
            message: data.error || "Failed to parse resume file.",
          });
        }
      } catch (err) {
        showToast({
          type: "error",
          message: err.message || "Network error while uploading resume.",
        });
      } finally {
        setUploading(false);
      }
    },
    [onChangeResumeText, setFileName, showToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt", ".md"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const wordCount = resumeText ? resumeText.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Candidate Resume</h3>
            <p className="text-[11px] text-slate-500">Upload PDF, DOCX, or paste text</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              !isEditing
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
              isEditing
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Edit3 className="w-3 h-3" />
            Edit Text
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-[260px]">
        {isEditing ? (
          /* Textarea Mode */
          <div className="flex-1 flex flex-col relative">
            <textarea
              value={resumeText}
              onChange={(e) => onChangeResumeText(e.target.value)}
              placeholder="Paste or type your resume content here..."
              className="w-full flex-1 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white resize-none font-mono leading-relaxed transition-all"
            />
          </div>
        ) : (
          /* Dropzone / Upload Mode */
          <div className="flex-1 flex flex-col">
            {fileName && resumeText ? (
              /* Uploaded State Box */
              <div className="flex-1 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                          {fileName}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Parsed Successfully
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onChangeResumeText("");
                        setFileName("");
                      }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded bg-white border border-slate-200 text-xs text-slate-700 font-mono line-clamp-6 leading-relaxed">
                    {resumeText}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{wordCount} words</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit Content
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone Active Area */
              <div
                {...getRootProps()}
                className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/60"
                }`}
              >
                <input {...getInputProps()} />

                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
                    <p className="text-xs font-semibold text-slate-700">
                      Extracting text from resume...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {isDragActive ? "Drop file here..." : "Click to upload or drag & drop"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PDF, DOCX, or plain text
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>{wordCount > 0 ? `${wordCount} words loaded` : "No file loaded"}</span>
        {resumeText && (
          <button
            type="button"
            onClick={() => {
              onChangeResumeText("");
              setFileName("");
            }}
            className="text-slate-400 hover:text-rose-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
