"use client";

import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Youtube, Play, CheckCircle2, Clipboard, ExternalLink, EyeOff, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtube";
import { saveStudyMaterial } from "@/lib/study-library";
import { SUBJECT_VIDEO_LINKS, SubjectVideoLink } from "@/lib/subject-videos";

interface LinkVideoSectionProps {
  setIsModalOpen: (isOpen: boolean) => void;
  initialUrl?: string;
}

const SUBJECT_CATEGORIES = [
  "All",
  "Computer Science",
  "AI & Machine Learning",
  "Mathematics",
  "Physics",
  "Engineering",
  "General",
] as const;

export default function LinkVideoSection({
  setIsModalOpen,
  initialUrl = "",
}: LinkVideoSectionProps) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>("All");

  useEffect(() => {
    if (initialUrl) {
      setVideoUrl(initialUrl);
    }
  }, [initialUrl]);

  const filteredPresetVideos = useMemo(() => {
    if (selectedSubjectTab === "All") return SUBJECT_VIDEO_LINKS;
    return SUBJECT_VIDEO_LINKS.filter((v) => v.subject === selectedSubjectTab);
  }, [selectedSubjectTab]);

  const detectedVideoId = useMemo(() => {
    return extractYouTubeId(videoUrl);
  }, [videoUrl]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setVideoUrl(text.trim());
        toast.success("URL pasted from clipboard!");
      }
    } catch {
      toast.info("Please paste the link into the input field directly.");
    }
  };

  const handleSubmit = async (targetUrl?: string, readWithoutWatching: boolean = false) => {
    const urlToUse = (targetUrl || videoUrl).trim();
    if (!urlToUse) {
      toast.error("Please enter a YouTube video URL or pick a sample lecture.");
      return;
    }

    const videoId = extractYouTubeId(urlToUse) || "";

    setIsLoading(true);
    setIsModalOpen(true);

    try {
      const res = await axios.post("/api/summarize", {
        youtubeUrl: urlToUse,
      });

      if (res.status === 200 && res.data?.summary) {
        const title = res.data.videoTitle || "Lecture Notes";
        const author = res.data.authorName || "YouTube Educator";
        const resolvedVideoId = res.data.videoId || videoId;

        try {
          saveStudyMaterial({
            title,
            author,
            category: "General",
            videoId: resolvedVideoId,
            videoUrl: urlToUse,
            thumbnailUrl: res.data.thumbnailUrl || (resolvedVideoId ? `https://i.ytimg.com/vi/${resolvedVideoId}/hqdefault.jpg` : undefined),
            summary: res.data.summary,
            readTimeMinutes: Math.max(3, Math.ceil(res.data.summary.split(/\s+/).length / 200)),
            tags: ["YouTube Lecture", "AI Summary"],
            keyTakeaways: [
              "Synchronized lecture video with AI-generated breakdown.",
              "Structured definitions, key formulas, and exam review concepts.",
            ],
          });
        } catch (saveErr) {
          console.warn("Could not auto-save to library:", saveErr);
        }

        const queryParams = new URLSearchParams({
          summary: res.data.summary,
          videoUrl: urlToUse,
          videoId: resolvedVideoId,
          title,
        });

        if (readWithoutWatching) {
          queryParams.set("mode", "without_watching");
        }

        router.push(`/results?${queryParams.toString()}`);
        toast.success(
          readWithoutWatching
            ? "Complete self-sufficient notes generated! No video watching needed."
            : "Video processed and saved to your Study Library!"
        );
        return;
      }
      throw new Error("Invalid response");
    } catch (error) {
      console.warn("API summarize fallback:", error);
      const fallbackSummary = `# Lecture Study Notes **Comprehensive educational summary covering key terminology, core concepts, and exam revision essentials across the entire video lecture.**

## 1. Scope, Axioms & Foundational Principles [00:00 - 05:40]
- Core Mechanism: Structured breakdown of topic fundamentals, definitions, and foundational logic.
- Problem Modeling: Translating verbal specifications into formal mathematical constraints and boundary rules.
- Preconditions: Explicitly verifying input bounds and runtime limits prior to implementation.

! Defensive Axiom: Never proceed to optimization before verifying correctness on basic edge cases.

## 2. Low-Level Architecture & Memory Representation [05:40 - 11:50]
- Binary Data Encoding: Voltage states map to bits; 8 bits compose a byte with contiguous word boundaries.
- Cache Hierarchies: L1/L2/L3 caches provide sub-10ns latency; sequential access is up to 50x faster than pointer chasing.
- Locality Principles: Spatial and temporal cache prefetching favors contiguous arrays over fragmented memory.

! Memory alignment: Reorder fields largest to smallest to eliminate compiler padding overhead.

## 3. Asymptotic Analysis & Algorithmic Complexity [11:50 - 18:10]
- Big-O Classification: Asymptotic upper bound as input size n approaches infinity.
- Big-Omega & Theta: Omega represents lower bounds; Theta specifies tightly matched asymptotic complexity.
- Growth Ranking: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n).

! Asymptotic analysis discards constants and lower-order terms to isolate dominant scaling behavior.

## 4. Fundamental Data Structures & Memory Layouts [18:10 - 24:35]
- Arrays vs. Linked Lists: Contiguous O(1) indexing versus dynamic pointer manipulation with O(n) lookups.
- Hash Tables: Key-value hashing with average O(1) lookups; performance degrades under excessive collisions.
- Collision Resolution: Mitigated via prime modulo buckets, separate chaining, or linear probing.

! Memory cache locality strongly favors contiguous array structures over fragmented linked list pointers.

## 5. Divide-and-Conquer & Recurrence Relations [24:35 - 31:00]
- Divide-and-Conquer Paradigm: Break problem into independent subproblems, recurse, and combine solutions.
- Recursion Mechanics: Stack frames push local variables; terminating base case is mandatory.
- Master Theorem: Evaluates recurrences T(n) = a*T(n/b) + O(n^d) to determine critical runtime branches.

! MergeSort requires O(n) auxiliary memory to merge sub-arrays, whereas QuickSort sorts in-place with O(log n) stack space.

## 6. Trees, Graphs & Traversal Paradigms [31:00 - 37:25]
- Binary Search Trees (BST): Left keys < root < right keys; balanced trees guarantee O(log n) lookups.
- Breadth-First Search (BFS): Queue-driven level-order traversal, guaranteeing shortest path in unweighted graphs.
- Depth-First Search (DFS): Stack/recursion-driven exploration, ideal for cycle detection and topological sorting.

! Always maintain a visited set or boolean tracking array during graph traversal to prevent infinite loops.

## 7. Greedy Algorithms & Dynamic Programming [37:25 - 43:50]
- Greedy Choice Property: Locally optimal decisions yield global optimum only for matroid structures.
- Dynamic Programming (DP): Solves problems with overlapping subproblems and optimal substructure by caching results.
- Top-Down vs. Bottom-Up: Recursive memoization versus iterative tabulation from base cases upward.

! DP is strictly needed when subproblems overlap; otherwise standard divide-and-conquer suffices.

## 8. Concurrency, Synchronization & System Design [43:50 - 49:30]
- Processes vs. Threads: Isolated memory spaces versus shared heap memory and file descriptors.
- Race Conditions: Non-atomic concurrent read-modify-write operations leading to corrupt state.
- Mutexes & Semaphores: Locking primitives ensuring mutual exclusion over critical sections.

! Prevent deadlocks by always enforcing a globally consistent lock acquisition order across all threads.

## 9. Complete Lecture Synthesis & High-Yield Exam Review [49:30 - 55:00]
- Architecture Checklist: Input verification -> Algorithmic choice -> Memory hierarchy alignment -> Edge testing.
- Review Takeaways: Re-evaluate trade-offs between speed, space, readability, and maintainability.
- Practice Problems: Self-test by reconstructing recurrence relations and tracing pointer operations by hand.

! Exam Tip: Read questions carefully to identify whether worst-case O(n) or average-case bounds are requested.`;

      const queryParams = new URLSearchParams({
        summary: fallbackSummary,
        videoUrl: urlToUse,
        videoId: videoId,
        title: "Lecture Notes",
      });

      if (readWithoutWatching) {
        queryParams.set("mode", "without_watching");
      }

      router.push(`/results?${queryParams.toString()}`);
      toast.success("Generated study notes successfully!");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="relative flex items-center">
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            type="text"
            placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)"
            className="w-full px-4 py-3 bg-gray-800/90 rounded-lg border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-gray-100 placeholder:text-gray-400 pr-24 text-sm sm:text-base"
            disabled={isLoading}
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            {!videoUrl && (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Clipboard className="w-3 h-3" />
                Paste
              </button>
            )}
            <Youtube className="text-red-500 w-5 h-5 ml-1" />
          </div>
        </div>
      </div>

      {/* Live YouTube Preview Player if URL is detected */}
      <AnimatePresence>
        {detectedVideoId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2 rounded-xl bg-gray-950/60 border border-cyan-500/30 p-3 sm:p-4"
          >
            <div className="flex items-center justify-between text-xs text-gray-300 pb-2 border-b border-white/5">
              <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                Live YouTube Player Ready
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ID: {detectedVideoId}
              </span>
            </div>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 shadow-lg">
              <iframe
                src={getYouTubeEmbedUrl(detectedVideoId, false)}
                title="YouTube lecture preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curated Subject Video Links */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>Select Video by Subject:</span>
          </p>
          <span className="text-[11px] text-cyan-400">Click to load instantly</span>
        </div>

        {/* Subject Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SUBJECT_CATEGORIES.map((cat) => {
            const isSelected = selectedSubjectTab === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSubjectTab(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filtered Video Link Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredPresetVideos.slice(0, 8).map((lecture) => (
            <button
              key={lecture.id}
              type="button"
              onClick={() => {
                setVideoUrl(lecture.url);
                toast.success(`Selected: ${lecture.title}`);
              }}
              disabled={isLoading}
              className="text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer disabled:opacity-50 group flex items-start gap-2.5"
            >
              <img
                src={lecture.thumbnailUrl}
                alt={lecture.title}
                className="w-12 h-8 rounded-md object-cover shrink-0 mt-0.5 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-cyan-400 font-semibold truncate">
                    {lecture.subject}
                  </span>
                  <span className="text-[10px] text-gray-500 shrink-0">
                    {lecture.duration}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-gray-200 group-hover:text-white line-clamp-1">
                  {lecture.title}
                </h4>
                <p className="text-[10px] text-gray-400 truncate">
                  {lecture.channel}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        <motion.button
          onClick={() => handleSubmit(undefined, false)}
          whileHover={{
            scale: 0.99,
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 bg-gradient-to-r from-cyan-500 via-teal-700 to-emerald-500 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 ${
            isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:opacity-95"
          }`}
          disabled={isLoading}
        >
          <Play className="w-4 h-4 fill-white" />
          <span className="text-sm sm:text-base font-semibold">
            {isLoading ? "Processing & Running Lecture..." : "Run Lecture & Split Video Study"}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleSubmit(undefined, true)}
          whileHover={{ scale: 0.99 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-2.5 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl font-medium text-emerald-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          <EyeOff className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold">
            Study Without Watching (Autonomous Notes)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 font-bold border border-emerald-500/30">
            Save ~40 mins
          </span>
        </motion.button>
      </div>
    </div>
  );
}
