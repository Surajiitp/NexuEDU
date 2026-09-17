import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import SummaryBox from "@/components/dashboard/summary-box";
import AboutSummarySection from "@/components/dashboard/about-data";
import VideoRunner from "@/components/dashboard/video-runner";
import ReadWithoutWatching from "@/components/dashboard/read-without-watching";
import PdfDownloadOptions from "@/components/dashboard/pdf-download-options";
import { convertToMarkdown } from "@/hooks/formate-notes";
import { Spinner } from "@/components/common/spinner";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Clock,
  Youtube,
  EyeOff,
  Play,
  Zap,
} from "lucide-react";
import { extractYouTubeId } from "@/lib/youtube";
import { LineByLineNote, GlossaryItem, FlashcardItem, QuizItem } from "@/types/library";
import {
  getOrGenerateLineByLineNotes,
  getOrGenerateGlossary,
  getOrGenerateFlashcards,
} from "@/lib/line-by-line-helper";
import axios from "axios";
import { toast } from "sonner";

const DEFAULT_SAMPLE_NOTES = `# Harvard CS50 – Introduction to Computer Science & Algorithm Complexity **This lecture provides a rigorous breakdown of foundational computational principles, Big-O asymptotic notation, memory hierarchies, core data structures, and algorithmic paradigms across the full video.**

## 1. Computational Thinking & State Representation [00:00 - 05:40]
- Binary Data Encoding: High and low electrical voltages represent discrete boolean bits (0 and 1).
- ASCII and Unicode: Numerical mappings for text characters, emojis, and international glyphs.
- Byte Alignment: 8 bits constitute 1 byte; modern 64-bit architectures address 8 bytes per memory word.

! Integer overflow occurs when arithmetic exceeds the maximum representable bits of a primitive data type.

## 2. Low-Level Memory Architecture & Cache Locality [05:40 - 11:50]
- Hardware Cache Hierarchy: L1/L2/L3 on-die caches operate within 1-10 CPU cycles, while main memory requires 100+ cycles.
- Spatial Locality: Accessing a memory address automatically fetches adjacent 64-byte cache lines into processor cache.
- Temporal Locality: Memory locations accessed recently are highly likely to be accessed again in the near execution loop.

! Data structures with contiguous memory layout (arrays) run dramatically faster on real CPUs than pointer-based lists.

## 3. Algorithm Analysis and Asymptotic Notation [11:50 - 18:10]
- Time Complexity: Quantifies number of operations executed as input size n grows asymptotically.
- Space Complexity: Measures auxiliary memory consumed during algorithm execution.
- Big-O Classes:
  - O(1): Constant time lookups (hash table keys under ideal distribution).
  - O(log n): Binary search over sorted collections.
  - O(n): Linear scans through unsorted lists.
  - O(n log n): Optimal comparison-based sorting algorithms (MergeSort, QuickSort average case).
  - O(n²): Nested loops and quadratic comparisons (BubbleSort, SelectionSort).

! Asymptotic analysis ignores constant coefficients and lower-order terms to characterize scaling behavior.

## 4. Fundamental Data Structures: Arrays, Linked Lists & Hash Tables [18:10 - 24:35]
- Arrays: Contiguous memory allocations enabling O(1) random indexing, but O(n) insertions and deletions.
- Linked Lists: Dynamic pointer-based nodes allowing O(1) prepend/append when tail pointers are maintained.
- Hash Tables: Key-value stores utilizing hash functions with collision resolution strategies like separate chaining.

! Hash collisions degrade average O(1) lookups toward O(n) unless robust modulo prime hashing is employed.

## 5. Divide-and-Conquer & Recursive Master Theorem [24:35 - 31:00]
- Divide-and-Conquer: Breaking complex problems into independent identical subproblems, recursing, and combining results.
- Recursion Call Stack: Every recursive call allocates a stack frame; base case verification is mathematically mandatory.
- Master Theorem: Analyzes recurrences T(n) = a*T(n/b) + O(n^d) to classify divide-and-conquer runtimes.

! MergeSort guarantees O(n log n) comparisons in all cases, but requires O(n) auxiliary memory to merge partitions.

## 6. Hierarchical Trees, Heaps & Priority Queues [31:00 - 37:25]
- Binary Search Tree (BST): Left children < parent < right children; balanced trees guarantee O(log n) searches.
- Binary Heaps: Complete binary trees packed contiguously into arrays, enabling O(1) peak item retrieval.
- Self-Balancing Trees: AVL and Red-Black rotations prevent worst-case linear degradation.

! In a binary heap stored in an array, the children of index i are at 2i + 1 and 2i + 2 without pointer overhead.

## 7. Graph Traversals: Breadth-First & Depth-First Search [37:25 - 43:50]
- Graph Representations: Adjacency matrices (O(V²) space) vs. Adjacency lists (O(V + E) space).
- Breadth-First Search (BFS): Queue-based level-by-level exploration; guarantees shortest path on unweighted graphs.
- Depth-First Search (DFS): Stack-based or recursive deep branch exploration; detects cycles and topological orders.

! Always maintain a visited set during graph traversal to prevent infinite looping in cyclic graphs.

## 8. Dynamic Programming & Memoization Strategies [43:50 - 49:30]
- Overlapping Subproblems: Storing previously evaluated results in arrays or hash tables avoids redundant recursion.
- Top-Down Memoization: Adding caching logic directly to recursive implementations.
- Bottom-Up Tabulation: Iteratively filling a DP table starting from base cases, eliminating stack overflow risks.

! Dynamic programming is applicable only when the problem exhibits both optimal substructure and overlapping subproblems.

## 9. Full Lecture Synthesis & Final Exam Takeaways [49:30 - 55:00]
- Engineering Decision Framework: Match time and space complexity constraints to real hardware architectures.
- Concurrency & Race Conditions: Mutexes and atomic primitives ensure thread-safety across shared heap allocations.
- Core Exam Takeaway: Master pointer tracing, recursion tree depths, and asymptotic comparisons for final assessments.

! Exam Tip: Always confirm boundary conditions (n = 0, n = 1, negative inputs) before writing final algorithms.`;

