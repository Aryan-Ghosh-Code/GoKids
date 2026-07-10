"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import type { ChildData } from "./ChildCard";

interface DeleteChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: ChildData | null;
  onSuccess: (id: string) => void;
}

export default function DeleteChildDialog({
  open,
  onOpenChange,
  child,
  onSuccess,
}: DeleteChildDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!child) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/children/${child._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        onSuccess(child._id);
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to delete. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  key="del-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  key="del-content"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-sm rounded-3xl bg-white shadow-2xl p-6"
                  style={{ border: "1px solid #F3F4F6" }}
                >
                  {/* Close */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-grey transition-colors"
                      aria-label="Close"
                    >
                      <X size={16} color="#9CA3AF" />
                    </button>
                  </Dialog.Close>

                  {/* Warning Icon — animated */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: "#FEF0EB" }}
                    animate={{ rotate: [0, -6, 6, -4, 4, 0] }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <AlertTriangle size={32} style={{ color: "#F4845F" }} />
                  </motion.div>

                  <Dialog.Title
                    className="text-lg font-extrabold text-center mb-1"
                    style={{
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    Delete Child Profile?
                  </Dialog.Title>
                  <Dialog.Description
                    className="text-sm text-center mb-5"
                    style={{ color: "#6B7280" }}
                  >
                    This will permanently delete{" "}
                    <span className="font-bold" style={{ color: "#1A1A1A" }}>
                      {child?.name}
                    </span>
                    &apos;s profile. This action cannot be undone.
                  </Dialog.Description>

                  {error && (
                    <p
                      className="text-xs text-center mb-4 font-medium"
                      style={{ color: "#C0392B" }}
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Dialog.Close asChild>
                      <button
                        className="flex-1 py-3 rounded-xl text-sm font-bold border transition-colors"
                        style={{
                          borderColor: "#E5E7EB",
                          color: "#6B7280",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                      style={{
                        background: "#F4845F",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-nunito)",
                        boxShadow: "0 4px 14px rgba(244,132,95,0.35)",
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />{" "}
                          Deleting…
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} /> Yes, Delete
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
