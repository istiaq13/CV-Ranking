"use client";

import { Briefcase, Clipboard } from "lucide-react";

export default function JDInput({
  jdText,
  onChangeJdText,
  jobTitle,
  onChangeJobTitle,
  companyName,
  onChangeCompanyName,
  showToast,
}) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeJdText(text);
        showToast({ type: "success", message: "Pasted job description from clipboard!" });
      }
    } catch (err) {
      showToast({ type: "info", message: "Please paste text directly using Ctrl+V." });
    }
  };

  const wordCount = jdText ? jdText.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Job Description</h3>
            <p className="text-[11px] text-slate-500">Target role & requirements</p>
          </div>
        </div>

        {/* Quick Paste Button */}
        <button
          type="button"
          onClick={handlePaste}
          className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          title="Paste from clipboard"
        >
          <Clipboard className="w-3 h-3 text-slate-500" />
          <span>Paste</span>
        </button>
      </div>

      {/* Role & Company Inputs */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Job Title (Optional)
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => onChangeJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            Company (Optional)
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onChangeCompanyName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Textarea Area */}
      <div className="flex-1 flex flex-col min-h-[200px]">
        <textarea
          value={jdText}
          onChange={(e) => onChangeJdText(e.target.value)}
          placeholder="Paste the target job description here..."
          className="w-full flex-1 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white resize-none font-mono leading-relaxed transition-all"
        />
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>{wordCount > 0 ? `${wordCount} words loaded` : "No JD loaded"}</span>
        {jdText && (
          <button
            type="button"
            onClick={() => {
              onChangeJdText("");
              onChangeJobTitle("");
              onChangeCompanyName("");
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
