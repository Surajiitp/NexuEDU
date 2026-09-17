import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Plus,
  Heart,
  Clock,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  RotateCcw,
  Youtube,
  GraduationCap,
  TrendingUp,
  Github,
  Linkedin,
  Mail,
  User,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StudyMaterial } from "@/types/library";
import {
  getStudyMaterials,
  deleteStudyMaterial,
  toggleFavorite,
  resetStudyLibrary,
} from "@/lib/study-library";
import { getPersonalInfo, PersonalInfo } from "@/lib/personal-info";
import MaterialCard from "@/components/dashboard/material-card";
import MaterialPreviewModal from "@/components/dashboard/material-preview-modal";
import SubjectVideoCatalog from "@/components/dashboard/subject-video-catalog";
import { SUBJECT_VIDEO_LINKS, getSubjectVideos } from "@/lib/subject-videos";
import { toast } from "sonner";

const CATEGORIES = [
  "All",
  "Computer Science",
  "AI & Machine Learning",
  "Mathematics",
  "Physics",
  "Engineering",
  "General",
];

export default function UserDashboard() {
  const router = useRouter();
  const [dashboardTab, setDashboardTab] = useState<"library" | "videos">("library");
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title" | "readTime">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Student");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(getPersonalInfo());

  // Load user details & personal info
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.fullName) setUserName(parsed.fullName);
      }
    } catch {
      // ignore
    }

    const updateInfo = () => setPersonalInfo(getPersonalInfo());
    window.addEventListener("personal_info_updated", updateInfo);
    window.addEventListener("storage", updateInfo);
    return () => {
      window.removeEventListener("personal_info_updated", updateInfo);
      window.removeEventListener("storage", updateInfo);
    };
  }, []);

  // Fetch materials from localStorage / mock API
  const loadMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStudyMaterials();
      setMaterials(data);
    } catch (err) {
      console.error("Failed to load study materials:", err);
      toast.error("Failed to load study materials.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaterials();

    const handleUpdate = () => {
      loadMaterials();
    };

    window.addEventListener("study_library_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("study_library_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [loadMaterials]);

  // Handlers
  const handleToggleFavorite = (id: string) => {
    const isNowFav = toggleFavorite(id);
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: isNowFav } : m))
    );
    toast.success(isNowFav ? "Added to favorites!" : "Removed from favorites");
  };

  const handleDelete = (id: string) => {
    deleteStudyMaterial(id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    toast.success("Study material removed from your library.");
  };

  const handleResetDefaults = () => {
    const defaultData = resetStudyLibrary();
    setMaterials(defaultData);
    toast.info("Study library reset to recommended curriculum materials.");
  };

  const handleOpenPreview = (material: StudyMaterial) => {
    setPreviewMaterial(material);
    setIsPreviewOpen(true);
  };

  // Filtered and Sorted list
  const filteredMaterials = useMemo(() => {
    return materials
      .filter((m) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          m.title.toLowerCase().includes(query) ||
          m.author.toLowerCase().includes(query) ||
          m.tags.some((t) => t.toLowerCase().includes(query)) ||
          (m.keyTakeaways && m.keyTakeaways.some((k) => k.toLowerCase().includes(query)));

        // Category filter
        const matchesCategory =
          selectedCategory === "All" || m.category === selectedCategory;

        // Favorites filter
        const matchesFavorite = !showFavoritesOnly || Boolean(m.isFavorite);

        return matchesSearch && matchesCategory && matchesFavorite;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.timestamp - a.timestamp;
        if (sortBy === "oldest") return a.timestamp - b.timestamp;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "readTime") return b.readTimeMinutes - a.readTimeMinutes;
        return 0;
      });
  }, [materials, searchQuery, selectedCategory, showFavoritesOnly, sortBy]);

  // Stats calculation
  const totalReadTime = useMemo(() => {
    return materials.reduce((acc, curr) => acc + (curr.readTimeMinutes || 5), 0);
  }, [materials]);

  const favoritesCount = useMemo(() => {
    return materials.filter((m) => m.isFavorite).length;
  }, [materials]);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Welcome & Stats Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 shadow-2xl overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Knowledge Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Study Library & AI Notes
            </h1>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
              Manage your AI-synthesized lecture summaries, key takeaways, and synchronized YouTube videos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium border border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
              title="Reset with recommended course notes"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
              <span>Load Samples</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Run New YouTube Lecture</span>
            </button>
          </div>
        </div>

        {/* Stats Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Study Notes</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {materials.length}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Read Time</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              ~{totalReadTime} mins
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Heart className="w-3.5 h-3.5 text-red-400" />
              <span>Favorites</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {favoritesCount}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Curriculum Topics</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {new Set(materials.map((m) => m.category)).size}
            </div>
          </div>
        </div>

        {/* Personal Information & Social Profile Card */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 bg-white/[0.02] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center text-base font-bold text-white uppercase">
                {personalInfo.name ? personalInfo.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "SK"}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white">
                  {personalInfo.name}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Personal Info
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {personalInfo.role} • <span className="text-gray-300">{personalInfo.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* LinkedIn */}
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title={`LinkedIn: ${personalInfo.linkedin}`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-blue-400/70" />
            </a>

            {/* GitHub */}
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title={`GitHub: ${personalInfo.github}`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${personalInfo.email}`}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title={`Email: ${personalInfo.email}`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Dashboard View Switcher: Study Library vs Subject Video Catalog */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-gray-900/90 border border-gray-800 shadow-lg">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setDashboardTab("library")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              dashboardTab === "library"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Study Library</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                dashboardTab === "library" ? "bg-black/30 text-white" : "bg-white/10 text-gray-400"
              }`}
            >
              {materials.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab("videos")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              dashboardTab === "videos"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span>Subject Video Links</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                dashboardTab === "videos" ? "bg-black/30 text-white" : "bg-white/10 text-gray-400"
              }`}
            >
              {SUBJECT_VIDEO_LINKS.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 px-2 sm:px-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Curated links across Computer Science, AI, Math, Physics, Engineering & General</span>
        </div>
      </div>

      {dashboardTab === "videos" ? (
        <SubjectVideoCatalog initialSubject={selectedCategory} />
      ) : (
        <>
          {/* Filter and Search Controls */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, instructor, keywords or formulas..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-gray-200 placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Filter Buttons & View Modes */}
              <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
                {/* Favorites filter toggle */}
                <button
                  type="button"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    showFavoritesOnly
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : "bg-gray-900/80 border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      showFavoritesOnly ? "fill-red-400 text-red-400" : ""
                    }`}
                  />
                  <span>Favorites Only</span>
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-gray-300 outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="title">Sort: Title (A-Z)</option>
                  <option value="readTime">Sort: Longest Read</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-900/80 p-1 rounded-xl border border-gray-800">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-500/20"
                        : "bg-gray-900/70 hover:bg-gray-800/80 border border-gray-800 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Subject Video Recommendation Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-transparent border border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Youtube className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Need more lecture videos for {selectedCategory === "All" ? "all subjects" : selectedCategory}?
                </p>
                <p className="text-[11px] text-gray-400">
                  Explore verified lecture links from MIT, Harvard & 3Blue1Brown with 1-click AI Notes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDashboardTab("videos")}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Materials Listing Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Showing <strong className="text-gray-200">{filteredMaterials.length}</strong> study material
                {filteredMaterials.length === 1 ? "" : "s"}
              </span>
              {(searchQuery || selectedCategory !== "All" || showFavoritesOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setShowFavoritesOnly(false);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-3">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-sm">Loading your study materials...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="py-16 px-4 text-center rounded-2xl bg-gray-900/40 border border-gray-800/80 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">No materials found</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {searchQuery || selectedCategory !== "All" || showFavoritesOnly
                      ? "No study notes matched your search query or filters. Try adjusting your search term."
                      : "Your study library is currently empty. Run any YouTube lecture to generate and save your first study materials."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/upload")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/15"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Run YouTube Lecture</span>
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredMaterials.map((material) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      viewMode="grid"
                      onPreview={handleOpenPreview}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredMaterials.map((material) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      viewMode="list"
                      onPreview={handleOpenPreview}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </>
      )}

      {/* Quick Read / Markdown Preview Modal */}
      <MaterialPreviewModal
        material={previewMaterial}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewMaterial(null);
        }}
      />
    </main>
  );
}

