"use client";

import { useState } from "react";
import {
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Send,
  Loader2,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function MockInterviewView({
  questions = [],
  onGenerateQuestions,
  generating = false,
  jdText = "",
  apiKey = "",
  modelName = "gemini-3.6-flash",
  showToast,
}) {
  const [expandedId, setExpandedId] = useState(1);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState({});

  const toggleReveal = (id) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePracticeSubmit = async (qItem) => {
    const qId = qItem.id || 1;
    const userAnswer = practiceAnswers[qId];
    if (!userAnswer || !userAnswer.trim()) {
      showToast({ type: "info", message: "Please type your practice answer first." });
      return;
    }

    setEvaluatingId(qId);
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate-answer",
          question: qItem.question,
          userAnswer: userAnswer.trim(),
          jdText,
          apiKey,
          modelName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEvaluationResults((prev) => ({
          ...prev,
          [qId]: data.data,
        }));
        showToast({ type: "success", message: "Answer evaluated!" });
      } else {
        showToast({ type: "error", message: data.error || "Failed to evaluate answer." });
      }
    } catch (err) {
      showToast({ type: "error", message: "Network error during evaluation." });
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Mock Interview Prep & Practice
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Tailored questions targeting this JD with real-time AI answer coaching.
          </p>
        </div>

        <button
          onClick={onGenerateQuestions}
          disabled={generating}
          className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{questions && questions.length > 0 ? "Regenerate" : "Generate Questions"}</span>
            </>
          )}
        </button>
      </div>

      {/* Main List */}
      {generating ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500 rounded-xl bg-white border border-slate-200">
          <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
          <p className="text-sm font-medium text-slate-800">
            Synthesizing targeted interview questions...
          </p>
        </div>
      ) : !questions || questions.length === 0 ? (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-white border border-slate-200">
          <HelpCircle className="w-8 h-8 text-slate-400" />
          <p className="text-sm font-medium text-slate-800">No mock interview questions generated yet</p>
          <p className="text-xs text-slate-500 max-w-sm">
            Click &quot;Generate Questions&quot; to practice 5 tailored interview questions.
          </p>
          <button
            onClick={onGenerateQuestions}
            className="mt-1 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all"
          >
            Generate Questions Now
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {questions.map((q, idx) => {
            const qId = q.id || idx + 1;
            const isExpanded = expandedId === qId;
            const isAnswerRevealed = !!revealedAnswers[qId];
            const evalResult = evaluationResults[qId];
            const isEvaluating = evaluatingId === qId;

            return (
              <div
                key={qId}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm"
              >
                {/* Collapsible Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : qId)}
                  className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                        {idx + 1}
                      </span>
                      {q.type && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {q.type}
                        </span>
                      )}
                      {q.difficulty && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          {q.difficulty}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="text-slate-400 hover:text-slate-600 pt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-slate-100">
                    {/* Why Recruiter Asks */}
                    {q.whyRecruiterAsks && (
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">Interviewer Intent:</strong>{" "}
                          {q.whyRecruiterAsks}
                        </div>
                      </div>
                    )}

                    {/* Answer Strategy Guide */}
                    {q.strategyGuide && (
                      <div className="space-y-1 text-xs">
                        <span className="font-medium text-slate-700 block">
                          Strategy Guide:
                        </span>
                        <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                          {q.strategyGuide}
                        </p>
                      </div>
                    )}

                    {/* STAR Framework Breakdown */}
                    {q.starFramework && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                        {[
                          { key: "S", label: "Situation", val: q.starFramework.situation },
                          { key: "T", label: "Task", val: q.starFramework.task },
                          { key: "A", label: "Action", val: q.starFramework.action },
                          { key: "R", label: "Result", val: q.starFramework.result },
                        ].map((star) => (
                          <div
                            key={star.key}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                          >
                            <span className="font-bold text-slate-900 block mb-0.5">
                              {star.key} - {star.label}
                            </span>
                            <span className="text-[11px] text-slate-600">{star.val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Model Answer Toggle */}
                    {q.modelAnswer && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleReveal(qId)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mb-2"
                        >
                          {isAnswerRevealed ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide Sample Answer</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Reveal Sample Answer</span>
                            </>
                          )}
                        </button>

                        {isAnswerRevealed && (
                          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans space-y-1.5">
                            <div className="font-semibold text-slate-900">
                              Exemplary Response
                            </div>
                            <p className="italic text-slate-700">&quot;{q.modelAnswer}&quot;</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Practice Simulator */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">
                          Practice Your Answer
                        </span>
                        {evalResult && (
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Score: {evalResult.score}/100 ({evalResult.verdict})
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <textarea
                          rows={2}
                          value={practiceAnswers[qId] || ""}
                          onChange={(e) =>
                            setPracticeAnswers((prev) => ({
                              ...prev,
                              [qId]: e.target.value,
                            }))
                          }
                          placeholder="Type your practice response..."
                          className="flex-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white resize-none font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => handlePracticeSubmit(q)}
                          disabled={isEvaluating}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          {isEvaluating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Evaluate</span>
                        </button>
                      </div>

                      {/* AI Evaluation Report */}
                      {evalResult && (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <p className="text-slate-800 leading-relaxed font-medium">
                            {evalResult.feedback}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {evalResult.strengths && (
                              <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
                                <strong className="text-emerald-700 block mb-0.5">Strengths:</strong>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {evalResult.strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {evalResult.improvements && (
                              <div className="p-2 rounded bg-white border border-slate-200 text-slate-700">
                                <strong className="text-amber-700 block mb-0.5">Improvements:</strong>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {evalResult.improvements.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {evalResult.refinedAnswer && (
                            <div className="pt-1 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                              <strong className="text-slate-900 block mb-0.5">Refined Answer:</strong>
                              <p className="italic">&quot;{evalResult.refinedAnswer}&quot;</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