type StudyMode = "watch_and_study" | "without_watching";

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [notes, setNotes] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("8mAITcNt710");
  const [videoTitle, setVideoTitle] = useState<string>("Harvard CS50 – Introduction to Computer Science");
  const [videoUrl, setVideoUrl] = useState<string>("https://www.youtube.com/watch?v=8mAITcNt710");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Study Mode: Watch & Study (Split) vs. Read Without Watching (Autonomous Full Notes)
  const [studyMode, setStudyMode] = useState<StudyMode>("watch_and_study");

  // Line-by-line video sync state
  const [seekSeconds, setSeekSeconds] = useState<number>(0);
  const [seekTimestamp, setSeekTimestamp] = useState<string>("");
  const [lineByLineNotes, setLineByLineNotes] = useState<LineByLineNote[]>([]);
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [quiz, setQuiz] = useState<QuizItem[]>([]);

  const summaryParam = params.get("summary") || "";
  const videoUrlParam = params.get("videoUrl") || "";
  const videoIdParam = params.get("videoId") || "";
  const titleParam = params.get("title") || "";
  const modeParam = params.get("mode") || "";

  useEffect(() => {
    if (modeParam === "read" || modeParam === "without_watching") {
      setStudyMode("without_watching");
    }

    let currentNotes = DEFAULT_SAMPLE_NOTES;

    if (summaryParam) {
      const decodedSummary = decodeURIComponent(summaryParam);
      currentNotes = decodedSummary.includes("# ") ? decodedSummary : convertToMarkdown(decodedSummary);
      setNotes(currentNotes);
    } else {
      setNotes(DEFAULT_SAMPLE_NOTES);
    }

    if (videoIdParam) {
      setVideoId(videoIdParam);
    } else if (videoUrlParam) {
      const extracted = extractYouTubeId(videoUrlParam);
      if (extracted) setVideoId(extracted);
    }

    if (videoUrlParam) {
      setVideoUrl(videoUrlParam);
    }

    const resolvedTitle = titleParam ? decodeURIComponent(titleParam) : "Harvard CS50 – Introduction to Computer Science";
    setVideoTitle(resolvedTitle);

    // Populate line-by-line notes, glossary, flashcards
    setLineByLineNotes(getOrGenerateLineByLineNotes({ summary: currentNotes, title: resolvedTitle }));
    setGlossary(getOrGenerateGlossary({ summary: currentNotes, title: resolvedTitle }));
    setFlashcards(getOrGenerateFlashcards({ summary: currentNotes, title: resolvedTitle }));
  }, [summaryParam, videoUrlParam, videoIdParam, titleParam, modeParam]);

  const handleSeekToTimestamp = (seconds: number, timestamp: string) => {
    setSeekSeconds(seconds);
    setSeekTimestamp(timestamp);
    toast.success(`Video jumped to [${timestamp}]`, {
      description: "Playing synchronized lecture segment",
      icon: "▶️",
    });

    const videoEl = document.getElementById("active-video-player");
    if (videoEl && window.innerWidth < 768) {
      videoEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRunNewVideo = async (newUrl: string) => {
    const extractedId = extractYouTubeId(newUrl);
    if (!extractedId) {
      toast.error("Please enter a valid YouTube link.");
      return;
    }

    setIsUpdating(true);
    setVideoId(extractedId);
    setVideoUrl(newUrl);
    setVideoTitle("Generating Complete Study Notes...");
    setSeekSeconds(0);
    setSeekTimestamp("");

    try {
      const res = await axios.post("/api/summarize", {
        youtubeUrl: newUrl,
      });

      if (res.status === 200 && res.data) {
        if (res.data.summary) {
          setNotes(res.data.summary);
        }
        if (res.data.videoTitle) {
          setVideoTitle(res.data.videoTitle);
        }
        if (res.data.lineByLineNotes) {
          setLineByLineNotes(res.data.lineByLineNotes);
        } else {
          setLineByLineNotes(getOrGenerateLineByLineNotes({ summary: res.data.summary, title: res.data.videoTitle }));
        }
        if (res.data.glossary) {
          setGlossary(res.data.glossary);
        }
        if (res.data.flashcards) {
          setFlashcards(res.data.flashcards);
        }
        if (res.data.quiz) {
          setQuiz(res.data.quiz);
        }
        toast.success("Complete notes and lecture analysis ready!");
      }
    } catch (err) {
      console.warn("Error running new video:", err);
      toast.info("Switched video player. Generating local structured study guide.");
      const fallbackTitle = `Lecture Video (${extractedId})`;
      setVideoTitle(fallbackTitle);
      setLineByLineNotes(getOrGenerateLineByLineNotes({ title: fallbackTitle }));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto flex-grow w-full py-6 sm:py-8"
    >
      <div className="space-y-6">
        {/* Navigation & Study Mode Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Upload</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Study Library</span>
            </button>
            <PdfDownloadOptions
              summary={notes}
              videoTitle={videoTitle}
              lineByLineNotes={lineByLineNotes}
              glossary={glossary}
            />
          </div>

          {/* Core Feature Mode Switcher: Watch & Study vs. Study Without Watching */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-gray-800 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setStudyMode("watch_and_study");
                toast.info("Switched to Watch & Study Video Mode");
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                studyMode === "watch_and_study"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-black shadow-md shadow-cyan-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Watch & Study</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStudyMode("without_watching");
                toast.success("Switched to Read Without Watching Mode", {
                  description: "Full self-sufficient notes without video distraction",
                });
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                studyMode === "without_watching"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md shadow-emerald-500/20 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Study Without Watching (Full Notes)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold text-white">
                Save ~40m
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic View rendering based on studyMode */}
        <AnimatePresence mode="wait">
          {studyMode === "without_watching" ? (
            /* MODE 2: Study Without Watching Video (Autonomous Standalone Reader) */
            <motion.div
              key="without_watching_view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <ReadWithoutWatching
                title={videoTitle}
                summary={notes}
                lineByLineNotes={lineByLineNotes}
                glossary={glossary}
                flashcards={flashcards}
                onSwitchToWatchMode={() => setStudyMode("watch_and_study")}
              />

              {/* Practice Quiz at the bottom of the autonomous reader */}
              <div className="pt-4 border-t border-gray-800">
                <AboutSummarySection
                  quiz={quiz}
                  videoTitle={videoTitle}
                  onSeekToTimestamp={handleSeekToTimestamp}
                />
              </div>
            </motion.div>
          ) : (
            /* MODE 1: Watch & Study Video (Split Screen Video + Synchronized Notes) */
            <motion.div
              key="watch_and_study_view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Quick Prompt to switch to Read Without Watching */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-gray-900 to-gray-900 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Short on time? Read the complete self-sufficient notes and save ~45 minutes of video watching.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStudyMode("without_watching")}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Read Without Watching
                </button>
              </div>

              {/* Embedded Active Video Runner */}
              <div id="active-video-player">
                <VideoRunner
                  videoId={videoId}
                  videoTitle={videoTitle}
                  videoUrl={videoUrl}
                  onRunNewVideo={handleRunNewVideo}
                  seekSeconds={seekSeconds}
                  seekTimestamp={seekTimestamp}
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Panel - Document Preview (2 cols) */}
                <SummaryBox
                  summary={notes}
                  lineByLineNotes={lineByLineNotes}
                  glossary={glossary}
                  flashcards={flashcards}
                  onSeekToTimestamp={handleSeekToTimestamp}
                  onSwitchToReadWithoutWatching={() => setStudyMode("without_watching")}
                  activeSeconds={seekSeconds}
                  videoTitle={videoTitle}
                />

                {/* Right Panel - Actions, Quiz & Stats (1 col) */}
                <AboutSummarySection
                  quiz={quiz}
                  videoTitle={videoTitle}
                  onSeekToTimestamp={handleSeekToTimestamp}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner text="Loading your lecture notes..." />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
