"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import Image from "next/image"
import MaxWidthWrapper from "../common/MaxWidthWrapper"
import { Sparkles, ArrowRight, Youtube, Play, FileText, Download, CheckCircle, Clock, Volume2, HelpCircle, EyeOff, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import WatchDemo from "./watch-demo"
import Canvas3DBackground from "../common/canvas-3d-background"
import Tilt3DCard from "../common/tilt-3d-card"
export function Hero() {
    const controls = useAnimation()
    const [isLoaded, setIsLoaded] = useState(true)
    const [quickYoutubeUrl, setQuickYoutubeUrl] = useState("")

    const router = useRouter()

    const handleQuickRun = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = quickYoutubeUrl.trim();
        if (trimmed) {
            router.push(`/upload?url=${encodeURIComponent(trimmed)}`);
        } else {
            router.push("/upload");
        }
    };

    useEffect(() => {
        if (isLoaded) {
            controls.start("visible")
        }
    }, [isLoaded, controls])

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* 3D Animated Canvas Background: Constellations, Gyroscopic Rings & Core Polyhedron */}
            <Canvas3DBackground />

            <MaxWidthWrapper className="relative z-10 md:mb-12 mt-0 md:mt-12">
                <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 md:mb-8"
                    >
                        <div className="inline-flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-white/10">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-300 mr-1.5 sm:mr-2" />
                            <span className="text-xs sm:text-sm font-medium text-gray-100">AI-Powered Learning Assistant</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1 },
                        }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                                Transform Video Lectures
                            </span>
                            <br className="hidden md:block" />
                            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl block mt-3 md:mt-4">
                                Into Smart{" "}
                                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                    Study Materials
                                </span>
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial="hidden"
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                        }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl md:max-w-3xl mx-auto font-medium"
                    >
                        NexusEDU transforms educational videos into <span className="text-cyan-300">comprehensive study notes</span>{" "}
                        and <span className="text-emerald-300">practice questions</span>. Perfect for students, educators, and
                        lifelong learners.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-8 flex flex-col items-center justify-center gap-4 w-full max-w-xl mx-auto"
                    >
                        {/* Direct YouTube Input & Run Form */}
                        <form onSubmit={handleQuickRun} className="w-full flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/30 transition-all">
                            <div className="flex items-center gap-2 px-3 w-full">
                                <Youtube className="w-5 h-5 text-red-500 shrink-0" />
                                <input
                                    type="text"
                                    value={quickYoutubeUrl}
                                    onChange={(e) => setQuickYoutubeUrl(e.target.value)}
                                    placeholder="Paste any YouTube lecture link to run..."
                                    className="w-full bg-transparent text-sm sm:text-base text-gray-100 placeholder:text-gray-400 outline-none py-2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shrink-0 cursor-pointer shadow-lg shadow-cyan-500/20"
                            >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Run & Summarize</span>
                            </button>
                        </form>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-gray-400">
                            <span>Or explore:</span>
                            <button
                                type="button"
                                onClick={() => router.push("/upload")}
                                className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 cursor-pointer"
                            >
                                Open Upload Studio
                            </button>
                            <span>•</span>
                            <WatchDemo />
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-8 md:mt-12 w-full max-w-5xl lg:max-w-7xl px-2 sm:px-4 text-left"
                    >
                        {/* Interactive 3D Tilt Wrapper */}
                        <Tilt3DCard className="w-full" intensity={6} glare={true}>
                            {/* Browser Window Frame */}
                            <div className="relative w-full rounded-2xl md:rounded-3xl border border-gray-800 bg-gray-950/95 backdrop-blur-xl shadow-2xl overflow-hidden group">
                                {/* Window Topbar */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-gray-800 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-black/40 border border-white/5 text-gray-400 font-mono text-[11px] flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>https://nexusedu.ai/study?v=8mAITcNt710</span>
                                </div>
                                <div className="text-[11px] text-cyan-400/80 font-medium hidden sm:block">
                                    NexusEDU v2.4 Active
                                </div>
                            </div>

                            {/* Inner App Header */}
                            <div className="px-4 sm:px-6 py-3.5 bg-black/50 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                                        NexusEDU
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                                        Smart Study Suite
                                    </span>
                                </div>
                                <div className="hidden md:flex items-center gap-5 text-xs text-gray-300">
                                    <span className="text-cyan-300 font-medium">Home</span>
                                    <span className="hover:text-white cursor-pointer" onClick={() => router.push("/dashboard")}>My Library</span>
                                    <span className="hover:text-white cursor-pointer" onClick={() => router.push("/upload")}>Run Lecture</span>
                                    <span className="hover:text-white cursor-pointer">About Us</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-[10px] font-bold text-white flex items-center justify-center uppercase">
                                        S
                                    </div>
                                    <span className="text-xs text-gray-300 font-medium hidden sm:inline">Suraj Kumar</span>
                                </div>
                            </div>

                            {/* Inner Page Title & Actions */}
                            <div className="p-4 sm:p-6 pb-3 border-b border-white/5 bg-gradient-to-b from-cyan-950/20 to-transparent">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                                            Your Study Materials
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                            AI-generated notes and study materials are ready! Synchronized with lecture timeline.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => router.push("/upload")}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/25 transition-all cursor-pointer"
                                        >
                                            <EyeOff className="w-3.5 h-3.5" />
                                            <span>Study Without Video</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.push("/upload")}
                                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-md"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Download PDF</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Split Workspace Preview */}
                            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Left: Video Player Mockup (5 cols) */}
                                <div className="lg:col-span-5 space-y-3">
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-gray-900 shadow-lg group-hover:border-cyan-500/30 transition-all">
                                        <img
                                            src="https://i.ytimg.com/vi/8mAITcNt710/hqdefault.jpg"
                                            alt="Harvard CS50 Lecture preview"
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] text-cyan-300 font-mono border border-cyan-500/30 flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                    Active: [08:40]
                                                </span>
                                                <span className="text-[10px] text-gray-300 bg-black/60 px-2 py-0.5 rounded">
                                                    45:20 min
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs text-white font-medium">
                                                    <span className="truncate max-w-[220px]">Harvard CS50: Intro to Algorithms</span>
                                                    <span className="text-[11px] text-cyan-300 font-mono">08:40</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-[24%]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                                        <span className="flex items-center gap-1 text-emerald-400">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Live Bi-directional Sync
                                        </span>
                                        <span className="text-gray-500">Auto-tracking speech</span>
                                    </div>
                                </div>

                                {/* Right: Line-by-Line Synchronized Notes Preview (7 cols) */}
                                <div className="lg:col-span-7 space-y-3">
                                    {/* Active Highlighted Segment */}
                                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/50 shadow-md space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    08:40
                                                </span>
                                                <span className="text-xs font-semibold text-white">
                                                    Asymptotic Complexity & Big-O Notation
                                                </span>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                                Active Sync
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            The instructor rigorously formalizes asymptotic analysis, illustrating why lower-order polynomial terms and constant multipliers vanish as input size approaches infinity.
                                        </p>
                                        <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                                            <span>Formula: T(n) = c₁·n log(n) + c₂·n ⟹ O(n log n)</span>
                                            <span className="text-[10px] text-gray-400">Worst-case bound</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-1.5">
                                            <span className="font-bold">! Exam Pitfall:</span>
                                            <span>Big-O is an upper bound guarantee, whereas Theta (Θ) provides the strict tight bound.</span>
                                        </div>
                                    </div>

                                    {/* Next Segment Preview */}
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 opacity-80 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-xs">
                                                14:15
                                            </span>
                                            <span className="text-xs font-semibold text-gray-200">
                                                Divide & Conquer: Recurrence Tree Expansion
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-1">
                                            Analysis of recursive branching factor across tree depth log₂(n) with contiguous memory indexing.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Call to Action strip */}
                            <div className="px-6 py-3 bg-gradient-to-r from-cyan-950/40 via-gray-950 to-emerald-950/40 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="text-gray-400">
                                    Experience the complete study suite with real-time video playback and notes synchronization.
                                </span>
                                <button
                                    type="button"
                                    onClick={() => router.push("/upload")}
                                    className="text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                    <span>Try with your own YouTube video</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </Tilt3DCard>
                </motion.div>
                </div>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={controls}
                    variants={{
                        hidden: { scaleX: 0 },
                        visible: { scaleX: 1 },
                    }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="mt-12 md:mt-20 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                />
            </MaxWidthWrapper>
        </section>
    )
}

