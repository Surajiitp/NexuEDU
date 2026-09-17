import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtube";
import { toast } from "sonner";

interface VideoRunnerProps {
  videoId: string;
  videoTitle?: string;
  videoUrl?: string;
  onRunNewVideo?: (newUrl: string) => void;
  seekSeconds?: number;
  seekTimestamp?: string;
}

export default function VideoRunner({
  videoId,
  videoTitle,
  videoUrl,
  onRunNewVideo,
  seekSeconds = 0,
  seekTimestamp,
}: VideoRunnerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [isChangingVideo, setIsChangingVideo] = useState(false);

  const displayTitle = videoTitle || "Lecture Video";
  const externalLink =
    videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}${seekSeconds > 0 ? `&t=${seekSeconds}s` : ""}` : "");

  const handleNewVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUrlInput.trim();
    if (!trimmed) {
      toast.error("Please enter a YouTube video URL");
      return;
    }
    const newId = extractYouTubeId(trimmed);
    if (!newId) {
      toast.error("Invalid YouTube URL. Please check the link and retry.");
      return;
    }
    if (onRunNewVideo) {
      onRunNewVideo(trimmed);
      setNewUrlInput("");
      setIsChangingVideo(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-1">
                {displayTitle}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Line-by-Line Video Sync Active
              </span>
              {seekTimestamp && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Play className="w-2.5 h-2.5 fill-cyan-300" />
                  Jumped to {seekTimestamp}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Click any line-by-line note below to jump video directly to that lecture timestamp
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsChangingVideo(!isChangingVideo)}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch Video</span>
          </button>

          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Play Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Switch Video Bar */}
      <AnimatePresence>
        {isChangingVideo && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleNewVideoSubmit}
            className="flex flex-col sm:flex-row gap-2 pt-1 pb-2 overflow-hidden"
          >
            <input
              type="text"
              value={newUrlInput}
              onChange={(e) => setNewUrlInput(e.target.value)}
              placeholder="Paste new YouTube link to run and generate notes..."
              className="flex-1 px-3.5 py-2 bg-black/40 rounded-lg border border-gray-700 text-xs sm:text-sm text-gray-200 placeholder:text-gray-500 focus:border-cyan-400 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 rounded-lg text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Run New Video
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Embedded Video Player */}
      <AnimatePresence>
        {isExpanded && videoId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 shadow-2xl">
              <iframe
                key={`${videoId}_seek_${seekSeconds}`}
                src={getYouTubeEmbedUrl(videoId, seekSeconds > 0, seekSeconds)}
                title={displayTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
