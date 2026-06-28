"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Brain,
  Compass,
  MessageSquare,
  BookOpen,
  Heart,
  FlaskConical,
  Trophy,
  ChevronDown,
} from "lucide-react";
import MentorCard from "./MentorCard";
import type { IMentor } from "@/lib/db/models/Mentor";

const CATEGORY_MAP: Record<string, { label: string; icon: React.ComponentType<{ size: number }>; bg: string; color: string; border: string }> = {
  "psychology": { label: "Child Psychology", icon: Brain, bg: "#E8F4FD", color: "#1A6FA0", border: "#B3D9F2" },
  "career": { label: "Career Guidance", icon: Compass, bg: "#F3EEFF", color: "#6B3BA7", border: "#D8C4F8" },
  "communication": { label: "Communication", icon: MessageSquare, bg: "#FFF9E6", color: "#92650A", border: "#F5C518" },
  "academic support": { label: "Academic Support", icon: BookOpen, bg: "#FEF0EB", color: "#B94E2A", border: "#F9C4AF" },
  "emotional intelligence": { label: "Emotional Intelligence", icon: Heart, bg: "#FFF0F5", color: "#C026D3", border: "#FBCFE8" },
  "stem": { label: "STEM & Coding", icon: FlaskConical, bg: "#E8F8F7", color: "#1A7A72", border: "#B2EAE6" },
  "leadership": { label: "Leadership & Goals", icon: Trophy, bg: "#FEF9C3", color: "#854D0E", border: "#FDE047" },
};

const LANGUAGES = ["Hindi", "English", "Gujarati", "Punjabi", "Tamil", "Marathi"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
];
const PAGE_SIZE = 6;

interface MentorsClientProps {
  initialMentors: IMentor[];
  initialTotal: number;
}

