export interface LineByLineNote {
  timestamp: string; // e.g. "00:00", "02:15"
  seconds: number; // e.g. 0, 135
  title: string; // Topic or line heading
  detailedExplanation: string; // Deep line-by-line pedagogical breakdown
  speakerVerbatim?: string; // What instructor explains in this exact segment
  keyFormulaOrRule?: string; // Formula, theorem, syntax or key rule
  examTakeaway?: string; // Important exam alert or test question tip
}

export interface GlossaryItem {
  term: string;
  definition: string;
  timestamp?: string;
}

export interface FlashcardItem {
  question: string;
  answer: string;
  timestamp?: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  timestamp?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  author: string;
  category: "Computer Science" | "AI & Machine Learning" | "Mathematics" | "Physics" | "Engineering" | "General";
  date: string;
  timestamp: number;
  videoUrl?: string;
  videoId?: string;
  thumbnailUrl?: string;
  summary: string;
  lineByLineNotes?: LineByLineNote[];
  glossary?: GlossaryItem[];
  flashcards?: FlashcardItem[];
  quiz?: QuizItem[];
  readTimeMinutes: number;
  isFavorite?: boolean;
  tags: string[];
  keyTakeaways?: string[];
}
