"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { Workshop } from "@/lib/data/workshops";
import WorkshopCard from "./WorkshopCard";
import FilterSidebar, { type FilterState } from "./FilterSidebar";

const SORT_OPTIONS = [
  { value: "newest",  label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating",  label: "Top Rated" },
] as const;

const EMPTY_FILTERS: FilterState = { level: [], ageGroup: [], skill: [] };
const PAGE_SIZE = 6;

// ─── Mobile Filter Drawer ─────────────────────────────────────────────────────
function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  ageGroups,
  skills,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
  ageGroups: string[];
  skills: string[];
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 max-w-full overflow-y-auto"
            style={{
              background: "white",
              boxShadow: "4px 0 32px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b hover:bg-brand-grey">
              <span
                className="text-base font-extrabold"
                style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
              >
                Filters
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-brand-grey transition-colors"
              >
                <X size={18} color="#6B7280" />
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                filters={filters}
                onChange={onChange}
                onClear={onClear}
                ageGroups={ageGroups}
                skills={skills}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── WorkshopsClient ──────────────────────────────────────────────────────────
interface WorkshopsClientProps {
  /** All workshops fetched server-side from MongoDB */
  workshops: Workshop[];
}

export default function WorkshopsClient({ workshops }: WorkshopsClientProps) {
  const [query, setQuery]   = useState("");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort]     = useState<"newest" | "popular" | "rating">("newest");
  const [page, setPage]     = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOpen, setSortOpen]     = useState(false);
  const [activeRef, setActiveRef]   = useState<HTMLDivElement | null>(null);

  // ── Derive filter options from the workshops passed in ───────────────────────
  const ageGroups = useMemo(
    () => [...new Set(workshops.map((w) => w.ageGroup))].sort(),
    [workshops]
  );
  const skills = useMemo(
    () => [...new Set(workshops.map((w) => w.skill))].sort(),
    [workshops]
  );

  // ── Click-outside for sort dropdown ─────────────────────────────────────────
  useMemo(() => {
    if (typeof window === "undefined") return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (activeRef && !activeRef.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeRef]);

  // ── Client-side filter + sort (same logic that was in getWorkshops) ──────────
  const filtered = useMemo(() => {
    let result = [...workshops];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.shortDescription.toLowerCase().includes(q) ||
          w.skill.toLowerCase().includes(q)
      );
    }
    if (filters.level.length)    result = result.filter((w) => filters.level.includes(w.level));
    if (filters.ageGroup.length) result = result.filter((w) => filters.ageGroup.includes(w.ageGroup));
    if (filters.skill.length)    result = result.filter((w) => filters.skill.includes(w.skill));

    if (sort === "rating")  result.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") result.sort((a, b) => b.enrolledCount - a.enrolledCount);
    // "newest" = insertion order (as received from server, already sorted by createdAt desc)

    return result;
  }, [workshops, query, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (next: FilterState) => {
    setFilters(next);
    setPage(1);
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const activeFiltersCount =
    filters.level.length + filters.ageGroup.length + filters.skill.length;

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Search + Sort bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            color="#9CA3AF"
          />
          <input
            type="search"
            placeholder="Search workshops…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 rounded-full text-sm font-medium bg-white outline-none transition-shadow"
            style={{
              border: "1.5px solid #E5E7EB",
              color: "#1A1A1A",
              fontFamily: "var(--font-nunito)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C518")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Custom Sort Dropdown */}
        <div className="relative" ref={(el) => { if (el !== activeRef) setActiveRef(el); }}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center justify-between pl-5 pr-4 py-3 rounded-full text-sm font-bold bg-white outline-none cursor-pointer transition-all hover:bg-[#F9FAFB] active:scale-95"
            style={{
              border: "1.5px solid #E5E7EB",
              color: "#1A1A1A",
              fontFamily: "var(--font-nunito)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              minWidth: 170,
            }}
          >
            <span className="flex items-center gap-2">
              <span className="text-[#6B7280] font-medium">Sort:</span>
              <span>{currentSortLabel}</span>
            </span>
            <motion.div
              animate={{ rotate: sortOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} color="#6B7280" />
            </motion.div>
          </button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.2 }}
                className="absolute right-0 mt-2 py-1.5 w-48 rounded-2xl bg-white border border-[#E5E7EB] shadow-lg z-30 overflow-hidden"
              >
                {SORT_OPTIONS.map((o) => {
                  const isSelected = o.value === sort;
                  return (
                    <button
                      key={o.value}
                      onClick={() => {
                        setSort(o.value);
                        setPage(1);
                        setSortOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-bold flex items-center justify-between transition-colors"
                      style={{
                        fontFamily: "var(--font-nunito)",
                        color: isSelected ? "#1A1A1A" : "#4B5563",
                        background: isSelected ? "#FEF9C3" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span>{o.label}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile filter button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all"
          style={{
            background: activeFiltersCount > 0 ? "#F5C518" : "white",
            color: "#1A1A1A",
            border: "1.5px solid " + (activeFiltersCount > 0 ? "#F5C518" : "#E5E7EB"),
            fontFamily: "var(--font-nunito)",
          }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-white rounded-full px-1.5 text-xs font-extrabold" style={{ color: "#1A1A1A" }}>
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────── */}
      <div className="flex gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClear}
              ageGroups={ageGroups}
              skills={skills}
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <p className="text-sm font-semibold mb-5" style={{ color: "#6B7280", fontFamily: "var(--font-nunito)" }}>
            {filtered.length === 0
              ? "No workshops found"
              : `${filtered.length} workshop${filtered.length !== 1 ? "s" : ""} found`}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold text-lg" style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}>
                No workshops match your filters
              </p>
              <button
                onClick={handleClear}
                className="mt-4 px-5 py-2 rounded-full text-sm font-bold underline"
                style={{ color: "#2BBCB0", fontFamily: "var(--font-nunito)" }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <motion.div
                key={`${sort}-${page}-${query}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {paginated.map((w) => (
                  <WorkshopCard key={w._id} workshop={w} />
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 rounded-full text-sm font-bold transition-all"
                      style={{
                        background: p === page ? "#F5C518" : "white",
                        color: "#1A1A1A",
                        border: "1.5px solid " + (p === page ? "#F5C518" : "#E5E7EB"),
                        fontFamily: "var(--font-nunito)",
                        boxShadow: p === page ? "0 4px 12px rgba(245,197,24,0.3)" : "none",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={(f) => { handleFilterChange(f); setDrawerOpen(false); }}
        onClear={() => { handleClear(); setDrawerOpen(false); }}
        ageGroups={ageGroups}
        skills={skills}
      />
    </div>
  );
}
