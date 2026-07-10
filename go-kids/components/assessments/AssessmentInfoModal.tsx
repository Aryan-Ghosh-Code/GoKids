"use client";

import { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AssessmentModalContent } from "@/components/assessments/attention-span/constants/modalContent";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssessmentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  /** All copy/data for the assessment — injected by the caller */
  content: AssessmentModalContent;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssessmentInfoModal({
  isOpen,
  onClose,
  onProceed,
  content,
}: AssessmentInfoModalProps) {
  const [declared, setDeclared] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Lock body scroll while modal is visible
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl border border-gray-100"
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2
            className="text-xl font-extrabold text-brand-black flex items-center gap-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span>{content.emoji}</span> {content.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable content ──────────────────────────────────────────── */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* About */}
          <section className="space-y-4">
            <h3
              className="text-base font-extrabold text-brand-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              About this assessment
            </h3>
            {content.aboutParagraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm text-gray-600 leading-relaxed font-semibold"
              >
                {para}
              </p>
            ))}

            {/* Dimension chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {content.chips.map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold"
                    style={{ background: chip.bg, color: chip.color }}
                  >
                    <Icon size={14} />
                    <span>{chip.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Assessment Structure */}
          <section className="space-y-3">
            <h3
              className="text-base font-extrabold text-brand-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Assessment Structure
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.partCards.map((card) => (
                <div
                  key={card.label}
                  className="p-4 rounded-2xl border"
                  style={{
                    background: card.bg,
                    borderColor: `${card.color}25`,
                  }}
                >
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-wider mb-1 block"
                    style={{
                      color: card.color,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {card.who}
                  </span>
                  <p
                    className="text-xs font-extrabold text-brand-black mb-1.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {card.label}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Total time row */}
            <div className="flex items-center gap-2 mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Clock size={15} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600 font-semibold">
                <strong className="text-brand-black">Total time:</strong>{" "}
                {content.totalTime}
              </span>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="space-y-3">
            <h3
              className="text-base font-extrabold text-brand-black flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <HelpCircle size={18} className="text-teal" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-2">
              {content.faqs.map((faq, idx) => {
                const expanded = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(expanded ? null : idx)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-brand-black hover:bg-gray-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {expanded ? (
                        <ChevronUp
                          size={16}
                          className="text-gray-400 shrink-0"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-gray-400 shrink-0"
                        />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 pt-1 text-xs text-gray-500 leading-relaxed font-semibold">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="p-4 bg-amber-50/70 border border-amber-200/50 rounded-2xl space-y-2">
            <h4
              className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <AlertTriangle size={15} /> Disclaimer
            </h4>
            <p className="text-[10px] text-amber-700 leading-relaxed font-semibold">
              {content.disclaimerText}
            </p>
          </section>

          {/* Consent checkbox */}
          <section className="pt-2">
            <button
              onClick={() => setDeclared((d) => !d)}
              className="flex items-start gap-3 w-full text-left p-3.5 rounded-xl border-2 transition-all hover:bg-gray-50/50"
              style={{ borderColor: declared ? "#F5C518" : "#E5E7EB" }}
            >
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                style={{
                  borderColor: declared ? "#F5C518" : "#9CA3AF",
                  background: declared ? "#F5C518" : "transparent",
                }}
              >
                {declared && (
                  <ShieldCheck
                    size={14}
                    className="stroke-3 text-brand-black"
                  />
                )}
              </div>
              <span className="text-xs text-gray-600 font-semibold leading-relaxed">
                {content.consentLabel}
              </span>
            </button>
          </section>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end bg-gray-50 rounded-b-3xl">
          <motion.button
            whileHover={{ scale: declared ? 1.02 : 1 }}
            whileTap={{ scale: declared ? 0.98 : 1 }}
            onClick={declared ? onProceed : undefined}
            disabled={!declared}
            className="px-6 py-3 rounded-2xl font-extrabold text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: declared ? "#F5C518" : "#E5E7EB",
              color: declared ? "#1A1A1A" : "#9CA3AF",
              fontFamily: "var(--font-heading)",
              boxShadow: declared ? "0 4px 12px rgba(245,197,24,0.3)" : "none",
            }}
          >
            Begin Assessment →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
