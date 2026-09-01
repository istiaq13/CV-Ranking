"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";
  const isInfo = toast.type === "info";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg bg-white border border-slate-200 text-slate-800 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md">
      {isError ? (
        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
      ) : isInfo ? (
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      )}
      <div className="text-xs font-medium text-slate-800 flex-1">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
