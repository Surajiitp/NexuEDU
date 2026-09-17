import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Download,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Clock,
  BookOpen,
  BookMarked,
  Sparkles,
  EyeOff,
} from "lucide-react";
import MarkdownRenderer from "../common/markdown-view";
import PdfDownloadOptions from "./pdf-download-options";
import { toast } from "sonner";
import LineByLineView from "./line-by-line-view";
import FlashcardView from "./flashcard-view";
import GlossaryView from "./glossary-view";
import { LineByLineNote, GlossaryItem, FlashcardItem } from "@/types/library";
import {
  getOrGenerateLineByLineNotes,
  getOrGenerateFlashcards,
  getOrGenerateGlossary,
} from "@/lib/line-by-line-helper";

interface SummaryBoxProps {
  summary: string;
  lineByLineNotes?: LineByLineNote[];
  glossary?: GlossaryItem[];
  flashcards?: FlashcardItem[];
  onSeekToTimestamp?: (seconds: number, timestamp: string) => void;
  onSwitchToReadWithoutWatching?: () => void;
  activeSeconds?: number;
  videoTitle?: string;
}

type TabType = "line_by_line" | "complete_notes" | "flashcards" | "glossary";

export default function SummaryBox({
  summary,
  lineByLineNotes,
  glossary,
  flashcards,
  onSeekToTimestamp,
  onSwitchToReadWithoutWatching,
  activeSeconds = 0,
  videoTitle = "Lecture Study Notes",
}: SummaryBoxProps) {
  const [activeTab, setActiveTab] = useState<TabType>("line_by_line");
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback generator ensures line-by-line, flashcards and glossary are NEVER empty
  const resolvedLineByLine =
    lineByLineNotes && lineByLineNotes.length > 0
      ? lineByLineNotes
      : getOrGenerateLineByLineNotes({ summary, title: videoTitle });

  const resolvedFlashcards =
    flashcards && flashcards.length > 0
      ? flashcards
      : getOrGenerateFlashcards({ summary, title: videoTitle });

  const resolvedGlossary =
    glossary && glossary.length > 0
      ? glossary
      : getOrGenerateGlossary({ summary, title: videoTitle });

  const handleCopyCurrent = async () => {
    try {
      let textToCopy = summary;
      if (activeTab === "line_by_line") {
        textToCopy = resolvedLineByLine
          .map(
            (item) =>
              `[${item.timestamp}] ${item.title}\n${item.detailedExplanation}\n${item.speakerVerbatim ? `Lecturer: "${item.speakerVerbatim}"\n` : ""}${item.keyFormulaOrRule ? `Formula: ${item.keyFormulaOrRule}\n` : ""}${item.examTakeaway ? `Exam Tip: ${item.examTakeaway}\n` : ""}`
          )
          .join("\n---\n\n");
      } else if (activeTab === "flashcards") {
        textToCopy = resolvedFlashcards
          .map((card, i) => `Q${i + 1}: ${card.question}\nA: ${card.answer}`)
          .join("\n\n");
      } else if (activeTab === "glossary") {
        textToCopy = resolvedGlossary
          .map((g) => `${g.term}: ${g.definition}`)
          .join("\n\n");
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy notes");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${
        isExpanded ? "fixed inset-0 z-50 m-2 sm:m-4" : "md:col-span-2"
      } bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-gray-800 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col`}
    >
      {/* Top Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              NexusEDU Smart Notes
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Video Synchronized
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time line-by-line walkthrough, active recall flashcards & textbook notes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Read Without Watching Quick Action */}
          {onSwitchToReadWithoutWatching && (
            <button
              type="button"
              onClick={onSwitchToReadWithoutWatching}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Read complete notes without watching video"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Study Without Video</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyCurrent}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>{copied ? "Copied!" : "Copy Active Tab"}</span>
          </button>

          {/* PDF Download with Options */}
          <PdfDownloadOptions
            summary={summary}
            videoTitle={videoTitle}
            lineByLineNotes={resolvedLineByLine}
            glossary={resolvedGlossary}
          />

          {/* Expand / Minimize Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer border border-gray-700"
            title={isExpanded ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-gray-800 mb-4 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("line_by_line")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "line_by_line"
              ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Line-by-Line Video Notes</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "line_by_line" ? "bg-black/20 text-black" : "bg-white/10 text-gray-400"
            }`}
          >
            {resolvedLineByLine.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("complete_notes")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "complete_notes"
              ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete Textbook Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("flashcards")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "flashcards"
              ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Flashcards</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "flashcards" ? "bg-black/20 text-black" : "bg-white/10 text-gray-400"
            }`}
          >
            {resolvedFlashcards.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("glossary")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "glossary"
              ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
              : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Glossary & Formulas</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "glossary" ? "bg-black/20 text-black" : "bg-white/10 text-gray-400"
            }`}
          >
            {resolvedGlossary.length}
          </span>
        </button>
      </div>

      {/* Tab Panels Area */}
      <div
        className={`flex-1 rounded-xl border border-gray-800/80 bg-black/30 p-4 sm:p-5 overflow-y-auto ${
          isExpanded ? "h-[calc(100vh-14rem)]" : "min-h-[480px] max-h-[720px]"
        }`}
      >
        <AnimatePresence mode="wait">
          {activeTab === "line_by_line" && (
            <motion.div
              key="line_by_line"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <LineByLineView
                notes={resolvedLineByLine}
                activeSeconds={activeSeconds}
                onSeekToTimestamp={onSeekToTimestamp}
                videoTitle={videoTitle}
              />
            </motion.div>
          )}

          {activeTab === "complete_notes" && (
            <motion.div
              key="complete_notes"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Comprehensive markdown textbook summary formatted with formulas, key takeaways, and structured subtopics.
                </span>
              </div>
              <MarkdownRenderer markdown={summary} />
            </motion.div>
          )}

          {activeTab === "flashcards" && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <FlashcardView
                cards={resolvedFlashcards}
                onSeekToTimestamp={onSeekToTimestamp}
              />
            </motion.div>
          )}

          {activeTab === "glossary" && (
            <motion.div
              key="glossary"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <GlossaryView
                items={resolvedGlossary}
                onSeekToTimestamp={onSeekToTimestamp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
