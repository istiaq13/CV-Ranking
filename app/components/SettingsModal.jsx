"use client";

import { useState } from "react";
import { X, Key, Cpu, ExternalLink, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  modelName,
  onSaveModelName,
  showToast,
}) {
  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [selectedModel, setSelectedModel] = useState(modelName || "gemini-3.6-flash");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    onSaveModelName(selectedModel);
    showToast({ type: "success", message: "Settings saved successfully!" });
    onClose();
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: "Please enter an API key first." });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: "Software Engineer with Python and SQL experience.",
          jdText: "Looking for Python backend developer.",
          apiKey: keyInput.trim(),
          modelName: selectedModel,
          saveToDb: false,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `Connected successfully with model: ${selectedModel}`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || "Failed to authenticate with Gemini API.",
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || "Network error while testing connection.",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">API Key & Model Settings</h2>
            <p className="text-xs text-slate-500">Configure your Google Gemini credentials</p>
          </div>
        </div>

        {/* Content Form */}
        <div className="space-y-4">
          {/* Gemini API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
              Gemini Model
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash", badge: "Default" },
                { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", badge: "Fast" },
                { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", badge: "Deep Reason" },
              ].map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-2.5 rounded-lg text-left border transition-all text-xs flex flex-col justify-between ${
                    selectedModel === model.id
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-semibold text-xs">{model.label}</span>
                  <span className={`text-[10px] mt-1 ${selectedModel === model.id ? "text-slate-300" : "text-slate-400"}`}>
                    {model.badge}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              placeholder="Or enter any custom model name"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                testResult.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testing || !keyInput.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
          >
            {testing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Key"
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
