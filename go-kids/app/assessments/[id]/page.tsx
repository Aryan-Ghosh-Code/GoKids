"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  attentionSpanModalContent,
  type AssessmentModalContent,
} from "@/components/assessments/attention-span/constants/modalContent";

// ─── Content Registry ─────────────────────────────────────────────────────────
// Maps assessment slug → { content, assessmentHref }
// Add new assessments here as they are built.
const ASSESSMENT_REGISTRY: Record<
  string,
  { content: AssessmentModalContent; assessmentHref: string }
> = {
  "attention-span": {
    content: attentionSpanModalContent,
    assessmentHref: "/parent/assessments/attention-span",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssessmentInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [declared, setDeclared] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const registry = ASSESSMENT_REGISTRY[id];

  // Unknown slug — graceful fallback
  if (!registry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-semibold">Assessment not found.</p>
        <button
          onClick={() => router.push("/assessments")}
          className="text-sm font-bold underline"
          style={{ color: "#2BBCB0" }}
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  const { content, assessmentHref } = registry;

  const handleBegin = () => {
    if (declared) router.push(assessmentHref);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #FFFBEA 0%, #FAFAF8 20%, #FAFAF8 100%)",
      }}
    >
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Back link ────────────────────────────────────────────────── */}
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-brand-black transition-colors mb-8 cursor-pointer bg-transparent border-none p-0"
          >
            <ArrowLeft size={16} />
            Back
          </motion.button>

          {/* ── Page header ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{content.emoji}</span>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-black"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {content.title}
              </h1>
            </div>
            <p className="text-sm text-gray-500 font-semibold ml-1">
              Read through the details below and consent to begin.
            </p>
          </motion.div>

          {/* ── Two-column layout ─────────────────────────────────────────── */}
          {/*   Left  (2/5): FAQs                                              */}
          {/*   Right (3/5): About + Assessment Structure                       */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">

            {/* LEFT — About + Parts (3 / 5 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* About */}
              <div
                className="rounded-3xl p-6 sm:p-8"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                }}
              >
                <h2
                  className="text-base font-extrabold text-brand-black mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  About this assessment
                </h2>

                <div className="space-y-3 mb-5">
                  {content.aboutParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm text-gray-600 leading-relaxed font-semibold"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Dimension chips */}
                <div className="flex flex-wrap gap-2">
                  {content.chips.map((chip, idx) => {
                    const Icon = chip.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold"
                        style={{ background: chip.bg, color: chip.color }}
                      >
                        <Icon size={13} />
                        <span>{chip.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assessment Structure */}
              <div
                className="rounded-3xl p-6 sm:p-8"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                }}
              >
                <h2
                  className="text-base font-extrabold text-brand-black mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Assessment Structure
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {content.partCards.map((card) => (
                    <div
                      key={card.label}
                      className="p-4 rounded-2xl border"
                      style={{
                        background: card.bg,
                        borderColor: card.color + "25",
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

                {/* Total time */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Clock size={15} className="text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-600 font-semibold">
                    <strong className="text-brand-black">Total time:</strong>{" "}
                    {content.totalTime}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — FAQs (2 / 5 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2"
            >
              <div
                className="rounded-3xl p-6 sm:p-8 h-full"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                }}
              >
                <h2
                  className="text-base font-extrabold text-brand-black flex items-center gap-2 mb-5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <HelpCircle size={18} className="text-teal shrink-0" />
                  Frequently Asked Questions
                </h2>

                <div className="space-y-2">
                  {content.faqs.map((faq, idx) => {
                    const expanded = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-gray-100 rounded-2xl overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaq(expanded ? null : idx)}
                          className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-brand-black hover:bg-gray-50 transition-colors"
                        >
                          <span className="pr-3">{faq.q}</span>
                          {expanded ? (
                            <ChevronUp size={16} className="text-gray-400 shrink-0" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-400 shrink-0" />
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
                              <div className="px-4 pb-4 pt-1 text-xs text-gray-500 leading-relaxed font-semibold">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

          </div>

          {/* ── Disclaimer — full width ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-5 sm:p-6 mb-8"
            style={{
              background: "rgba(254,243,199,0.7)",
              border: "1px solid rgba(252,211,77,0.5)",
            }}
          >
            <h4
              className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <AlertTriangle size={14} /> Disclaimer
            </h4>
            <p className="text-[11px] sm:text-xs text-amber-700 leading-relaxed font-semibold">
              {content.disclaimerText}
            </p>
          </motion.div>

          {/* ── Consent + CTA ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-2xl mx-auto space-y-5"
          >
            {/* Consent checkbox */}
            <button
              onClick={() => setDeclared((d) => !d)}
              className="flex items-start gap-3 w-full text-left p-4 rounded-2xl border-2 transition-all hover:bg-white/60 cursor-pointer bg-white"
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
                  <ShieldCheck size={13} className="stroke-3 text-brand-black" />
                )}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                {content.consentLabel}
              </span>
            </button>

            {/* Begin button */}
            <motion.button
              whileHover={{ scale: declared ? 1.02 : 1 }}
              whileTap={{ scale: declared ? 0.97 : 1 }}
              onClick={handleBegin}
              disabled={!declared}
              className="w-full py-4 rounded-2xl font-extrabold text-base transition-all cursor-pointer disabled:cursor-not-allowed border-none"
              style={{
                background: declared ? "#F5C518" : "#E5E7EB",
                color: declared ? "#1A1A1A" : "#9CA3AF",
                fontFamily: "var(--font-heading)",
                boxShadow: declared
                  ? "0 8px 28px rgba(245,197,24,0.35)"
                  : "none",
              }}
            >
              Begin Assessment →
            </motion.button>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}