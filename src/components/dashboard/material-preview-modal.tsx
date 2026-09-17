import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Play,
  Download,
  Calendar,
  Clock,
  Youtube,
  ExternalLink,
  BookOpen,
  Brain,
  BookMarked,
  Sparkles,
} from "lucide-react";
import { StudyMaterial } from "@/types/library";
import MarkdownRenderer from "@/components/common/markdown-view";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PdfDownloadOptions from "./pdf-download-options";
import LineByLineView from "./line-by-line-view";
import FlashcardView from "./flashcard-view";
import GlossaryView from "./glossary-view";
import {
  getOrGenerateLineByLineNotes,
  getOrGenerateFlashcards,
  getOrGenerateGlossary,
} from "@/lib/line-by-line-helper";

interface MaterialPreviewModalProps {
  material: StudyMaterial | null;
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = "line_by_line" | "complete_notes" | "flashcards" | "glossary";

export default function MaterialPreviewModal({
  material,
  isOpen,
  onClose,
}: MaterialPreviewModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [activeTab, setActiveTab] = useState<ModalTab>("line_by_line");
  const [seekSeconds, setSeekSeconds] = useState<number>(0);
  const [seekTimestamp, setSeekTimestamp] = useState<string>("");

  if (!isOpen || !material) return null;

  const resolvedLineByLine = getOrGenerateLineByLineNotes(material);
  const resolvedFlashcards = getOrGenerateFlashcards(material);
  const resolvedGlossary = getOrGenerateGlossary(material);

  const handleCopyNotes = async () => {
    try {
      await navigator.clipboard.writeText(material.summary);
      setCopied(true);
      toast.success("Notes copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy notes to clipboard.");
    }
  };

  const handleSeek = (sec: number, ts: string) => {
    setSeekSeconds(sec);
    setSeekTimestamp(ts);
    setShowVideo(true);
    toast.success(`Video jumped to [${ts}]`);
  };

  const handleOpenFullStudy = () => {
    const params = new URLSearchParams({
      summary: material.summary,
      videoId: material.videoId || "",
      videoUrl: material.videoUrl || "",
      title: material.title,
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-800 flex items-start justify-between gap-4 bg-gray-900/60 backdrop-blur-xl shrink-0">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium">
                  {material.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {material.readTimeMinutes} min read
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {material.date}
                </span>
                {seekTimestamp && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <Play className="w-2.5 h-2.5 fill-cyan-300" />
                    At {seekTimestamp}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                {material.title}
              </h2>
              <p className="text-xs text-gray-400">Instructor: {material.author}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Embedded YouTube Player */}
            {material.videoId && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 font-medium text-gray-300">
                    <Youtube className="w-4 h-4 text-red-400" />
                    Synchronized Lecture Video
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowVideo(!showVideo)}
                    className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    {showVideo ? "Hide Video" : "Show Video Player"}
                  </button>
                </div>

                {showVideo && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 shadow-xl">
                    <iframe
                      key={`${material.videoId}_seek_${seekSeconds}`}
                      src={getYouTubeEmbedUrl(material.videoId, seekSeconds > 0, seekSeconds)}
                      title={material.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}

            {/* Modal Tabs Navigation */}
            <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-gray-800 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("line_by_line")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "line_by_line"
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Line-by-Line Video Notes</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-bold">
                  {resolvedLineByLine.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("complete_notes")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "complete_notes"
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Textbook Summary</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("flashcards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "flashcards"
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <Brain className="w-3 h-3" />
                <span>Flashcards ({resolvedFlashcards.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("glossary")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "glossary"
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <BookMarked className="w-3 h-3" />
                <span>Glossary ({resolvedGlossary.length})</span>
              </button>
            </div>

            {/* Tab Views */}
            <div className="rounded-xl border border-gray-800/80 bg-black/20 p-4">
              {activeTab === "line_by_line" && (
                <LineByLineView
                  notes={resolvedLineByLine}
                  activeSeconds={seekSeconds}
                  onSeekToTimestamp={handleSeek}
                  videoTitle={material.title}
                />
              )}

              {activeTab === "complete_notes" && (
                <div className="space-y-4">
                  {material.keyTakeaways && material.keyTakeaways.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-1.5">
                      <h4 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Key Takeaways
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-gray-300 leading-relaxed">
                        {material.keyTakeaways.map((takeaway, idx) => (
                          <li key={idx}>{takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <MarkdownRenderer markdown={material.summary} />
                </div>
              )}

              {activeTab === "flashcards" && (
                <FlashcardView
                  cards={resolvedFlashcards}
                  onSeekToTimestamp={handleSeek}
                />
              )}

              {activeTab === "glossary" && (
                <GlossaryView
                  items={resolvedGlossary}
                  onSeekToTimestamp={handleSeek}
                />
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyNotes}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span>{copied ? "Copied!" : "Copy Notes"}</span>
              </button>

              <PdfDownloadOptions
                summary={material.summary}
                videoTitle={material.title}
                lineByLineNotes={resolvedLineByLine}
                glossary={resolvedGlossary}
              />
            </div>

            <button
              type="button"
              onClick={handleOpenFullStudy}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Open in Full Study Studio</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
