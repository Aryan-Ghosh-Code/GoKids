"use client";

import { FILTER_LEVELS } from "@/lib/data/workshop-constants";

export type FilterState = {
  level: string[];
  ageGroup: string[];
  skill: string[];
};

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
  /** Derived from the workshops fetched server-side */
  ageGroups: string[];
  /** Derived from the workshops fetched server-side */
  skills: string[];
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────
function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <span
        className="w-4 h-4 rounded flex items-center justify-center border transition-all"
        style={{
          borderColor: checked ? "#2BBCB0" : "#D1D5DB",
          background: checked ? "#2BBCB0" : "white",
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className="text-sm font-semibold transition-colors group-hover:text-[#2BBCB0]"
        style={{ color: checked ? "#2BBCB0" : "#374151", fontFamily: "var(--font-nunito)" }}
      >
        {label}
      </span>
    </label>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4
        className="text-xs font-extrabold uppercase tracking-widest mb-3"
        style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

// ─── FilterSidebar ────────────────────────────────────────────────────────────
export default function FilterSidebar({
  filters,
  onChange,
  onClear,
  ageGroups,
  skills,
}: FilterSidebarProps) {
  const toggle = (key: keyof FilterState, value: string, checked: boolean) => {
    const prev = filters[key];
    const next = checked ? [...prev, value] : prev.filter((v) => v !== value);
    onChange({ ...filters, [key]: next });
  };

  const totalActive = filters.level.length + filters.ageGroup.length + filters.skill.length;

  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ border: "1px solid #F3F4F6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-base font-extrabold"
          style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
        >
          Filters
          {totalActive > 0 && (
            <span
              className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "#F5C518", color: "#1A1A1A" }}
            >
              {totalActive}
            </span>
          )}
        </h3>
        {totalActive > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-semibold underline underline-offset-2 transition-colors hover:text-[#2BBCB0]"
            style={{ color: "#9CA3AF", fontFamily: "var(--font-nunito)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Level */}
      <FilterSection title="Level">
        {FILTER_LEVELS.map((l) => (
          <CheckRow
            key={l}
            label={l}
            checked={filters.level.includes(l)}
            onChange={(v) => toggle("level", l, v)}
          />
        ))}
      </FilterSection>

      {/* Age Group */}
      {ageGroups.length > 0 && (
        <FilterSection title="Age Group">
          {ageGroups.map((a) => (
            <CheckRow
              key={a}
              label={`Ages ${a}`}
              checked={filters.ageGroup.includes(a)}
              onChange={(v) => toggle("ageGroup", a, v)}
            />
          ))}
        </FilterSection>
      )}

      {/* Skill */}
      {skills.length > 0 && (
        <FilterSection title="Skill / Subject">
          {skills.map((s) => (
            <CheckRow
              key={s}
              label={s}
              checked={filters.skill.includes(s)}
              onChange={(v) => toggle("skill", s, v)}
            />
          ))}
        </FilterSection>
      )}

      {/* Apply button */}
      <button
        className="w-full py-3 rounded-full text-sm font-extrabold transition-all hover:opacity-90 active:scale-95"
        style={{
          background: "#F5C518",
          color: "#1A1A1A",
          fontFamily: "var(--font-nunito)",
          boxShadow: "0 4px 16px rgba(245,197,24,0.3)",
        }}
      >
        Apply Filters
      </button>
    </div>
  );
}
