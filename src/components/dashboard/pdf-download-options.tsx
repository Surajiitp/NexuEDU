import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Sliders,
  Check,
  Printer,
  Sparkles,
  Zap,
  Clock,
  BookOpen,
  ChevronDown,
  Loader2,
  X,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import NotesPDF, { NotesPDFProps } from "../common/create-pdf";
import { LineByLineNote, GlossaryItem } from "@/types/library";
import { toast } from "sonner";

interface PdfDownloadOptionsProps {
  summary: string;
  videoTitle?: string;
  lineByLineNotes?: LineByLineNote[];
  glossary?: GlossaryItem[];
  className?: string;
  buttonSize?: "sm" | "md";
  variant?: "primary" | "secondary";
}

type PdfPreset = "complete" | "cram" | "timeline" | "notes_only" | "custom";

export default function PdfDownloadOptions({
  summary,
  videoTitle = "Study Notes",
  lineByLineNotes = [],
  glossary = [],
  className = "",
  buttonSize = "sm",
  variant = "primary",
}: PdfDownloadOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingLabel, setGeneratingLabel] = useState<string>("");

  // Preset & Configuration State
  const [preset, setPreset] = useState<PdfPreset>("complete");
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeLineByLine, setIncludeLineByLine] = useState(true);
  const [includeGlossary, setIncludeGlossary] = useState(true);
  const [includeExamTips, setIncludeExamTips] = useState(true);

  // Apply presets
  const handlePresetSelect = (selected: PdfPreset) => {
    setPreset(selected);
    if (selected === "complete") {
      setIncludeNotes(true);
      setIncludeLineByLine(true);
      setIncludeGlossary(true);
      setIncludeExamTips(true);
    } else if (selected === "cram") {
      setIncludeNotes(true);
      setIncludeLineByLine(true);
      setIncludeGlossary(false);
      setIncludeExamTips(true);
    } else if (selected === "timeline") {
      setIncludeNotes(false);
      setIncludeLineByLine(true);
      setIncludeGlossary(false);
      setIncludeExamTips(true);
    } else if (selected === "notes_only") {
      setIncludeNotes(true);
      setIncludeLineByLine(false);
      setIncludeGlossary(false);
      setIncludeExamTips(true);
    }
  };

  const getSanitizedFileName = (suffix: string = "notes") => {
    const safeTitle = (videoTitle || "NexusEDU_Notes")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 32);
    return `${safeTitle}_${suffix}.pdf`;
  };

  // Direct PDF Download Generator using pdf(doc).toBlob()
  const generateAndDownloadPDF = async (options?: {
    cramSheetOnly?: boolean;
    customIncludeNotes?: boolean;
    customIncludeLineByLine?: boolean;
    customIncludeGlossary?: boolean;
    customIncludeExamTips?: boolean;
    label?: string;
  }) => {
    try {
      setIsGenerating(true);
      setGeneratingLabel(options?.label || "Preparing PDF...");
      toast.info(options?.label || "Compiling PDF document...", {
        description: "Formatting vector typography, headers & timestamp sections",
      });

      const isCram = options?.cramSheetOnly ?? (preset === "cram");
      const useNotes = options?.customIncludeNotes ?? includeNotes;
      const useLineByLine = options?.customIncludeLineByLine ?? includeLineByLine;
      const useGlossary = options?.customIncludeGlossary ?? includeGlossary;
      const useExamTips = options?.customIncludeExamTips ?? includeExamTips;

      const docElement = (
        <NotesPDF
          notes={summary}
          title={videoTitle}
          lineByLineNotes={lineByLineNotes}
          glossary={glossary}
          includeNotes={useNotes}
          includeLineByLine={useLineByLine}
          includeGlossary={useGlossary}
          includeExamTips={useExamTips}
          cramSheetOnly={isCram}
          timestamp={new Date().toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        />
      );

      // Render document to blob
      const blob = await pdf(docElement).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      // Create download trigger
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = getSanitizedFileName(isCram ? "cram_sheet" : "study_guide");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up blob URL after delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      toast.success("PDF Downloaded successfully!", {
        description: `Saved as ${downloadLink.download}`,
      });
      setIsOpen(false);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      toast.error("Could not generate PDF directly in browser", {
        description: "Please try the 'Print / Save as PDF' option instead.",
      });
    } finally {
      setIsGenerating(false);
      setGeneratingLabel("");
    }
  };

  // Browser Print Option: Creates a clean academic printable window
  const handleBrowserPrint = () => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        window.print();
        return;
      }

      const cleanHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${videoTitle} - NexusEDU Study Notes</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              line-height: 1.6;
              background: #fff;
              padding: 20px;
            }
            .header {
              border-bottom: 2px solid #0284c7;
              padding-bottom: 12px;
              margin-bottom: 24px;
            }
            .header h1 {
              font-size: 24px;
              margin: 0 0 6px 0;
              color: #0f172a;
            }
            .header p {
              font-size: 12px;
              color: #64748b;
              margin: 0;
            }
            .section {
              margin-bottom: 20px;
            }
            h2 {
              font-size: 16px;
              color: #0369a1;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-top: 18px;
            }
            h3 {
              font-size: 13px;
              color: #0f766e;
              margin-top: 14px;
            }
            .callout {
              background: #fef3c7;
              border-left: 4px solid #d97706;
              padding: 10px 14px;
              border-radius: 4px;
              font-weight: 600;
              color: #92400e;
              margin: 12px 0;
              font-size: 13px;
            }
            .timeline-item {
              border-left: 3px solid #0284c7;
              padding: 8px 12px;
              margin-bottom: 12px;
              background: #f8fafc;
              border-radius: 0 6px 6px 0;
            }
            .timestamp {
              font-size: 11px;
              font-weight: bold;
              color: #0284c7;
            }
            .formula {
              background: #e0f2fe;
              font-family: monospace;
              padding: 4px 8px;
              border-radius: 4px;
              color: #0369a1;
              display: inline-block;
              margin: 4px 0;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #0284c7; letter-spacing: 1px;">NexusEDU Smart Notes</div>
            <h1>${videoTitle}</h1>
            <p>Generated on ${new Date().toLocaleDateString()} • Video Synchronized Study Material</p>
          </div>

          ${
            includeNotes
              ? `<div class="section">
                  <h2>Comprehensive Lecture Notes</h2>
                  <div style="white-space: pre-wrap; font-size: 13px;">${summary
                    .replace(/# (.+)/g, "<h2>$1</h2>")
                    .replace(/## (.+)/g, "<h3>$1</h3>")
                    .replace(/! (.+)/g, '<div class="callout">⚠️ $1</div>')}</div>
                </div>`
              : ""
          }

          ${
            includeLineByLine && lineByLineNotes && lineByLineNotes.length > 0
              ? `<div class="section">
                  <h2>Line-by-Line Timestamped Walkthrough</h2>
                  ${lineByLineNotes
                    .map(
                      (item) => `
                    <div class="timeline-item">
                      <div class="timestamp">▶ [${item.timestamp}] ${item.title}</div>
                      <p style="margin: 4px 0; font-size: 12px;">${item.detailedExplanation}</p>
                      ${item.keyFormulaOrRule ? `<div class="formula">Formula/Rule: ${item.keyFormulaOrRule}</div>` : ""}
                      ${item.examTakeaway ? `<div class="callout" style="margin-top: 6px;">Exam Tip: ${item.examTakeaway}</div>` : ""}
                    </div>
                  `
                    )
                    .join("")}
                </div>`
              : ""
          }

          ${
            includeGlossary && glossary && glossary.length > 0
              ? `<div class="section">
                  <h2>Key Technical Terms & Glossary</h2>
                  ${glossary
                    .map(
                      (g) => `
                    <div style="margin-bottom: 8px;">
                      <strong>${g.term}:</strong> <span style="font-size: 12px; color: #334155;">${g.definition}</span>
                    </div>
                  `
                    )
                    .join("")}
                </div>`
              : ""
          }

          <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            NexusEDU • Complete Self-Sufficient Study Notes
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(cleanHtml);
      printWindow.document.close();
      setIsOpen(false);
    } catch {
      window.print();
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Segmented Button: Quick Download + Options Dropdown */}
      <div className="inline-flex rounded-lg shadow-sm border border-gray-700 bg-gray-800/80 p-0.5">
        {/* Main 1-Click Download Button */}
        <button
          type="button"
          onClick={() => generateAndDownloadPDF()}
          disabled={isGenerating}
          className={`cursor-pointer flex items-center gap-1.5 font-semibold transition-all rounded-md text-white ${
            buttonSize === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          } ${
            variant === "primary"
              ? "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 shadow-md shadow-cyan-500/10"
              : "bg-white/10 hover:bg-white/20"
          } disabled:opacity-50`}
          title="Download PDF Study Booklet"
        >
          {isGenerating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>{isGenerating ? (generatingLabel || "Generating...") : "Download PDF"}</span>
        </button>

        {/* Options Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isGenerating}
          className={`cursor-pointer px-2 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-r-md transition-colors border-l border-gray-700/60 flex items-center justify-center ${
            isOpen ? "bg-white/15 text-cyan-400" : ""
          }`}
          title="Configure PDF Download Options"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-cyan-400" : ""
            }`}
          />
        </button>
      </div>

      {/* PDF Export Options Modal / Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-gray-900/95 border border-gray-700/80 p-5 shadow-2xl backdrop-blur-2xl z-50 text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">PDF Download Options</h3>
                    <p className="text-[11px] text-gray-400">
                      Customize study booklet content & layout
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="mb-4">
                <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block mb-2">
                  Export Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Complete Guide */}
                  <button
                    type="button"
                    onClick={() => handlePresetSelect("complete")}
                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                      preset === "complete"
                        ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm"
                        : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-cyan-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Full Booklet</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                      All notes, timeline & glossary
                    </p>
                  </button>

                  {/* 5-Min Cram */}
                  <button
                    type="button"
                    onClick={() => handlePresetSelect("cram")}
                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                      preset === "cram"
                        ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm"
                        : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-300">
                      <Zap className="w-3.5 h-3.5" />
                      <span>5-Min Cram</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                      Formulas & exam takeaways only
                    </p>
                  </button>

                  {/* Timeline Only */}
                  <button
                    type="button"
                    onClick={() => handlePresetSelect("timeline")}
                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                      preset === "timeline"
                        ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm"
                        : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-cyan-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Timeline Only</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                      Timestamped lecture breakdown
                    </p>
                  </button>

                  {/* Textbook Notes Only */}
                  <button
                    type="button"
                    onClick={() => handlePresetSelect("notes_only")}
                    className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                      preset === "notes_only"
                        ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm"
                        : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-cyan-300">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Notes Only</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                      Structured markdown chapters
                    </p>
                  </button>
                </div>
              </div>

              {/* Granular Section Toggles */}
              <div className="space-y-2 mb-4 pt-2 border-t border-gray-800">
                <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block mb-1.5">
                  Include Sections
                </label>

                {/* Toggle 1: Comprehensive Notes */}
                <label className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40 hover:bg-gray-800 cursor-pointer transition-colors text-xs">
                  <span className="text-gray-200">Textbook Lecture Notes</span>
                  <input
                    type="checkbox"
                    checked={includeNotes}
                    onChange={(e) => {
                      setIncludeNotes(e.target.checked);
                      setPreset("custom");
                    }}
                    className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-gray-900 cursor-pointer"
                  />
                </label>

                {/* Toggle 2: Line-by-Line Timeline */}
                <label className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40 hover:bg-gray-800 cursor-pointer transition-colors text-xs">
                  <span className="text-gray-200">
                    Timestamped Video Walkthrough ({lineByLineNotes?.length || 0} items)
                  </span>
                  <input
                    type="checkbox"
                    checked={includeLineByLine}
                    onChange={(e) => {
                      setIncludeLineByLine(e.target.checked);
                      setPreset("custom");
                    }}
                    className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-gray-900 cursor-pointer"
                  />
                </label>

                {/* Toggle 3: Exam Tips & Formulas */}
                <label className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40 hover:bg-gray-800 cursor-pointer transition-colors text-xs">
                  <span className="text-gray-200">Exam Tips & Formula Boxes</span>
                  <input
                    type="checkbox"
                    checked={includeExamTips}
                    onChange={(e) => {
                      setIncludeExamTips(e.target.checked);
                      setPreset("custom");
                    }}
                    className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-gray-900 cursor-pointer"
                  />
                </label>

                {/* Toggle 4: Glossary */}
                <label className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40 hover:bg-gray-800 cursor-pointer transition-colors text-xs">
                  <span className="text-gray-200">
                    Technical Glossary ({glossary?.length || 0} terms)
                  </span>
                  <input
                    type="checkbox"
                    checked={includeGlossary}
                    onChange={(e) => {
                      setIncludeGlossary(e.target.checked);
                      setPreset("custom");
                    }}
                    className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-gray-900 cursor-pointer"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => generateAndDownloadPDF()}
                  disabled={isGenerating || (!includeNotes && !includeLineByLine && !includeGlossary)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>
                    {isGenerating ? "Compiling PDF Document..." : "Download Configured PDF"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleBrowserPrint}
                  disabled={isGenerating}
                  className="w-full py-2 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white font-medium text-xs flex items-center justify-center gap-2 border border-gray-700 transition-colors cursor-pointer"
                  title="Opens clean white-paper print dialog (perfect for saving as PDF without dark ink)"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-400" />
                  <span>Print / Save as PDF (Clean White Paper)</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
