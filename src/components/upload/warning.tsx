import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import React from "react";

export default function ImportantWarning() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-sm space-y-2 backdrop-blur-sm"
    >
      <div className="flex items-start gap-2 text-amber-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <p className="font-medium">Important Notes:</p>
          <ul className="list-disc list-inside text-gray-400 mt-1 space-y-1">
            <li className="transition-colors hover:text-gray-300">
              Supports standard YouTube videos, playlists, tutorials, and YouTube Shorts
            </li>
            <li className="transition-colors hover:text-gray-300">
              Video duration recommended under 60–90 minutes for optimal note density
            </li>
            <li className="transition-colors hover:text-gray-300">
              Live player preview runs immediately on link input
            </li>
            <li className="transition-colors hover:text-gray-300">
              Comprehensive study notes, key takeaways, and PDF export ready instantly
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
