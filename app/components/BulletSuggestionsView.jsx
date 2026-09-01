"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Target, TrendingUp, Layers, RefreshCw, Loader2 } from "lucide-react";

export default function BulletSuggestionsView({
  bullets = [],
  onGenerateBullets,
  generating = false,
  showToast,
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyBullet = (bulletText, id) => {
    navigator.clipboard.writeText(bulletText);
    setCopiedId(id);
    showToast({ type: "success", message: "Copied tailored bullet to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!bullets || bullets.length === 0) return;
    const fullText = bullets
      .map((b) => `• ${b.suggestedBullet || b}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullText);
    showToast({ type: "success", message: "Copied all bullet points to clipboard!" });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Tailored STAR Resume Bullet Points
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Formatted using the Google XYZ formula: <em>&quot;Accomplished [X], measured by [Y], by doing [Z]&quot;</em>
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {bullets && bullets.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy All</span>
            </button>
          )}

          <button
            onClick={onGenerateBullets}
            disabled={generating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{bullets && bullets.length > 0 ? "Regenerate" : "Generate Bullets"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bullets List */}
      {generating ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500 rounded-xl bg-white border border-slate-200">
          <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
          <p className="text-sm font-medium text-slate-800">
            Synthesizing tailored bullet points with Gemini...
          </p>
        </div>
      ) : !bullets || bullets.length === 0 ? (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-white border border-slate-200">
          <Layers className="w-8 h-8 text-slate-400" />
          <p className="text-sm font-medium text-slate-800">No tailored bullets generated yet</p>
          <p className="text-xs text-slate-500 max-w-sm">
            Click &quot;Generate Bullets&quot; to transform your experience into metric-driven bullet points.
          </p>
          <button
            onClick={onGenerateBullets}
            className="mt-1 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all"
          >
            Generate Bullets Now
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {bullets.map((bullet, idx) => {
            const bulletText = bullet.suggestedBullet || (typeof bullet === "string" ? bullet : "");
            const isCopied = copiedId === (bullet.id || idx);

            return (
              <div
                key={bullet.id || idx}
                className="rounded-xl bg-white border border-slate-200 p-4 hover:border-slate-300 transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                      {idx + 1}
                    </span>
                    {bullet.category && (
                      <span className="text-xs font-semibold text-slate-700 px-2 py-0.5 rounded bg-slate-100">
                        {bullet.category}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopyBullet(bulletText, bullet.id || idx)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      isCopied
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 leading-relaxed font-sans flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span className="flex-1 select-all">{bulletText}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {bullet.originalContext && (
                    <div className="flex items-start gap-1.5 text-slate-600 bg-white p-2 rounded border border-slate-100">
                      <Target className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Context:</strong> {bullet.originalContext}
                      </div>
                    </div>
                  )}

                  {bullet.impactMetric && (
                    <div className="flex items-start gap-1.5 text-emerald-700 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-800">Impact Metric:</strong>{" "}
                        {bullet.impactMetric}
                      </div>
                    </div>
                  )}
                </div>

                {bullet.targetedKeywords && bullet.targetedKeywords.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-medium text-slate-400">Keywords:</span>
                    {bullet.targetedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
