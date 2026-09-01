"use client";

import { useEffect, useState } from "react";
import { Award, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ScoreGauge({
  score = 0,
  hardSkillsScore = 0,
  experienceScore = 0,
  softSkillsScore = 0,
  atsScore = 0,
  candidateName = "Candidate",
  targetRole = "Target Role",
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    const duration = 800;
    const stepTime = 15;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color scheme
  let strokeColor = "#2563eb"; // blue
  let textColor = "text-blue-600";
  let statusText = "Strong Match";
  let statusBadge = "bg-blue-50 text-blue-700 border-blue-200";

  if (score < 55) {
    strokeColor = "#dc2626";
    textColor = "text-red-600";
    statusText = "Low Alignment";
    statusBadge = "bg-red-50 text-red-700 border-red-200";
  } else if (score < 75) {
    strokeColor = "#d97706";
    textColor = "text-amber-600";
    statusText = "Moderate Match";
    statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (score >= 85) {
    strokeColor = "#16a34a";
    textColor = "text-emerald-600";
    statusText = "Exceptional Match";
    statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const subScores = [
    { label: "Hard Skills Match", val: hardSkillsScore, color: "bg-blue-600" },
    { label: "Experience Alignment", val: experienceScore, color: "bg-indigo-600" },
    { label: "Soft Skills & Culture", val: softSkillsScore, color: "bg-emerald-600" },
    { label: "ATS Keyword Fit", val: atsScore, color: "bg-slate-700" },
  ];

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      {/* Circular Gauge */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: "stroke-dashoffset 0.6s ease-out",
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>
              {animatedScore}%
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Match Score
            </span>
          </div>
        </div>

        <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-medium border ${statusBadge}`}>
          {statusText}
        </div>
      </div>

      {/* Sub-Score Bars Breakdown */}
      <div className="flex-1 w-full space-y-3">
        <div className="pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Candidate</span>
            <span className="text-sm text-slate-900 font-semibold">{candidateName}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Target Position</span>
            <span className="text-sm text-slate-900 font-semibold">{targetRole}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {subScores.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{item.label}</span>
                <span className="text-slate-900 font-bold">{item.val}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${Math.min(100, item.val)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
