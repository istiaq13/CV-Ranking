"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, Compass, Filter, ShieldCheck } from "lucide-react";

export default function SkillsGapView({
  matchedSkills = [],
  missingSkills = [],
  atsOptimization = null,
  improvementSuggestions = [],
}) {
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", "Technical", "Tool", "Domain", "Soft"];

  const filteredMatched = matchedSkills.filter((s) => {
    if (filterCategory === "all") return true;
    const cat = (s.category || "").toLowerCase();
    return cat.includes(filterCategory.toLowerCase());
  });

  const filteredMissing = missingSkills.filter((s) => {
    if (filterCategory === "all") return true;
    const cat = (s.category || "").toLowerCase();
    return cat.includes(filterCategory.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-medium capitalize transition-all ${
                filterCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Matched vs Missing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Matched Skills ({matchedSkills.length})</h3>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {filteredMatched.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No matched skills in this category.</p>
            ) : (
              filteredMatched.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">
                      {item.skill || item}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.category && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      )}
                      {item.matchStrength && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {item.matchStrength} Fit
                        </span>
                      )}
                    </div>
                  </div>
                  {item.context && (
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {item.context}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Skill Gaps ({missingSkills.length})</h3>
            </div>
            <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Needs Attention
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {filteredMissing.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No missing skills in this category.</p>
            ) : (
              filteredMissing.map((item, idx) => {
                const importance = item.importance || "Important";
                const isCritical = importance.toLowerCase().includes("critical");

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">
                        {item.skill || item}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          isCritical
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {importance}
                      </span>
                    </div>

                    {item.recommendation && (
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{item.recommendation}</span>
                      </div>
                    )}

                    {item.fastTrackLearningPath && (
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-700 bg-slate-100 p-2 rounded border border-slate-200">
                        <Compass className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900">Learning Path:</strong>{" "}
                          {item.fastTrackLearningPath}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ATS & Keywords Optimization */}
      {atsOptimization && (
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">ATS Keyword Screening</h3>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              Density: {atsOptimization.keywordMatchRate || "80%"}
            </span>
          </div>

          {atsOptimization.criticalMissingKeywords && atsOptimization.criticalMissingKeywords.length > 0 && (
            <div>
              <span className="text-xs font-medium text-slate-600 block mb-1.5">
                Recommended Keywords to Integrate:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {atsOptimization.criticalMissingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {atsOptimization.recommendations && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-600 block mb-1">ATS Advice:</span>
              {atsOptimization.recommendations.map((rec, i) => (
                <div key={i} className="text-xs text-slate-700">
                  • {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {improvementSuggestions && improvementSuggestions.length > 0 && (
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-slate-700" />
            Actionable Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {improvementSuggestions.map((sug, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  {i + 1}
                </span>
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
