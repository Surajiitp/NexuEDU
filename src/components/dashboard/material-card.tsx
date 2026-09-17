import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  Play,
  Trash2,
  Eye,
  Youtube,
} from "lucide-react";
import { StudyMaterial } from "@/types/library";
import { useRouter } from "next/navigation";

interface MaterialCardProps {
  material: StudyMaterial;
  viewMode: "grid" | "list";
  onPreview: (material: StudyMaterial) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Computer Science": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  "AI & Machine Learning": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  "Mathematics": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  "Physics": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  "Engineering": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  "General": {
    bg: "bg-gray-500/10",
    text: "text-gray-300",
    border: "border-gray-500/30",
  },
};

export default function MaterialCard({
  material,
  viewMode,
  onPreview,
  onToggleFavorite,
  onDelete,
}: MaterialCardProps) {
  const router = useRouter();

  const handleStudy = () => {
    const params = new URLSearchParams({
      summary: material.summary,
      videoId: material.videoId || "",
      videoUrl: material.videoUrl || "",
      title: material.title,
    });
    router.push(`/results?${params.toString()}`);
  };

  const categoryStyle =
    CATEGORY_COLORS[material.category] || CATEGORY_COLORS["General"];

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="group bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800 hover:border-gray-700/80 rounded-xl p-4 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:shadow-cyan-500/5"
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Thumbnail / Icon */}
          <div
            onClick={handleStudy}
            className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-gray-950 border border-white/10 shrink-0 cursor-pointer group/thumb"
          >
            {material.thumbnailUrl ? (
              <img
                src={material.thumbnailUrl}
                alt={material.title}
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
              <Play className="w-5 h-5 fill-white text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
              >
                {material.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Clock className="w-3 h-3" />
                {material.readTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Calendar className="w-3 h-3" />
                {material.date}
              </span>
            </div>

            <h3
              onClick={handleStudy}
              className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
            >
              {material.title}
            </h3>

            <p className="text-xs text-gray-400 line-clamp-1">
              {material.author} • {material.keyTakeaways?.[0] || "AI-generated structured lecture summary"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
          <button
            type="button"
            onClick={() => onToggleFavorite(material.id)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              material.isFavorite
                ? "bg-red-500/15 border-red-500/30 text-red-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-red-400"
            }`}
            title={material.isFavorite ? "Remove favorite" : "Mark as favorite"}
          >
            <Heart
              className={`w-4 h-4 ${
                material.isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => onPreview(material)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Read</span>
          </button>

          <button
            type="button"
            onClick={handleStudy}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer shadow-md shadow-cyan-500/10"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Open & Run</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(material.id)}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete from library"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
    >
      {/* Top Media Area */}
      <div className="relative aspect-video w-full bg-gray-950 overflow-hidden">
        {material.thumbnailUrl ? (
          <img
            src={material.thumbnailUrl}
            alt={material.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 p-4">
            <BookOpen className="w-10 h-10 text-cyan-400/80 mb-2" />
            <span className="text-xs text-gray-500">Lecture Material</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />

        {/* Badges on Thumbnail */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md border shadow-sm ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          >
            {material.category}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(material.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              material.isFavorite
                ? "bg-red-500/20 border-red-500/40 text-red-400 scale-110"
                : "bg-black/50 border-white/10 text-gray-300 hover:text-red-400"
            }`}
            title={material.isFavorite ? "Remove favorite" : "Mark as favorite"}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                material.isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>

        {/* Video overlay action */}
        {material.videoId && (
          <div
            onClick={handleStudy}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-gray-200 text-xs font-medium cursor-pointer hover:bg-red-500/80 hover:text-white transition-colors"
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube Sync</span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-gray-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>{material.readTimeMinutes} min</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{material.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {material.date}
            </span>
          </div>

          <h3
            onClick={handleStudy}
            className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {material.title}
          </h3>

          {/* Key Takeaway Snippet */}
          {material.keyTakeaways && material.keyTakeaways.length > 0 && (
            <p className="text-xs text-gray-400 line-clamp-2 italic bg-white/5 p-2.5 rounded-lg border border-white/5">
              "{material.keyTakeaways[0]}"
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {material.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-800/80 text-gray-400 text-[10px] rounded-md border border-gray-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onPreview(material)}
            className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Preview</span>
          </button>

          <button
            type="button"
            onClick={handleStudy}
            className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer shadow-md shadow-cyan-500/10"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Study Notes</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(material.id)}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
