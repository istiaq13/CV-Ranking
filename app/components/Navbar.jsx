"use client";

import { Sparkles, History, Settings, Key, FileText, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SAMPLE_PRESETS } from "@/lib/sampleData";

export default function Navbar({
  apiKey,
  onOpenSettings,
  onOpenHistory,
  onLoadSample,
  historyCount = 0,
}) {
  const [sampleDropdownOpen, setSampleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSampleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-base">
            CM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 tracking-tight">
                Resume–JD Matcher
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded">
                Gemini NLP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Skill Gap Diagnostics & Career Coach
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Sample Presets Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Load Sample</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {sampleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Test Profiles
                </div>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onLoadSample(preset);
                      setSampleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-700 hover:text-slate-900 transition-colors flex flex-col gap-0.5"
                  >
                    <div className="font-medium flex items-center justify-between">
                      <span>{preset.title}</span>
                      <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                        {preset.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {preset.role}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-700">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              apiKey
                ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
            }`}
          >
            {apiKey ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Key className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="hidden sm:inline">
              {apiKey ? "API Key Configured" : "Set API Key"}
            </span>
            <Settings className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
