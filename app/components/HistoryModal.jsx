"use client";

import { useState, useEffect } from "react";
import { X, History, Trash2, ArrowUpRight, Calendar, User, Briefcase, Loader2, Sparkles } from "lucide-react";

export default function HistoryModal({
  isOpen,
  onClose,
  onLoadAnalysis,
  showToast,
  onHistoryUpdated,
}) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (res.ok && data.success) {
        setHistoryItems(data.data || []);
        if (onHistoryUpdated) onHistoryUpdated(data.data.length);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = historyItems.filter((item) => item.id !== id);
        setHistoryItems(updated);
        if (onHistoryUpdated) onHistoryUpdated(updated.length);
        showToast({ type: "success", message: "Record deleted." });
      }
    } catch (err) {
      showToast({ type: "error", message: "Failed to delete record." });
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Clear all analysis history?")) return;
    try {
      const res = await fetch(`/api/history`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setHistoryItems([]);
        if (onHistoryUpdated) onHistoryUpdated(0);
        showToast({ type: "success", message: "History cleared." });
      }
    } catch (err) {
      showToast({ type: "error", message: "Failed to clear history." });
    }
  };

  const handleSelectRecord = async (id) => {
    try {
      const res = await fetch(`/api/history?id=${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        onLoadAnalysis(data.data);
        onClose();
        showToast({ type: "success", message: "Loaded past analysis!" });
      }
    } catch (err) {
      showToast({ type: "error", message: "Failed to load record." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-xl p-6 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Analysis History</h2>
              <p className="text-xs text-slate-500">Saved past comparisons</p>
            </div>
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-1">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              <span className="text-xs">Loading history...</span>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-1.5">
              <p className="text-sm font-medium text-slate-600">No saved analyses yet</p>
              <p className="text-xs text-slate-400">
                Run a match analysis to record your results here.
              </p>
            </div>
          ) : (
            historyItems.map((item) => {
              const score = item.matchScore || 0;
              const scoreBadge =
                score >= 80
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : score >= 60
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-rose-50 text-rose-700 border-rose-200";

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectRecord(item.id)}
                  className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {item.targetRole || "Position"}
                      </span>
                      {item.companyName && (
                        <span className="text-xs text-slate-500 truncate">
                          at {item.companyName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{item.candidateName || "Candidate"}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div
                      className={`px-2.5 py-1 rounded text-xs font-bold border flex items-center justify-center min-w-[50px] ${scoreBadge}`}
                    >
                      {score}%
                    </div>

                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      disabled={deletingId === item.id}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete record"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
