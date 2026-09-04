"use client";
import React, { useEffect } from "react";
import { BellRing, CheckCircle2, X } from "lucide-react";

const STORAGE_KEY = "recruitment-notice-dismissed";

export function wasNoticeDismissed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markNoticeDismissed() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // storage unavailable — dismissal just won't persist
  }
}

// Non-blocking welcome banner: floats bottom-center, never covers the page,
// dismissible via Got it, X, or Escape. Persists dismissal per session.
const PopupComp = ({ isOpen, onClose, PopupData }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    markNoticeDismissed();
    onClose?.();
  };

  return (
    <div
      role="status"
      aria-label={PopupData?.header || "Notice"}
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-md"
    >
      <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-primary to-primary/70 px-5 py-3.5 text-primary-foreground">
          <span className="flex items-center gap-2">
            <BellRing className="h-4 w-4 shrink-0" />
            <strong className="text-sm">{PopupData?.header}</strong>
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Dismiss notice"
            className="rounded-md p-1 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">
          {PopupData?.description && (
            <p className="text-[13px] text-muted-foreground">{PopupData?.description}</p>
          )}
          <ul className="mt-2 space-y-1.5">
            {(PopupData?.message ?? []).map((message, index) => (
              <li key={index} className="flex items-start gap-2 text-[13px]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                <span className="text-muted-foreground">{message}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleClose}
            className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupComp;
