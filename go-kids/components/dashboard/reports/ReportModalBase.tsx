"use client";

import { useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

interface ReportModalBaseProps {
  /** Pass null/undefined to hide the modal */
  open: boolean;
  onClose: () => void;

  /** Tint colour for the hero header (hex) */
  accentColor: string;

  /** Header content: emoji box, title, tagline, meta strip */
  header: ReactNode;

  /** Scrollable main content */
  children: ReactNode;

  /** Extra footer actions before the Download button (optional) */
  footerExtra?: ReactNode;
}

export default function ReportModalBase({
  open,
  onClose,
  accentColor,
  header,
  children,
  footerExtra,
}: ReportModalBaseProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="report-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60"
          />

          {/* Modal shell */}
          <motion.div
            key="report-modal"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl top-[2%] z-[61] flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
            style={{ border: "1px solid #E5E7EB" }}
          >
            {/* ── Colour hero header ── */}
            <div
              className="shrink-0 relative px-6 pt-6 pb-5 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 100%)`,
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.06]"
                style={{ background: accentColor }}
              />
              <div
                className="absolute -bottom-4 right-16 w-16 h-16 rounded-full opacity-[0.04]"
                style={{ background: accentColor }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/8 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={16} color="#6B7280" />
              </button>

              {header}
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {children}
              <div className="pb-2" />
            </div>

            {/* ── Pinned footer ── */}
            <div className="shrink-0 px-5 py-4 border-t border-[#F0F0F0] bg-white rounded-b-3xl flex gap-3">
              {footerExtra}
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-bold border transition-colors cursor-pointer hover:bg-gray-50"
                style={{
                  borderColor: "#E5E7EB",
                  color: "#6B7280",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                Close
              </button>
              <button
                disabled
                title="PDF download coming soon"
                className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                style={{
                  background: "#F5C518",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-nunito)",
                  opacity: 0.45,
                }}
              >
                <Download size={14} />
                Download PDF
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
