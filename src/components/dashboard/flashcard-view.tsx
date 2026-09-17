import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Play } from "lucide-react";
import { FlashcardItem } from "@/types/library";

interface FlashcardViewProps {
  cards: FlashcardItem[];
  onSeekToTimestamp?: (seconds: number, timestamp: string) => void;
}

export default function FlashcardView({ cards, onSeekToTimestamp }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Record<number, boolean>>({});

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-gray-900/50 border border-gray-800 text-gray-400">
        No flashcards generated for this lecture.
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleToggleKnown = () => {
    setKnownCards((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const knownCount = Object.values(knownCards).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header & Progress */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Active Recall Flashcards</span>
          <span className="text-gray-400">
            ({currentIndex + 1} of {cards.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-medium">
            Mastered: {knownCount} / {cards.length}
          </span>
        </div>
      </div>

      {/* Flip Card Stage */}
      <div className="relative min-h-[260px] w-full perspective-1000">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[260px] p-6 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
            isFlipped
              ? "bg-gradient-to-br from-emerald-950/40 via-gray-900 to-gray-950 border-emerald-500/40 shadow-xl shadow-emerald-500/5"
              : "bg-gradient-to-br from-cyan-950/30 via-gray-900 to-gray-950 border-cyan-500/30 shadow-xl hover:border-cyan-500/50"
          }`}
        >
          {/* Top Pill & Action */}
          <div className="flex items-center justify-between text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] border ${
                isFlipped
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
              }`}
            >
              {isFlipped ? "Answer / Solution" : "Question / Prompt"}
            </span>

            {currentCard.timestamp && (
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                Lecture Timestamp: {currentCard.timestamp}
              </span>
            )}
          </div>

          {/* Card Content Text */}
          <div className="py-6 text-center space-y-3">
            <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
          </div>

          {/* Footer instruction */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-3">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-cyan-400" />
              Click card to flip
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleKnown();
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                knownCards[currentIndex]
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{knownCards[currentIndex] ? "Marked as Mastered" : "Mark as Mastered"}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-1.5">
          {cards.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-cyan-400"
                  : knownCards[idx]
                  ? "bg-emerald-400"
                  : "bg-gray-700 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
