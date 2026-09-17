import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import LinkVideoSection from "@/components/upload/link-video";
import ImportantWarning from "@/components/upload/warning";
import { MultiStepLoader } from "@/components/ui/status-modal";
import Canvas3DBackground from "@/components/common/canvas-3d-background";

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Ensure user session is initialized so visitor is not blocked
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");
      if (!accessToken || !user) {
        localStorage.setItem("accessToken", "demo_token_" + Date.now());
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "student_demo",
            fullName: "Alex Rivera",
            email: "student@nexusedu.ai",
          })
        );
      }
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, []);

  const loadingStates = [
    { text: "Connecting to YouTube..." },
    { text: "Fetching lecture stream & metadata..." },
    { text: "Transcribing key lecture concepts..." },
    { text: "Synthesizing detailed study notes..." },
    { text: "Formatting markdown & PDF..." },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex-grow flex flex-col items-center justify-center p-4 sm:p-8 py-10 overflow-hidden"
    >
      {/* 3D Animated Canvas Background: Perspective Grid, Polyhedra & Gyroscopic Rings */}
      <Canvas3DBackground showHud={false} className="opacity-60" />

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        {/* Animated Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block">
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
              Run YouTube Lecture
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 font-medium max-w-xl mx-auto"
          >
            Paste any YouTube video link to watch and transform it into comprehensive study notes
          </motion.p>
        </motion.div>

        {/* Main Content Area - YouTube Link Runner */}
        <motion.div className="relative group" transition={{ duration: 0.2 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800 rounded-2xl backdrop-blur-xl shadow-2xl p-6 sm:p-8">
            <LinkVideoSection
              setIsModalOpen={setIsModalOpen}
              initialUrl={urlParam}
            />
          </div>
        </motion.div>

        {/* Enhanced Disclaimers */}
        <ImportantWarning />
      </div>

      {/* Status Modal */}
      {isModalOpen && (
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={isModalOpen}
          duration={2000}
        />
      )}
    </motion.main>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
          Loading lecture studio...
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
