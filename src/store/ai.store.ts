import { create } from "zustand";

export type ReviewStatus = "clean" | "warning" | "error";

export type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "java"
  | "cpp"
  | "go";

export interface ReviewItem {
  id: string;
  title: string;
  code: string;
  result: string;
  language: SupportedLanguage;
  status: ReviewStatus;
  createdAt: number;
}

interface AIState {
  code: string;
  result: string;
  loading: boolean;
  language: SupportedLanguage;

  history: ReviewItem[];
  activeId: string | null;

  setCode: (code: string) => void;
  setResult: (result: string) => void;
  setLoading: (loading: boolean) => void;
  setLanguage: (lang: SupportedLanguage) => void;

  addHistoryFromReview: (
    code: string,
    result: string,
    language: SupportedLanguage
  ) => void;

  loadHistoryItem: (item: ReviewItem) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

/* ---------------- Helpers ---------------- */

function generateTitle(code: string, language: SupportedLanguage): string {
  switch (language) {
    case "python": {
      const match = code.match(/def\s+([a-zA-Z0-9_]+)/);
      return match ? match[1] : "Python Review";
    }
    case "java": {
      const match = code.match(/class\s+([a-zA-Z0-9_]+)/);
      return match ? match[1] : "Java Review";
    }
    case "cpp": {
      if (code.includes("main(")) return "main()";
      return "C++ Review";
    }
    case "javascript":
    case "typescript": {
      const match = code.match(/function\s+([a-zA-Z0-9_]+)/);
      return match ? match[1] : "JS Review";
    }
    case "go": {
      const match = code.match(/func\s+([a-zA-Z0-9_]+)/);
      return match ? match[1] : "Go Review";
    }
    default:
      return "Code Review";
  }
}

function detectStatus(result: string): ReviewStatus {
  const lower = result.toLowerCase();

  if (lower.includes("severity: high") || lower.includes("error")) {
    return "error";
  }

  if (lower.includes("severity: medium")) {
    return "warning";
  }

  return "clean";
}

/* -------- Load persisted history -------- */

const persisted = localStorage.getItem("ai-history");
let initialHistory: ReviewItem[] = [];

if (persisted) {
  try {
    const parsed = JSON.parse(persisted);
    initialHistory = parsed.map((item: any) => ({
      ...item,
      language: item.language || "typescript",
    }));
  } catch {
    initialHistory = [];
  }
}

export const useAIStore = create<AIState>((set, get) => ({
  code: "",
  result: "",
  loading: false,
  language: "typescript",

  history: initialHistory,
  activeId: null,

  setCode: (code) => set({ code }),
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setLanguage: (language) => set({ language }),

  addHistoryFromReview: (code, result, language) => {
    const item: ReviewItem = {
      id: crypto.randomUUID(),
      title: generateTitle(code, language), // ✅ FIXED
      code,
      result,
      language,
      status: detectStatus(result),
      createdAt: Date.now(),
    };

    const updated = [item, ...get().history];

    localStorage.setItem("ai-history", JSON.stringify(updated));

    set({
      history: updated,
      activeId: item.id,
    });
  },

  loadHistoryItem: (item) =>
    set({
      code: item.code,
      result: item.result,
      language: item.language,
      activeId: item.id,
    }),

  deleteHistoryItem: (id) => {
    const updated = get().history.filter((h) => h.id !== id);
    localStorage.setItem("ai-history", JSON.stringify(updated));
    set({ history: updated });
  },

  clearHistory: () => {
    localStorage.removeItem("ai-history");
    set({ history: [], activeId: null });
  },
}));