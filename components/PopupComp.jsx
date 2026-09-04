"use client";
import React, { useEffect, useRef } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";

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

const PopupComp = ({ isOpen, onClose, PopupData }) => {
  const buttonRef = useRef(null);

  // Focus the action on open + allow Escape to dismiss (keyboard users,
  // screen readers, and automated tests all need a reliable path).
  useEffect(() => {
    if (!isOpen) return;
    buttonRef.current?.focus();
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
      role="dialog"
      aria-modal="true"
      aria-label={PopupData?.header || "Notice"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary to-primary/70 px-6 py-5 text-primary-foreground">
          <span className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            <h2 className="text-lg font-bold">{PopupData?.header}</h2>
          </span>
          {PopupData?.description && (
            <p className="mt-1 text-sm opacity-90">{PopupData?.description}</p>
          )}
        </div>
        <ul className="space-y-2.5 px-6 py-5">
          {(PopupData?.message ?? []).map((message, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span className="text-muted-foreground">{message}</span>
            </li>
          ))}
        </ul>
        <div className="border-t px-6 py-4">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleClose}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupComp;
