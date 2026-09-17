import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
  Download,
  Copy,
  Check,
  FileText,
  Lightbulb,
  Maximize2,
  Minimize2,
  Bookmark,
  Share2,
  ListOrdered,
  EyeOff,
  Code2,
  Award,
} from "lucide-react";
import MarkdownRenderer from "../common/markdown-view";
import { LineByLineNote, GlossaryItem, FlashcardItem } from "@/types/library";
import PdfDownloadOptions from "./pdf-download-options";
import { toast } from "sonner";

interface ReadWithoutWatchingProps {
  title: string;
  author?: string;
  summary: string;
  lineByLineNotes: LineByLineNote[];
  glossary: GlossaryItem[];
  flashcards: FlashcardItem[];
  videoDurationMinutes?: number;
  onSwitchToWatchMode?: () => void;
}

type ReaderSubTab = "complete_textbook" | "spoken_transcript" | "cram_sheet";

export default function ReadWithoutWatching({
  title,
  author,
  summary,
  lineByLineNotes,
  glossary,
  flashcards,
  videoDurationMinutes = 45,
  onSwitchToWatchMode,
}: ReadWithoutWatchingProps) {
  const [activeTab, setActiveTab] = useState<ReaderSubTab>("complete_textbook");
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  // Speech synthesis (Listen without watching)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Word count & time calculation
  const wordCount = summary.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 180));
  const timeSavedMinutes = Math.max(15, videoDurationMinutes - readTimeMinutes);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Track reading scroll progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - clientHeight > 0) {
      const prog = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setReadingProgress(prog);
    }
  };

  const handleToggleAudio = () => {
    if (!speechSupported) {
      toast.error("Audio read-aloud is not supported on this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      toast.info("Audio read-aloud paused");
    } else {
      window.speechSynthesis.cancel();

      // Clean markdown tags for natural speech
      const cleanText = summary
        .replace(/[#*!`[\]()_]/g, " ")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(
        `Lecture: ${title}. ${cleanText}`
      );
      utterance.rate = audioSpeed;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlayingAudio(false);
        toast.success("Finished reading notes aloud");
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      toast.success("Reading notes aloud... Listen without watching!");
    }
  };

  const handleChangeSpeed = (speed: number) => {
    setAudioSpeed(speed);
    if (isPlayingAudio) {
      // restart with new speed
      handleToggleAudio();
      setTimeout(() => handleToggleAudio(), 100);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success("Complete notes copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy notes");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner: Read Without Watching Mode */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-emerald-950/40 to-gray-950 border border-cyan-500/40 p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute right-0 top-0 w-96 h-full bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <EyeOff className="w-3.5 h-3.5" />
                Study Without Watching Video
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Zap className="w-3.5 h-3.5" />
                Saves ~{timeSavedMinutes} mins of video time
              </span>
              <span className="text-xs text-gray-400">
                {readTimeMinutes} min read • {wordCount} words
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              Complete Self-Sufficient Study Notes
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Every concept, spoken derivation, formula, and exam pitfall from this lecture is completely documented below. You do <span className="text-white font-semibold underline decoration-cyan-400">not</span> need to watch the video to master 100% of this material.
            </p>
          </div>

          {/* Controls & Switch back */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Listen / Audio TTS */}
            {speechSupported && (
              <div className="flex items-center gap-1 bg-black/50 border border-gray-700 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-black" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen to Notes</span>
                    </>
                  )}
                </button>

                {/* Speed selector */}
                <div className="flex items-center gap-0.5 px-1 text-[11px] font-bold text-gray-400">
                  {[1, 1.25, 1.5].map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => handleChangeSpeed(sp)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        audioSpeed === sp
                          ? "bg-cyan-500/30 text-cyan-300"
                          : "hover:text-white"
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Back to watch split video button */}
            {onSwitchToWatchMode && (
              <button
                type="button"
                onClick={onSwitchToWatchMode}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Show Video Player</span>
              </button>
            )}
          </div>
        </div>

        {/* Reading Progress Indicator */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-300">Reading Progress:</span>
            <div className="w-32 sm:w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-200"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-cyan-300 font-semibold">
              {readingProgress}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Font Size Adjust */}
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <span>Text Size:</span>
              <button
                type="button"
                onClick={() => setFontSize("sm")}
                className={`px-1.5 py-0.5 rounded ${
                  fontSize === "sm" ? "bg-white/20 text-white" : "hover:text-white"
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("base")}
                className={`px-1.5 py-0.5 rounded ${
                  fontSize === "base" ? "bg-white/20 text-white" : "hover:text-white"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("lg")}
                className={`px-1.5 py-0.5 rounded ${
                  fontSize === "lg" ? "bg-white/20 text-white" : "hover:text-white"
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Sub-Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-gray-900/80 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("complete_textbook")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "complete_textbook"
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Complete Textbook Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("spoken_transcript")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "spoken_transcript"
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Spoken Lecture Breakdown ({lineByLineNotes.length} Parts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cram_sheet")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "cram_sheet"
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>5-Minute Exam Cram Sheet</span>
          </button>
        </div>

        {/* Global actions: Copy & PDF */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>{copied ? "Copied!" : "Copy Full Notes"}</span>
          </button>

          <PdfDownloadOptions
            summary={summary}
            videoTitle={title}
            lineByLineNotes={lineByLineNotes}
            glossary={glossary}
          />
        </div>
      </div>

      {/* Main Content Stage */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/90 to-gray-950/90 p-5 sm:p-8 backdrop-blur-xl max-h-[85vh] overflow-y-auto ${
          fontSize === "sm"
            ? "text-xs"
            : fontSize === "lg"
            ? "text-base sm:text-lg"
            : "text-sm sm:text-base"
        }`}
      >
        <AnimatePresence mode="wait">
          {/* TAB 1: Complete Textbook Notes */}
          {activeTab === "complete_textbook" && (
            <motion.div
              key="complete_textbook"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300 block mb-0.5">
                    Autonomous Reading Guarantee
                  </span>
                  <p className="text-emerald-100/90 leading-relaxed">
                    This standalone textbook version includes background context, core mechanisms, step-by-step principles, and exam warnings. You do not need to refer back to any video frames.
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer markdown={summary} />
              </div>
            </motion.div>
          )}

          {/* TAB 2: Spoken Lecture Breakdown (What instructor said line-by-line) */}
          {activeTab === "spoken_transcript" && (
            <motion.div
              key="spoken_transcript"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Chronological spoken walkthrough of every subtopic with exact speaker takeaways, mathematical rules, and derivations.
                </span>
              </div>

              <div className="space-y-4">
                {lineByLineNotes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-gray-950/80 border border-gray-800 space-y-3 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/40">
                          {item.timestamp}
                        </span>
                        <h3 className="font-bold text-white text-sm sm:text-base">
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Part {idx + 1} of {lineByLineNotes.length}
                      </span>
                    </div>

                    {/* Verbatim quote from speaker */}
                    {item.speakerVerbatim && (
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                          Instructor Spoken Focus:
                        </span>
                        <p className="italic text-emerald-100/90 leading-relaxed">
                          "{item.speakerVerbatim}"
                        </p>
                      </div>
                    )}

                    {/* Detailed explanation */}
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                      {item.detailedExplanation}
                    </p>

                    {/* Formula / Rule */}
                    {item.keyFormulaOrRule && (
                      <div className="p-3 rounded-lg bg-black/60 border border-cyan-500/30 text-xs">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                          Core Formula / Axiom Rule:
                        </span>
                        <pre className="font-mono text-cyan-200 whitespace-pre-wrap">
                          {item.keyFormulaOrRule}
                        </pre>
                      </div>
                    )}

                    {/* Exam Takeaway */}
                    {item.examTakeaway && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                            High-Yield Exam Takeaway:
                          </span>
                          <p className="text-amber-100/90 leading-relaxed">
                            {item.examTakeaway}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: 5-Minute Exam Cram Sheet */}
          {activeTab === "cram_sheet" && (
            <motion.div
              key="cram_sheet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-300 block">
                    Last-Minute Exam Review & High-Yield Concept Cheat Sheet
                  </span>
                  <p className="text-amber-100/90 leading-relaxed">
                    Designed to review in 5 minutes right before tests. Skims all core definitions, formulas, and common exam traps without any filler.
                  </p>
                </div>
              </div>

              {/* High-Yield Formulas */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Key Formulas & Theoretical Equations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lineByLineNotes
                    .filter((n) => Boolean(n.keyFormulaOrRule))
                    .map((item, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/30 space-y-1.5"
                      >
                        <span className="text-[11px] font-semibold text-gray-300 block">
                          {item.title}
                        </span>
                        <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap">
                          {item.keyFormulaOrRule}
                        </pre>
                      </div>
                    ))}
                </div>
              </div>

              {/* Essential Terms Glossary */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Crucial Definitions & Concepts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {glossary.map((item, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 space-y-1"
                    >
                      <span className="text-xs font-bold text-white block">
                        {item.term}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Yield Exam Traps & Alerts */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Top Exam Traps & Common Mistakes
                </h3>
                <div className="space-y-2.5">
                  {lineByLineNotes
                    .filter((n) => Boolean(n.examTakeaway))
                    .map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100 flex items-start gap-2.5"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-300 block mb-0.5">
                            {item.title}
                          </span>
                          <p className="text-amber-100/90 leading-relaxed">
                            {item.examTakeaway}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
