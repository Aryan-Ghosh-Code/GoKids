"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, CalendarDays, Sparkles } from "lucide-react";

interface BookingCalendarWidgetProps {
  mentorName: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function generateSlots(date: Date): { time: string; available: boolean }[] {
  const seed = date.getDate();
  const slots = [];
  const hours = [9, 10, 11, 14, 15, 16, 17, 18, 19];
  for (const h of hours) {
    slots.push({ time: `${h.toString().padStart(2, "0")}:00 IST`, available: (h + seed) % 3 !== 0 });
    slots.push({ time: `${h.toString().padStart(2, "0")}:30 IST`, available: (h + seed) % 4 !== 0 });
  }
  return slots.slice(0, 9);
}

export default function BookingCalendarWidget({ mentorName }: BookingCalendarWidgetProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  const { daysInMonth, startOffset } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    return { daysInMonth: lastDay.getDate(), startOffset: firstDay.getDay() };
  }, [viewYear, viewMonth]);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 2);
    return d;
  }, [today]);

  const canGoPrev = useMemo(() => {
    return viewYear > today.getFullYear() || viewMonth > today.getMonth();
  }, [viewYear, viewMonth, today]);

  const canGoNext = useMemo(() => {
    const nextMonth = new Date(viewYear, viewMonth + 1, 1);
    return nextMonth <= maxDate;
  }, [viewYear, viewMonth, maxDate]);

  const prevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const nextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const isDaySelectable = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d >= today && d <= maxDate;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day;
  };

  const isToday = (day: number) => {
    return today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day;
  };

  const slots = useMemo(() => selectedDate ? generateSlots(selectedDate) : [], [selectedDate]);

  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  if (isBooked) {
    return (
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 border shadow-xl text-center flex flex-col items-center sticky top-24 lg:top-28 z-20"
        style={{ borderColor: "#E5E7EB" }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald-50 text-emerald-500">
          <CheckCircle2 size={32} />
        </div>
        <h3
          className="text-lg font-extrabold text-gray-900 mb-1"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Request Submitted!
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-5">
          Your request with{" "}
          <strong className="text-gray-800">{mentorName}</strong> for{" "}
          <strong className="text-gray-800">{formatSelectedDate()}</strong> at{" "}
          <strong className="text-gray-800">{selectedSlot}</strong> has been
          received.
        </p>
        <div className="w-full p-3 rounded-2xl mb-5 bg-amber-50/80 border border-dashed border-amber-300">
          <p className="text-[11px] font-bold text-amber-800 leading-normal">
            🎉 Booking feature coming soon! We&apos;ll notify you once
            confirmed.
          </p>
        </div>
        <button
          onClick={() => {
            setIsBooked(false);
            setSelectedDate(null);
            setSelectedSlot(null);
          }}
          className="w-full py-2.5 rounded-full text-xs font-bold border transition-all hover:bg-gray-50"
          style={{
            borderColor: "#E5E7EB",
            color: "#4B5563",
            fontFamily: "var(--font-nunito)",
          }}
        >
          Modify Selection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border shadow-xl overflow-hidden sticky top-24 lg:top-28 z-20" style={{ borderColor: "#E5E7EB" }}>
      {/* Widget Header */}
      <div
        className="p-4 sm:p-5 border-b"
        style={{ borderColor: "#F3F4F6", background: "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: "#FFF3CC" }}>
            <CalendarDays size={15} className="text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Book a Session</p>
            <h3 className="text-xs sm:text-sm font-extrabold text-gray-900" style={{ fontFamily: "var(--font-nunito)" }}>
              Select Date &amp; Time
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700">
          <Sparkles size={11} className="shrink-0" />
          <p className="text-[10px] font-bold">Free during launch — no payment needed</p>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-extrabold text-gray-900" style={{ fontFamily: "var(--font-nunito)" }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              aria-label="Previous Month"
              className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50"
              style={{ borderColor: "#E5E7EB" }}
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={nextMonth}
              disabled={!canGoNext}
              aria-label="Next Month"
              className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50"
              style={{ borderColor: "#E5E7EB" }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {DAYS.map((d) => (
            <span key={d} className="text-[10px] font-bold text-gray-400 py-1" style={{ fontFamily: "var(--font-nunito)" }}>
              {d}
            </span>
          ))}

          {/* Blank offset cells */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {/* Day buttons */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const selectable = isDaySelectable(d);
            const selected = isSelected(d);
            const todayDay = isToday(d);

            return (
              <button
                key={d}
                onClick={() => {
                  if (!selectable) return;
                  const nd = new Date(viewYear, viewMonth, d);
                  setSelectedDate(nd);
                  setSelectedSlot(null);
                }}
                disabled={!selectable}
                className="h-8 w-full flex items-center justify-center rounded-lg text-[11px] font-bold transition-all"
                style={{
                  background: selected ? "#F5C518" : todayDay && !selected ? "#FFF9E6" : "transparent",
                  color: selected ? "#1A1A1A" : selectable ? "#1A1A1A" : "#D1D5DB",
                  border: selected ? "1.5px solid #D4A900" : todayDay && !selected ? "1px solid #F5C518" : "1px solid transparent",
                  cursor: selectable ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Time slot selection */}
        {selectedDate && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Clock size={11} className="text-amber-500" />
              <p className="text-[10px] font-extrabold text-gray-900" style={{ fontFamily: "var(--font-nunito)" }}>
                Available slots for {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
            </div>
            {/* Flex single line scrollable / multi line wrap for phone view compatibility */}
            <div className="flex flex-wrap gap-1 md:grid md:grid-cols-3 md:gap-2">
              {slots.map((slot) => {
                const sel = selectedSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedSlot(slot.time)}
                    disabled={!slot.available}
                    className="py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center border whitespace-nowrap"
                    style={{
                      background: sel ? "#F5C518" : slot.available ? "#FAFAF8" : "#F9FAFB",
                      color: sel ? "#1A1A1A" : slot.available ? "#374151" : "#D1D5DB",
                      border: sel ? "1.5px solid #D4A900" : slot.available ? "1.5px solid #E5E7EB" : "1.5px solid #F3F4F6",
                      cursor: slot.available ? "pointer" : "not-allowed",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={() => selectedDate && selectedSlot && setIsBooked(true)}
            disabled={!selectedDate || !selectedSlot}
            className="w-full py-2.5 rounded-full text-xs font-bold transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: selectedDate && selectedSlot ? "#F5C518" : "#E5E7EB",
              color: selectedDate && selectedSlot ? "#1A1A1A" : "#9CA3AF",
              fontFamily: "var(--font-nunito)",
              boxShadow: selectedDate && selectedSlot ? "0 4px 12px rgba(245,197,24,0.3)" : "none",
            }}
          >
            {!selectedDate ? "Select a date to continue" : !selectedSlot ? "Choose a time slot" : "Request Session →"}
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400">
          Free 1-on-1 session · No credit card required
        </p>
      </div>
    </div>
  );
}