export default function MentorsClient({ initialMentors, initialTotal }: MentorsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mentors, setMentors]         = useState<IMentor[]>(initialMentors);
  const [total, setTotal]             = useState(initialTotal);
  const [loading, setLoading]         = useState(false);
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState("");
  const [debouncedQ, setDebouncedQ]   = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLang, setActiveLang]   = useState<string[]>([]);
  const [sort, setSort]               = useState("newest");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [sortOpen, setSortOpen]       = useState(false);
  const [sortMenuPos, setSortMenuPos] = useState({ top: 0, right: 0 });
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const sortBtnRef = useRef<HTMLButtonElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Extract categories dynamically from the loaded mentor list
  useEffect(() => {
    const cats = new Set<string>();
    if (Array.isArray(initialMentors)) {
      initialMentors.forEach(m => {
        if (m && Array.isArray(m.categories)) {
          m.categories.forEach(c => cats.add(c));
        }
      });
    }
    setDynamicCategories(Array.from(cats).filter(Boolean));
  }, [initialMentors]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      params.set("sort", sort);
      if (debouncedQ)               params.set("q", debouncedQ);
      if (activeCategory !== "All") params.set("category", activeCategory);
      activeLang.forEach((l) => params.append("language", l));

      const res = await fetch(`/api/mentors?${params}`);
      const result = await res.json();
      if (result.success) {
        setMentors(result.data.mentors);
        setTotal(result.data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, sort, debouncedQ, activeCategory, activeLang]);

  useEffect(() => { fetchMentors(); }, [fetchMentors]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedQ, activeCategory, activeLang, sort]);

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    scrollToGrid();
  };

  const toggleLang = (lang: string) => {
    setActiveLang((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveLang([]);
    setSearch("");
    setSort("newest");
    setPage(1);
  };

  const hasFilters = activeCategory !== "All" || activeLang.length > 0 || search !== "";

  // Render categories dynamically mapped with preset colors or fallbacks
  const renderedCategories = [
    { id: "All", label: "All Mentors", category: "All", icon: Sparkles, bg: "#F3F4F6", color: "#4B5563", border: "#E5E7EB" },
    ...dynamicCategories.map(cat => {
      const spec = CATEGORY_MAP[cat.toLowerCase()] || {
        label: cat,
        icon: Sparkles,
        bg: "#F9FAFB",
        color: "#6B7280",
        border: "#E5E7EB"
      };
      return {
        id: cat,
        label: spec.label,
        category: cat,
        icon: spec.icon,
        bg: spec.bg,
        color: spec.color,
        border: spec.border
      };
    })
  ];

  return (
    <div id="mentors-grid" ref={gridRef} className="space-y-6">
      {/* ── Filter + Search bar ──────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl p-3 sm:p-4 border flex flex-col gap-3 overflow-visible"
        style={{ borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        {/* Row 1: Search + Sort */}
        <div className="flex flex-row gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, expertise, or keyword…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
            style={{
              background: "#F9FAFB",
              border: "1.5px solid #E5E7EB",
              color: "#1A1A1A",
              fontFamily: "var(--font-nunito)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#F5C518")}
            onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort + Filter controls */}
        <div className="flex gap-2 items-center flex-shrink-0">
          {/* Custom styled sort dropdown — portal-rendered so no parent clips it */}
          <div className="relative">
            <button
              ref={sortBtnRef}
              type="button"
              onClick={() => {
                if (!sortOpen && sortBtnRef.current) {
                  const r = sortBtnRef.current.getBoundingClientRect();
                  setSortMenuPos({
                    top: r.bottom + 6,
                    right: window.innerWidth - r.right,
                  });
                }
                setSortOpen(!sortOpen);
              }}
              onBlur={() => setTimeout(() => setSortOpen(false), 150)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl text-sm font-bold outline-none cursor-pointer inline-flex items-center gap-2 whitespace-nowrap transition-all"
              style={{
                background: sortOpen ? "#FFFBEA" : "#F9FAFB",
                border: sortOpen ? "1.5px solid #F5C518" : "1.5px solid #E5E7EB",
                color: sortOpen ? "#92650A" : "#1A1A1A",
                fontFamily: "var(--font-nunito)",
              }}
            >
              {SORT_OPTIONS.find(o => o.value === sort)?.label || "Sort"}
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 absolute right-2.5 flex-shrink-0 ${sortOpen ? 'rotate-180 text-amber-500' : 'text-gray-400'}`}
              />
            </button>

            {/* Portal dropdown — renders at body level, never clipped */}
            {sortOpen && typeof document !== "undefined" && createPortal(
              <div
                className="fixed bg-white rounded-2xl border border-gray-100 py-1.5"
                style={{
                  top: sortMenuPos.top,
                  right: Math.max(8, sortMenuPos.right),
                  minWidth: "160px",
                  zIndex: 9999,
                  boxShadow: "0 16px 40px -8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onMouseDown={() => { setSort(o.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between gap-2 ${
                      sort === o.value
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {o.label}
                    {sort === o.value && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                        <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>,
              document.body
            )}
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setFilterOpen(true)}
            className="flex sm:hidden items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-all"
            style={{
              background: hasFilters ? "#FFF9E6" : "#F9FAFB",
              border: hasFilters ? "1.5px solid #F5C518" : "1.5px solid #E5E7EB",
              color: "#1A1A1A",
            }}
          >
            <SlidersHorizontal size={14} />
            {hasFilters && (
              <span
                className="w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center"
                style={{ background: "#F5C518", color: "#1A1A1A" }}
              >
                {(activeCategory !== "All" ? 1 : 0) + activeLang.length}
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-2.5 rounded-xl transition-all hover:bg-red-50 text-red-500 whitespace-nowrap"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
        </div>{/* end Row 1 */}

        {/* Category pills — inside the filter card */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2.5" style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}>
            Browse by Category
          </p>
          <div className="flex flex-wrap gap-2">
            {renderedCategories.map((card) => {
              const Icon = card.icon;
              const isSelected = activeCategory === card.category;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCategoryClick(card.category)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                  style={{
                    background: isSelected ? "#F5C518" : card.bg,
                    color: isSelected ? "#1A1A1A" : card.color,
                    border: isSelected ? "1.5px solid #D4A900" : `1.5px solid ${card.border}`,
                    boxShadow: isSelected ? "0 4px 14px rgba(245,197,24,0.3)" : "none",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  <Icon size={11} />
                  {card.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Layout (Sidebar + Grid) ─────────────────────────────── */}
      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden sm:block w-56 flex-shrink-0">
          <div
            className="bg-white rounded-3xl p-5 sticky top-28 border"
            style={{ borderColor: "#E5E7EB", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <span className="text-sm font-extrabold" style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}>
                Filter By Language
              </span>
              {activeLang.length > 0 && (
                <button
                  onClick={() => setActiveLang([])}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Languages List */}
            <div className="flex flex-col gap-2.5">
              {LANGUAGES.map((lang) => (
                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={activeLang.includes(lang)}
                    onChange={() => toggleLang(lang)}
                    className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                  />
                  <span
                    className="text-xs font-bold group-hover:text-amber-600 transition-colors"
                    style={{ color: activeLang.includes(lang) ? "#1A1A1A" : "#6B7280", fontFamily: "var(--font-nunito)" }}
                  >
                    {lang}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Mentors Grid Container */}
        <div className="flex-1 min-w-0">
          {/* Active Filter Info / Count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-extrabold text-gray-700" style={{ fontFamily: "var(--font-nunito)" }}>
              {loading ? "Updating results…" : `${total} Expert Mentor${total !== 1 ? "s" : ""} Available`}
            </p>
            {activeCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Category: {activeCategory}
                <button onClick={() => setActiveCategory("All")} className="hover:text-amber-950">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-24"
              >
                <Loader2 size={36} className="animate-spin" style={{ color: "#F5C518" }} />
              </motion.div>
            ) : mentors.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl mb-4">🔍</div>
                <h3
                  className="text-xl font-extrabold mb-2"
                  style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
                >
                  No mentors match your search criteria
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md">
                  We couldn&apos;t find any mentors for this combination. Try clearing some filters or searching for another topic.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-2xl text-xs font-extrabold transition-all hover:scale-105 shadow-md"
                  style={{ background: "#F5C518", color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {mentors.map((mentor, i) => (
                  <MentorCard key={String(mentor._id)} mentor={mentor} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => { setPage((p) => Math.max(1, p - 1)); scrollToGrid(); }}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-extrabold border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF9E6]"
                style={{ border: "1.5px solid #E5E7EB", color: "#1A1A1A" }}
              >
                <ChevronLeft size={14} /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | "…")[]>((acc, n, i, arr) => {
                  if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "…" ? (
                    <span key={`ellipsis-${idx}`} className="text-xs text-gray-400 px-1 font-bold">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => { setPage(item as number); scrollToGrid(); }}
                      className="w-10 h-10 rounded-2xl text-xs font-extrabold transition-all"
                      style={{
                        background: page === item ? "#F5C518" : "#FFFFFF",
                        color: "#1A1A1A",
                        border: page === item ? "none" : "1.5px solid #E5E7EB",
                        boxShadow: page === item ? "0 4px 14px rgba(245,197,24,0.4)" : "none",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); scrollToGrid(); }}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-extrabold border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF9E6]"
                style={{ border: "1.5px solid #E5E7EB", color: "#1A1A1A" }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-50 overflow-y-auto p-6"
              style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b">
                <span className="text-lg font-extrabold" style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}>
                  Filter Options
                </span>
                <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              <p className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                Languages Spoken
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {LANGUAGES.map((lang) => (
                  <label key={lang} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeLang.includes(lang)}
                      onChange={() => toggleLang(lang)}
                      className="w-4 h-4 rounded accent-amber-400"
                    />
                    <span className="text-sm font-bold text-gray-800" style={{ fontFamily: "var(--font-nunito)" }}>{lang}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { clearFilters(); setFilterOpen(false); }}
                  className="flex-1 py-3 rounded-2xl text-xs font-extrabold border transition-all"
                  style={{ border: "1.5px solid #E5E7EB", color: "#6B7280" }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-extrabold transition-all"
                  style={{ background: "#F5C518", color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
