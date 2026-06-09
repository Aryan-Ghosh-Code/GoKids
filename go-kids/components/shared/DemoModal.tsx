import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentType: "attention" | "writing" | null;
}

const attentionQuestions = [
  "Spot the difference between these two complex patterns within 30 seconds.",
  "Listen to this short 1-minute story and recount the sequence of 3 key events.",
  "Follow the moving dot on the screen without getting distracted by the flashing lights.",
  "Sort these mixed-up numbers into ascending order while a metronome ticks."
];

const writingQuestions = [
  "Write a short 3-sentence paragraph describing your favorite weekend activity.",
  "Copy the following sentence exactly as written, paying attention to spacing and punctuation.",
  "Rewrite this jumbled sentence so it makes grammatical sense.",
  "Look at this picture and write two words that describe how the character might be feeling."
];

export function DemoModal({ isOpen, onClose, assessmentType }: DemoModalProps) {
  const questions = assessmentType === "attention" ? attentionQuestions : writingQuestions;
  const title = assessmentType === "attention" ? "Attention Span - Demo Questions" : "Writing Ability - Demo Questions";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-4xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="mt-0.5 text-teal">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{q}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-black hover:shadow-lg"
              >
                Close Demo
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
