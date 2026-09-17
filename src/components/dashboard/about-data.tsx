import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import { QuizItem } from "@/types/library";

interface AboutSummarySectionProps {
  quiz?: QuizItem[];
  videoTitle?: string;
  onSeekToTimestamp?: (seconds: number, timestamp: string) => void;
}

interface MCQ {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  timestamp?: string;
}

const DEFAULT_MCQS: MCQ[] = [
  {
    question: "Which time complexity corresponds to an optimal comparison-based sorting algorithm?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    answer: 2,
    explanation: "Algorithms like MergeSort and HeapSort achieve the theoretical optimal lower bound of O(n log n) comparisons.",
    timestamp: "08:40",
  },
  {
    question: "What is the primary advantage of arrays over linked lists regarding hardware architecture?",
    options: [
      "Dynamic memory sizing without limits",
      "Superior CPU cache locality and contiguous memory",
      "O(1) insertion at arbitrary positions",
      "Lower constant factor on string manipulation",
    ],
    answer: 1,
    explanation: "Contiguous array elements leverage processor cache lines efficiently, whereas linked lists incur cache misses jumping pointer locations.",
    timestamp: "03:15",
  },
  {
    question: "Which activation function was specifically introduced to mitigate the vanishing gradient problem?",
    options: ["Sigmoid", "Tanh", "ReLU", "Softmax"],
    answer: 2,
    explanation: "ReLU has a constant derivative of 1 for all positive inputs, allowing deep networks to train without gradients decaying to 0.",
    timestamp: "02:45",
  },
];

export default function AboutSummarySection({
  quiz,
  videoTitle,
  onSeekToTimestamp,
}: AboutSummarySectionProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Map incoming quiz items if provided
  const activeQuestions: MCQ[] =
    quiz && quiz.length > 0
      ? quiz.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          timestamp: q.timestamp,
        }))
      : DEFAULT_MCQS;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    return activeQuestions.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.answer ? 1 : 0);
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Video Sync Highlights */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800 rounded-2xl p-5 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Line-by-Line Study Engine</h3>
            <p className="text-xs text-gray-400">NexusEDU synchronized features</p>
          </div>
        </div>

        <ul className="space-y-2.5 text-xs text-gray-300">
          <li className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>Interactive timeline markers linked to YouTube video playback.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Spoken instructor takeaways, verbatim quotes & formulas.</span>
          </li>
          <li className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>Multi-page PDF export containing both textbook notes & timeline.</span>
          </li>
        </ul>
      </div>

      {/* MCQ / Practice Quiz Section */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800 rounded-2xl p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Lecture Practice Quiz</h3>
              <p className="text-xs text-gray-400">{activeQuestions.length} Active Recall Questions</p>
            </div>
          </div>

          {showQuiz && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        {!showQuiz ? (
          <div className="space-y-3">
            <p className="text-gray-400 text-xs leading-relaxed">
              Test your knowledge with automated comprehension questions extracted from these lecture notes.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowQuiz(true)}
              className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              Start Practice Quiz
            </motion.button>
          </div>
        ) : (
          <div className="space-y-5">
            {activeQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div key={qIdx} className="space-y-2 text-xs border-b border-gray-800/80 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-medium">
                      <span className="text-cyan-400 mr-1 font-bold">Q{qIdx + 1}.</span>
                      {q.question}
                    </p>

                    {q.timestamp && onSeekToTimestamp && (
                      <button
                        type="button"
                        onClick={() => {
                          const parts = q.timestamp!.split(":").map(Number);
                          const sec = parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
                          onSeekToTimestamp(sec, q.timestamp!);
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Jump video to explanation"
                      >
                        <Play className="w-2.5 h-2.5 fill-cyan-400" />
                        {q.timestamp}
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10";

                      if (selectedOpt === optIdx) {
                        btnStyle = "bg-cyan-500/20 border-cyan-500/50 text-cyan-200";
                      }

                      if (submitted) {
                        if (optIdx === q.answer) {
                          btnStyle = "bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold";
                        } else if (selectedOpt === optIdx && selectedOpt !== q.answer) {
                          btnStyle = "bg-rose-500/20 border-rose-500/60 text-rose-200";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submitted && optIdx === q.answer && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          {submitted && selectedOpt === optIdx && selectedOpt !== q.answer && (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="p-2 rounded bg-black/40 border border-gray-800 text-[11px] text-gray-400">
                      <span className="font-semibold text-gray-300">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!submitted ? (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 disabled:opacity-50 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Submit Answers ({Object.keys(selectedAnswers).length}/{activeQuestions.length})
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-1">
                <p className="text-xs font-bold text-emerald-300">
                  Your Score: {calculateScore()} / {activeQuestions.length} (
                  {Math.round((calculateScore() / activeQuestions.length) * 100)}%)
                </p>
                <p className="text-[11px] text-gray-400">
                  {calculateScore() === activeQuestions.length
                    ? "Exceptional mastery! Full recall verified."
                    : "Good effort! Review the flagged video timestamps to reinforce concepts."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
