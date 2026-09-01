"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import Navbar from "./components/Navbar";
import ResumeUpload from "./components/ResumeUpload";
import JDInput from "./components/JDInput";
import ResultsTabs from "./components/ResultsTabs";
import SettingsModal from "./components/SettingsModal";
import HistoryModal from "./components/HistoryModal";
import Toast from "./components/Toast";
import { SAMPLE_PRESETS } from "@/lib/sampleData";

export default function HomePage() {
  // Input State
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  // AI & Configuration State
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("gemini-3.6-flash");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [toast, setToast] = useState(null);

  // Analysis & Sub-Generations State
  const [analysisResult, setAnalysisResult] = useState(null);
  const [tailoredBullets, setTailoredBullets] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState(null);

  // Loading States
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingBullets, setGeneratingBullets] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("careermatch_gemini_api_key");
      const storedModel = localStorage.getItem("careermatch_gemini_model");
      if (storedKey) setApiKey(storedKey);
      if (storedModel) setModelName(storedModel);

      // Pre-load default sample
      const initialPreset = SAMPLE_PRESETS[0];
      setResumeText(initialPreset.resume);
      setFileName("Alex_Rivera_NLP_Engineer_Resume.pdf");
      setJdText(initialPreset.jd);
      setJobTitle(initialPreset.role);
      setCompanyName(initialPreset.company);
    } catch (e) {}
  }, []);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    try {
      localStorage.setItem("careermatch_gemini_api_key", key);
    } catch (e) {}
  };

  const handleSaveModelName = (model) => {
    setModelName(model);
    try {
      localStorage.setItem("careermatch_gemini_model", model);
    } catch (e) {}
  };

  const handleLoadSample = (preset) => {
    setResumeText(preset.resume);
    setFileName(`${preset.title.replace(/\s+/g, "_")}_Resume.pdf`);
    setJdText(preset.jd);
    setJobTitle(preset.role);
    setCompanyName(preset.company);
    setAnalysisResult(null);
    setTailoredBullets(null);
    setInterviewQuestions(null);
    setErrorMsg(null);
    showToast({
      type: "success",
      message: `Loaded "${preset.title}" preset data!`,
    });
  };

  const handleLoadHistoricalRecord = (record) => {
    setAnalysisResult(record);
    if (record.resumeText) setResumeText(record.resumeText);
    if (record.jdText) setJdText(record.jdText);
    if (record.targetRole) setJobTitle(record.targetRole);
    if (record.companyName) setCompanyName(record.companyName);
    if (record.tailoredBullets) setTailoredBullets(record.tailoredBullets);
    if (record.interviewQuestions) setInterviewQuestions(record.interviewQuestions);
    setErrorMsg(null);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // 1. Core Match & Gap Analysis
  const handleRunAnalysis = async () => {
    if (!resumeText || !resumeText.trim()) {
      showToast({ type: "error", message: "Please upload or paste your resume text." });
      return;
    }
    if (!jdText || !jdText.trim()) {
      showToast({ type: "error", message: "Please paste a job description." });
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);
    setTailoredBullets(null);
    setInterviewQuestions(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jdText,
          apiKey,
          modelName,
          saveToDb: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAnalysisResult(data.data);
        showToast({
          type: "success",
          message: `Analysis completed! Match Score: ${data.data.matchScore}%`,
        });
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else {
        const errorText = data.error || "Failed to analyze resume match.";
        setErrorMsg(errorText);
        showToast({ type: "error", message: errorText });
        if (errorText.toLowerCase().includes("api key") || errorText.toLowerCase().includes("gemini")) {
          setIsSettingsOpen(true);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error while connecting to analysis API.");
      showToast({ type: "error", message: err.message || "Network error." });
    } finally {
      setAnalyzing(false);
    }
  };

  // 2. Generate Tailored STAR Bullets
  const handleGenerateBullets = async () => {
    if (!resumeText || !jdText) return;

    setGeneratingBullets(true);
    try {
      const res = await fetch("/api/generate-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jdText,
          targetRole: jobTitle || analysisResult?.targetRole || "",
          analysisId: analysisResult?.id,
          apiKey,
          modelName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTailoredBullets(data.data);
        showToast({
          type: "success",
          message: `Generated ${data.data.length} tailored STAR bullets!`,
        });
      } else {
        showToast({ type: "error", message: data.error || "Failed to generate bullets." });
      }
    } catch (err) {
      showToast({ type: "error", message: "Failed to generate tailored bullets." });
    } finally {
      setGeneratingBullets(false);
    }
  };

  // 3. Generate Mock Interview Questions
  const handleGenerateQuestions = async () => {
    if (!resumeText || !jdText) return;

    setGeneratingQuestions(true);
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jdText,
          targetRole: jobTitle || analysisResult?.targetRole || "",
          missingSkills: analysisResult?.missingSkills || [],
          analysisId: analysisResult?.id,
          apiKey,
          modelName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInterviewQuestions(data.data);
        showToast({
          type: "success",
          message: `Generated ${data.data.length} mock interview questions!`,
        });
      } else {
        showToast({ type: "error", message: data.error || "Failed to create mock interview." });
      }
    } catch (err) {
      showToast({ type: "error", message: "Failed to generate mock interview questions." });
    } finally {
      setGeneratingQuestions(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        apiKey={apiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLoadSample={handleLoadSample}
        historyCount={historyCount}
      />

      {/* Hero Header Section */}
      <section className="pt-8 pb-6 px-4 sm:px-6 max-w-6xl mx-auto w-full text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Resume–JD Matcher & Career Coach
        </h1>

        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
          Evaluate your resume against any job description, diagnose skill gaps, generate tailored STAR bullets, and practice mock interview questions.
        </p>

        {/* Feature Badges */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs text-slate-500 flex-wrap font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>0-100 Fit Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Gap Diagnostics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>STAR Bullets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
            <span>Interview Prep</span>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* Column 1: Resume Upload / Editor */}
          <div className="h-full">
            <ResumeUpload
              resumeText={resumeText}
              onChangeResumeText={setResumeText}
              fileName={fileName}
              setFileName={setFileName}
              showToast={showToast}
            />
          </div>

          {/* Column 2: Job Description Input */}
          <div className="h-full">
            <JDInput
              jdText={jdText}
              onChangeJdText={setJdText}
              jobTitle={jobTitle}
              onChangeJobTitle={setJobTitle}
              companyName={companyName}
              onChangeCompanyName={setCompanyName}
              showToast={showToast}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block">Error</span>
                <span>{errorMsg}</span>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1 rounded bg-white text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              Configure API Key
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col items-center justify-center gap-2 pt-1">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing || !resumeText || !jdText}
            className="w-full sm:w-auto min-w-[260px] px-6 py-3 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing with Gemini...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Compute Match & Gap Diagnostics</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-400">
            Powered by Gemini 3.6 Flash
          </p>
        </div>

        {/* Results Container */}
        <div ref={resultsRef} className="pt-2">
          {analysisResult && (
            <div>
              <ResultsTabs
                analysis={analysisResult}
                tailoredBullets={tailoredBullets}
                onGenerateBullets={handleGenerateBullets}
                generatingBullets={generatingBullets}
                interviewQuestions={interviewQuestions}
                onGenerateQuestions={handleGenerateQuestions}
                generatingQuestions={generatingQuestions}
                jdText={jdText}
                apiKey={apiKey}
                modelName={modelName}
                showToast={showToast}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Resume–JD Matcher & Career Coach</span>
          <span className="text-[11px] text-slate-400">Next.js • Gemini NLP Engine</span>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        modelName={modelName}
        onSaveModelName={handleSaveModelName}
        showToast={showToast}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadAnalysis={handleLoadHistoricalRecord}
        showToast={showToast}
        onHistoryUpdated={(count) => setHistoryCount(count)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
