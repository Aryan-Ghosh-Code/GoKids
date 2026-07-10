"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Users } from "lucide-react";
import ChildCard, { type ChildData } from "@/components/dashboard/ChildCard";
import ChildFormDialog from "@/components/dashboard/ChildFormDialog";
import DeleteChildDialog from "@/components/dashboard/DeleteChildDialog";

// ─── Empty State SVG ───────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      {/* Illustrated SVG */}
      <div className="mb-8">
        <svg
          width="180"
          height="160"
          viewBox="0 0 180 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground */}
          <ellipse cx="90" cy="148" rx="60" ry="8" fill="#F3F4F6" />
          {/* Body */}
          <rect x="62" y="88" width="56" height="58" rx="16" fill="#F5C518" />
          {/* Shirt stripe */}
          <rect x="62" y="104" width="56" height="8" fill="#FFD84D" />
          {/* Head */}
          <circle cx="90" cy="72" r="26" fill="#FDDCAB" />
          {/* Eyes */}
          <circle cx="82" cy="68" r="3.5" fill="#1A1A1A" />
          <circle cx="98" cy="68" r="3.5" fill="#1A1A1A" />
          <circle cx="83.2" cy="67" r="1.2" fill="#FFFFFF" />
          <circle cx="99.2" cy="67" r="1.2" fill="#FFFFFF" />
          {/* Smile */}
          <path
            d="M83 77 Q90 84 97 77"
            stroke="#C07A35"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hair */}
          <path d="M64 62 Q68 44 90 44 Q112 44 116 62" fill="#4A2C17" />
          <ellipse cx="90" cy="46" rx="22" ry="10" fill="#4A2C17" />
          {/* Left arm */}
          <rect
            x="40"
            y="90"
            width="24"
            height="12"
            rx="6"
            fill="#F5C518"
            transform="rotate(-20 40 90)"
          />
          {/* Right arm */}
          <rect
            x="116"
            y="90"
            width="24"
            height="12"
            rx="6"
            fill="#F5C518"
            transform="rotate(20 116 90)"
          />
          {/* Legs */}
          <rect x="68" y="138" width="16" height="12" rx="6" fill="#2BBCB0" />
          <rect x="96" y="138" width="16" height="12" rx="6" fill="#2BBCB0" />
          {/* Stars */}
          <circle cx="30" cy="40" r="4" fill="#F5C518" opacity="0.6" />
          <circle cx="150" cy="30" r="3" fill="#F4845F" opacity="0.7" />
          <circle cx="160" cy="70" r="2.5" fill="#2BBCB0" opacity="0.6" />
          <circle cx="20" cy="80" r="2" fill="#4FC3F7" opacity="0.7" />
          {/* Plus badge */}
          <circle
            cx="148"
            cy="50"
            r="14"
            fill="#FFF9E6"
            stroke="#F5C518"
            strokeWidth="2"
          />
          <line
            x1="148"
            y1="44"
            x2="148"
            y2="56"
            stroke="#F5C518"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="142"
            y1="50"
            x2="154"
            y2="50"
            stroke="#F5C518"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2
        className="text-2xl font-extrabold mb-2"
        style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
      >
        No children yet!
      </h2>
      <p className="text-sm max-w-xs mb-8" style={{ color: "#6B7280" }}>
        Add your child&apos;s profile to get personalised workshop
        recommendations, assessments, and mentors.
      </p>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg active:scale-95"
        style={{
          background: "#F5C518",
          color: "#1A1A1A",
          fontFamily: "var(--font-nunito)",
          boxShadow: "0 4px 18px rgba(245,197,24,0.4)",
        }}
      >
        <Plus size={18} />
        Add Your First Child
      </button>
    </motion.div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────
export default function ChildrenPageClient() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editChild, setEditChild] = useState<ChildData | null>(null);
  const [deleteChild, setDeleteChild] = useState<ChildData | null>(null);

  // Fetch children on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/children");
        const result = await res.json();
        if (result.success) setChildren(result.data);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdded = (child: ChildData) => {
    setChildren((prev) => [child, ...prev]);
  };

  const handleEdited = (updated: ChildData) => {
    setChildren((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c)),
    );
  };

  const handleDeleted = (id: string) => {
    setChildren((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-extrabold"
            style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
          >
            My Children
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            {children.length > 0
              ? `${children.length} child profile${children.length !== 1 ? "s" : ""}`
              : "Manage your children's profiles"}
          </p>
        </div>

        {children.length > 0 && (
          <button
            onClick={() => {
              setEditChild(null);
              setAddOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-md active:scale-95"
            style={{
              background: "#F5C518",
              color: "#1A1A1A",
              fontFamily: "var(--font-nunito)",
              boxShadow: "0 4px 14px rgba(245,197,24,0.35)",
            }}
          >
            <Plus size={16} />
            Add Child
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: "#F5C518" }}
          />
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && children.length === 0 && (
        <EmptyState
          onAdd={() => {
            setEditChild(null);
            setAddOpen(true);
          }}
        />
      )}

      {/* ── Children Grid ── */}
      {!loading && children.length > 0 && (
        <AnimatePresence mode="popLayout">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            layout
          >
            {children.map((child, i) => (
              <ChildCard
                key={child._id}
                child={child}
                index={i}
                onEdit={(c) => {
                  setEditChild(c);
                  setAddOpen(true);
                }}
                onDelete={(c) => setDeleteChild(c)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Count chip when there are children ── */}
      {!loading && children.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center gap-2 text-sm"
          style={{ color: "#9CA3AF" }}
        >
          <Users size={14} />
          <span>
            {children.length} profile{children.length !== 1 ? "s" : ""} added
          </span>
        </motion.div>
      )}

      {/* ── Dialogs ── */}
      <ChildFormDialog
        open={addOpen}
        onOpenChange={(o) => {
          setAddOpen(o);
          if (!o) setEditChild(null);
        }}
        editChild={editChild}
        onSuccess={editChild ? handleEdited : handleAdded}
      />

      <DeleteChildDialog
        open={!!deleteChild}
        onOpenChange={(o) => {
          if (!o) setDeleteChild(null);
        }}
        child={deleteChild}
        onSuccess={handleDeleted}
      />
    </div>
  );
}
