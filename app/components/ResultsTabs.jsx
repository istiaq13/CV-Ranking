"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Download,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import SkillsGapView from "./SkillsGapView";
import BulletSuggestionsView from "./BulletSuggestionsView";
import MockInterviewView from "./MockInterviewView";

export default function ResultsTabs({
  analysis,
  tailoredBullets,
  onGenerateBullets,
  generatingBullets,
  interviewQuestions,
  onGenerateQuestions,
  generatingQuestions,
  jdText,
  apiKey,
  modelName,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [downloading, setDownloading] = useState(false);

  if (!analysis) return null;

  const tabs = [
    {
      id: "overview",
      label: "Overview & Score",
      icon: BarChart3,
      badge: `${analysis.matchScore}%`,
    },
    {
      id: "skills",
      label: "Skill & Gap Diagnostics",
      icon: CheckCircle2,
      badge: `${analysis.missingSkills?.length || 0} Gaps`,
    },
    {
      id: "bullets",
      label: "Tailored Bullets",
      icon: FileCheck2,
      badge: tailoredBullets?.length ? `${tailoredBullets.length}` : null,
    },
    {
      id: "interview",
      label: "Mock Interview Prep",
      icon: HelpCircle,
      badge: interviewQuestions?.length ? `${interviewQuestions.length}` : null,
    },
  ];

  const handleExportMarkdown = () => {
    setDownloading(true);
    try {
      const mdContent = `# CareerMatch Analysis Report: ${analysis.targetRole || "Position"}
**Candidate:** ${analysis.candidateName || "Candidate"}
**Overall Match Score:** ${analysis.matchScore}%
**Hard Skills:** ${analysis.hardSkillsScore}% | **Experience:** ${analysis.experienceScore}% | **Soft Skills:** ${analysis.softSkillsScore}% | **ATS:** ${analysis.atsScore}%
**Date:** ${new Date().toLocaleDateString()}

---

## Executive Summary
${analysis.summary}

---

## Key Candidate Strengths
${(analysis.keyStrengths || []).map((s) => `- ${s}`).join("\n")}

---

## Verified Matched Skills
${(analysis.matchedSkills || [])
  .map((s) => `- **${s.skill || s}** (${s.category || "General"}): ${s.context || ""}`)
  .join("\n")}

---

## Skill Gaps & Strategic Recommendations
${(analysis.missingSkills || [])
  .map(
    (s) =>
      `- **${s.skill || s}** [${s.importance || "Important"}]: ${s.recommendation || ""}\n  *Learning:* ${
        s.fastTrackLearningPath || "N/A"
      }`
  )
  .join("\n")}

---

## Actionable Next Steps
${(analysis.improvementSuggestions || []).map((s, i) => `${i + 1}. ${s}`).join("\n")}

${
  tailoredBullets && tailoredBullets.length > 0
    ? `\n---\n\n## Tailored Resume Bullets\n` +
      tailoredBullets
        .map(
          (b) =>
            `### ${b.category || "Project"}\n- ${b.suggestedBullet || b}\n*Keywords:* ${(
              b.targetedKeywords || []
            ).join(", ")}\n`
        )
        .join("\n")
    : ""
}

${
  interviewQuestions && interviewQuestions.length > 0
    ? `\n---\n\n## Tailored Mock Interview Questions\n` +
      interviewQuestions
        .map(
          (q, i) =>
            `### Q${i + 1}: ${q.question} (${q.type || "Technical"})\n**Strategy:** ${
              q.strategyGuide || ""
            }\n**Model Answer:** ${q.modelAnswer || ""}\n`
        )
        .join("\n")
    : ""
}
`;

      const blob = new Blob([mdContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CareerMatch_${(analysis.targetRole || "Analysis").replace(/\s+/g, "_")}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast({ type: "success", message: "Exported report as Markdown!" });
    } catch (e) {
      showToast({ type: "error", message: "Failed to export report." });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isActive
                        ? "bg-slate-100 text-slate-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportMarkdown}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <ScoreGauge
            score={analysis.matchScore}
            hardSkillsScore={analysis.hardSkillsScore}
            experienceScore={analysis.experienceScore}
            softSkillsScore={analysis.softSkillsScore}
            atsScore={analysis.atsScore}
            candidateName={analysis.candidateName}
            targetRole={analysis.targetRole}
          />

          {/* Executive Summary */}
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Executive Fit Evaluation
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed font-sans">
              {analysis.summary}
            </p>
          </div>

          {/* Key Strengths */}
          {analysis.keyStrengths && analysis.keyStrengths.length > 0 && (
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Key Competitive Strengths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {analysis.keyStrengths.map((str, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tab Jump */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => setActiveTab("skills")}
              className="p-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>View Skill Gaps ({analysis.missingSkills?.length || 0})</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Missing prerequisites analysis</p>
            </button>

            <button
              onClick={() => {
                setActiveTab("bullets");
                if (!tailoredBullets || tailoredBullets.length === 0) onGenerateBullets();
              }}
              className="p-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Tailored Bullets</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Google XYZ formula bullet points</p>
            </button>

            <button
              onClick={() => {
                setActiveTab("interview");
                if (!interviewQuestions || interviewQuestions.length === 0) onGenerateQuestions();
              }}
              className="p-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Mock Interview</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">5 tailored interview questions</p>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2 */}
      {activeTab === "skills" && (
        <SkillsGapView
          matchedSkills={analysis.matchedSkills}
          missingSkills={analysis.missingSkills}
          atsOptimization={analysis.atsOptimization}
          improvementSuggestions={analysis.improvementSuggestions}
        />
      )}

      {/* Tab 3 */}
      {activeTab === "bullets" && (
        <BulletSuggestionsView
          bullets={tailoredBullets}
          onGenerateBullets={onGenerateBullets}
          generating={generatingBullets}
          showToast={showToast}
        />
      )}

      {/* Tab 4 */}
      {activeTab === "interview" && (
        <MockInterviewView
          questions={interviewQuestions}
          onGenerateQuestions={onGenerateQuestions}
          generating={generatingQuestions}
          jdText={jdText}
          apiKey={apiKey}
          modelName={modelName}
          showToast={showToast}
        />
      )}
    </div>
  );
}
