"use client";

import { useState } from "react";

export function useParentQuestionnaire(totalQuestions: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(0)
  );
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [showValidationError, setShowValidationError] = useState(false);

  function selectRating(rating: number) {
    setSelectedRating(rating);
    setShowValidationError(false);
  }

  function next(onComplete: (answers: number[]) => void) {
    if (!selectedRating) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 300);
      return;
    }

    const updated = [...answers];
    updated[currentIndex] = selectedRating;
    setAnswers(updated);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedRating(updated[currentIndex + 1] || 0);
    } else {
      onComplete(updated);
    }
  }

  const progress = Math.round((currentIndex / totalQuestions) * 50) + 50;

  return {
    currentIndex,
    selectedRating,
    showValidationError,
    selectRating,
    next,
    progress,
    isLast: currentIndex === totalQuestions - 1,
  };
}
