import React, { useState } from "react";
import { GlossaryItem } from "@/types/library";
import { Search, BookMarked, Play, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface GlossaryViewProps {
  items: GlossaryItem[];
  onSeekToTimestamp?: (seconds: number, timestamp: string) => void;
}

export default function GlossaryView({ items, onSeekToTimestamp }: GlossaryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q);
  });

  const handleCopy = async (item: GlossaryItem) => {
    try {
      await navigator.clipboard.writeText(`${item.term}: ${item.definition}`);
      setCopiedTerm(item.term);
      toast.success(`Copied definition for ${item.term}`);
      setTimeout(() => setCopiedTerm(null), 2000);
    } catch {
      toast.error("Failed to copy definition");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter glossary terms and definitions..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-black/40 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/70"
        />
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-white text-sm flex items-center gap-1.5 group-hover:text-cyan-300 transition-colors">
                  <BookMarked className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {item.term}
                </h4>

                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  title="Copy term and definition"
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {copiedTerm === item.term ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">{item.definition}</p>
            </div>

            {item.timestamp && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                <span>Timestamp: {item.timestamp}</span>
                <button
                  type="button"
                  onClick={() => {
                    const parts = item.timestamp!.split(":").map(Number);
                    const sec = parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
                    onSeekToTimestamp?.(sec, item.timestamp!);
                  }}
                  className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-cyan-400" />
                  Seek to video
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-8 text-center text-xs text-gray-400 bg-gray-900/40 rounded-xl border border-gray-800">
          No terms matched your search filter.
        </div>
      )}
    </div>
  );
}
