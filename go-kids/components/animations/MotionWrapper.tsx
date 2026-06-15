"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// ─── Module-level constants ───────────────────────────────────────────────────
// Every inline object literal passed to Framer Motion (viewport, variants,
// transition, initial, animate) creates a new JS object on every render.
// Framer Motion compares these by reference — a new object reference causes it
// to re-register IntersectionObservers and recalculate animations unnecessarily.
// Hoisting to module scope gives stable references across all renders.

// Easing as a typed tuple — plain number[] is rejected by Framer Motion's types
const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const VIEWPORT_ONCE = { once: true, margin: "-60px" } as const;
const VIEWPORT_ONCE_TIGHT = { once: true } as const;

const FADE_INITIAL = { opacity: 0, y: 24 } as const;
const FADE_VISIBLE = { opacity: 1, y: 0 } as const;

// Zero-delay transition (the common case) — stable reference
const FADE_TRANSITION_NO_DELAY = { duration: 0.55, delay: 0, ease: EASE_CUBIC };

const BOUNCE_INITIAL = { scale: 0, opacity: 0 } as const;
const BOUNCE_VISIBLE = { scale: [0, 1.2, 1] as [number, number, number], opacity: 1 };

const BOUNCE_TRANSITION_BASE = { duration: 0.5, ease: "easeOut" as const };

const STAGGER_HIDDEN = {} as const;

// ease must be typed tuple inside variants too
const STAGGER_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_CUBIC },
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInUp({ children, delay = 0, className = "" }: FadeInUpProps) {
  // viewport/initial/whileInView are stable module-level refs — FM won't
  // re-register the IntersectionObserver on re-renders.
  // transition is only re-created when delay != 0 (rare case).
  const transition = delay
    ? { duration: 0.55, delay, ease: EASE_CUBIC }
    : FADE_TRANSITION_NO_DELAY;

  return (
    <motion.div
      initial={FADE_INITIAL}
      whileInView={FADE_VISIBLE}
      viewport={VIEWPORT_ONCE}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }: StaggerContainerProps) {
  // variants.visible.transition depends on staggerDelay prop.
  // In practice all callers use the default (0.1) so this is effectively stable.
  const variants = {
    hidden: STAGGER_HIDDEN,
    visible: { transition: { staggerChildren: staggerDelay } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={STAGGER_ITEM_VARIANTS}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BounceIn({ children, delay = 0, className = "" }: FadeInUpProps) {
  const transition = delay
    ? { ...BOUNCE_TRANSITION_BASE, delay }
    : BOUNCE_TRANSITION_BASE;

  return (
    <motion.div
      initial={BOUNCE_INITIAL}
      whileInView={BOUNCE_VISIBLE}
      viewport={VIEWPORT_ONCE_TIGHT}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
