import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  Search,
  BookOpen,
  Sparkles,
  Lightbulb,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Volume2,
  Bookmark,
  Share2,
} from "lucide-react";
import { LineByLineNote } from "@/types/library";
import { toast } from "sonner";

interface LineByLineViewProps {
  notes: LineByLineNote[];
  activeSeconds?: number;
  onSeekToTimestamp?: (seconds: number, timestamp: string) => void;
  videoTitle?: string;
}

export default function LineByLineView({
  notes,
  activeSeconds = 0,
  onSeekToTimestamp,
  videoTitle,
}: LineByLineViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Find currently active note based on activeSeconds
  const activeIndex = notes.reduce((currIdx, item, idx) => {
    if (activeSeconds >= item.seconds) {
      return idx;
    }
    return currIdx;
  }, 0);

  const filteredNotes = notes.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.detailedExplanation.toLowerCase().includes(query) ||
      item.timestamp.toLowerCase().includes(query) ||
      (item.keyFormulaOrRule && item.keyFormulaOrRule.toLowerCase().includes(query)) ||
      (item.examTakeaway && item.examTakeaway.toLowerCase().includes(query))
    );
  });

  const toggleExpand = (idx: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [idx]: prev[idx] !== undefined ? !prev[idx] : false, // Default is expanded if undefined
    }));
  };

  const isExpanded = (idx: number) => {
    return expandedIndices[idx] !== false; // Default true
  };

  const handleCopySingleNote = async (item: LineByLineNote, idx: number) => {
    const text = `[${item.timestamp}] ${item.title}\n\n${item.detailedExplanation}\n${item.speakerVerbatim ? `\nLecturer: "${item.speakerVerbatim}"` : ""}${item.keyFormulaOrRule ? `\nFormula/Rule: ${item.keyFormulaOrRule}` : ""}${item.examTakeaway ? `\nExam Alert: ${item.examTakeaway}` : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      toast.success(`Copied segment [${item.timestamp}]!`);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Failed to copy segment");
    }
  };

  const handleCopyAllNotes = async () => {
    const text = notes
      .map(
        (item) =>
          `[${item.timestamp}] ${item.title}\n${item.detailedExplanation}\n${item.keyFormulaOrRule ? `Formula: ${item.keyFormulaOrRule}\n` : ""}${item.examTakeaway ? `Exam Tip: ${item.examTakeaway}\n` : ""}`
      )
      .join("\n----------------------------------------\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      toast.success("All line-by-line notes copied!");
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast.error("Failed to copy notes");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-900/60 border border-gray-800/80 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timestamps, concepts, formulas..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-black/40 border border-gray-700/60 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/70 transition-all"
          />
        </div>

        {/* Counter & Action */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-medium text-gray-400 px-2 py-1 rounded bg-white/5 border border-white/5">
            {filteredNotes.length} of {notes.length} Segments
          </span>

          <button
            type="button"
            onClick={handleCopyAllNotes}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedAll ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>{copiedAll ? "Copied" : "Copy All Lines"}</span>
          </button>
        </div>
      </div>

      {/* Line-by-Line Timeline List */}
      <div className="relative space-y-4 before:absolute before:left-[19px] sm:before:left-[23px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/50 before:via-emerald-500/30 before:to-transparent">
        {filteredNotes.map((item, idx) => {
          const isCurrentActive = idx === activeIndex;
          const expanded = isExpanded(idx);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`relative pl-10 sm:pl-12 group transition-all`}
            >
              {/* Timeline Indicator Dot */}
              <button
                type="button"
                onClick={() => onSeekToTimestamp?.(item.seconds, item.timestamp)}
                title={`Jump to ${item.timestamp}`}
                className={`absolute left-2.5 sm:left-3.5 top-4 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer z-10 ${
                  isCurrentActive
                    ? "bg-cyan-500 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-110"
                    : "bg-gray-900 border-gray-700 hover:border-cyan-400 hover:bg-cyan-500/20"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCurrentActive ? "bg-black animate-pulse" : "bg-cyan-400"
                  }`}
                />
              </button>

              {/* Segment Card */}
              <div
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isCurrentActive
                    ? "bg-gradient-to-br from-cyan-950/40 via-gray-900/90 to-gray-950/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/20"
                    : "bg-gradient-to-br from-gray-900/80 to-gray-950/80 border-gray-800/90 hover:border-gray-700/90"
                }`}
              >
                {/* Header with Timestamp Seek button */}
                <div className="p-3.5 sm:p-4 flex items-start justify-between gap-3 border-b border-white/5">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* Timestamp Button */}
                    <button
                      type="button"
                      onClick={() => onSeekToTimestamp?.(item.seconds, item.timestamp)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isCurrentActive
                          ? "bg-cyan-500 text-black border-cyan-400 shadow-sm"
                          : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25 hover:border-cyan-400"
                      }`}
                    >
                      <Play className={`w-3 h-3 ${isCurrentActive ? "fill-black" : "fill-cyan-300"}`} />
                      <span>{item.timestamp}</span>
                    </button>

                    {isCurrentActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 animate-pulse">
                        Current Video Position
                      </span>
                    )}

                    <h4 className="font-semibold text-white text-sm sm:text-base leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopySingleNote(item, idx)}
                      title="Copy this note"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(idx)}
                      title={expanded ? "Collapse section" : "Expand section"}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {expanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 sm:p-4 space-y-3 text-xs sm:text-sm text-gray-300 overflow-hidden"
                    >
                      {/* Speaker Verbatim Quote (if available) */}
                      {item.speakerVerbatim && (
                        <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                          <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                              Lecturer Spoken Core Point
                            </span>
                            <p className="italic text-xs text-emerald-100/90 leading-relaxed">
                              {item.speakerVerbatim}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Detailed Line-by-line pedagogical text */}
                      <p className="leading-relaxed text-gray-200 font-normal">
                        {item.detailedExplanation}
                      </p>

                      {/* Key Formula / Theorem / Rule Block */}
                      {item.keyFormulaOrRule && (
                        <div className="p-2.5 sm:p-3 rounded-lg bg-black/50 border border-cyan-500/30 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5" />
                              Key Formula / Axiom Rule
                            </span>
                          </div>
                          <pre className="font-mono text-xs sm:text-sm text-cyan-200 overflow-x-auto whitespace-pre-wrap py-1">
                            {item.keyFormulaOrRule}
                          </pre>
                        </div>
                      )}

                      {/* High-Yield Exam Takeaway / Concept Warning */}
                      {item.examTakeaway && (
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs shadow-sm">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                                High-Yield Exam Tip & Pitfall Alert
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                                Concept Note
                              </span>
                            </div>
                            <p className="text-amber-100/95 leading-relaxed font-normal">
                              {item.examTakeaway}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Footer Quick Seek Button */}
                      <div className="pt-2 flex items-center justify-between border-t border-white/5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          Starts at timestamp {item.timestamp}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSeekToTimestamp?.(item.seconds, item.timestamp)}
                          className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Play className="w-3 h-3 fill-cyan-400" />
                          Jump Video Here
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="p-8 text-center rounded-xl bg-gray-900/40 border border-gray-800 text-gray-400 space-y-2">
          <Search className="w-6 h-6 mx-auto text-gray-500" />
          <p className="text-sm font-medium">No timestamped lines matched "{searchQuery}"</p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-cyan-400 hover:underline cursor-pointer"
          >
            Clear search filter
          </button>
        </div>
      )}
    </div>
  );
}
