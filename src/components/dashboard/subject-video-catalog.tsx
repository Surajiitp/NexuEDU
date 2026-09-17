import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube,
  Play,
  Copy,
  ExternalLink,
  BookOpen,
  Sparkles,
  Check,
  GraduationCap,
  Layers,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SUBJECT_VIDEO_LINKS, SubjectVideoLink, getSubjectVideos } from "@/lib/subject-videos";

interface SubjectVideoCatalogProps {
  initialSubject?: string;
  onSelectVideo?: (url: string) => void;
}

const SUBJECTS = [
  "All",
  "Computer Science",
  "AI & Machine Learning",
  "Mathematics",
  "Physics",
  "Engineering",
  "General",
] as const;

export default function SubjectVideoCatalog({
  initialSubject = "All",
  onSelectVideo,
}: SubjectVideoCatalogProps) {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const videos = getSubjectVideos(selectedSubject);

  const handleCopy = (video: SubjectVideoLink) => {
    navigator.clipboard.writeText(video.url);
    setCopiedId(video.id);
    toast.success(`Copied link: ${video.title}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunLecture = (video: SubjectVideoLink) => {
    if (onSelectVideo) {
      onSelectVideo(video.url);
      return;
    }
    router.push(`/upload?url=${encodeURIComponent(video.url)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>Curated Curriculum Video Links</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Recommended Lectures by Subject
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Select any video lecture from MIT, Harvard, 3Blue1Brown, and top educators to run AI notes or study directly.
          </p>
        </div>

        <div className="text-xs text-gray-400 shrink-0">
          <span className="text-cyan-400 font-semibold">{videos.length}</span> verified lectures available
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SUBJECTS.map((sub) => {
          const isSelected = selectedSubject === sub;
          return (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/20"
                  : "bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-800"
              }`}
            >
              <span>{sub}</span>
            </button>
          );
        })}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col justify-between bg-gray-900/60 hover:bg-gray-900/90 border border-gray-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/30" />

                {/* Subject Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold">
                  {video.subject}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-gray-300 text-[10px] font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{video.duration}</span>
                </div>

                {/* Quick Play Trigger Overlay */}
                <button
                  type="button"
                  onClick={() => handleRunLecture(video)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity cursor-pointer"
                  title="Run Lecture in NexusEDU"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-cyan-500/40 transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </button>
              </div>

              {/* Video Info Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-medium text-gray-300">{video.channel}</span>
                    <span className="text-[11px] text-gray-500">~{video.readTimeMinutes}m study</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Key Syllabus Topics Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {video.keyTopics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-400 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                  {video.keyTopics.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-gray-500">
                      +{video.keyTopics.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunLecture(video)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(video)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Copy YouTube Video Link"
                  >
                    {copiedId === video.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                    title="Watch on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
