import { useAIStore } from "../../store/ai.store";
import type { SupportedLanguage } from "../../store/ai.store";
import { reviewCode } from "../../services/mockAI";

const LANGUAGES: { id: SupportedLanguage; label: string; icon: string }[] = [
  { id: "typescript", label: "TypeScript", icon: "🔷" },
  { id: "javascript", label: "JavaScript", icon: "🟨" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "cpp", label: "C++", icon: "⚙️" },
  { id: "go", label: "Go", icon: "🧠" },
];

export default function ReviewBar() {
  const {
    code,
    setResult,
    setLoading,
    loading,
    addHistoryFromReview,
    setCode,
    language,
    setLanguage,
  } = useAIStore();

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    const res = await reviewCode(code, language);
    setResult(res);
    addHistoryFromReview(code, res, language);
    setLoading(false);
  };

  const handleClear = () => {
    setCode("");
    setResult("");
  };

  return (
    <div
      style={{
        borderBottom: "1px solid #1f2937",
        background: "#0d1117",
        padding: "20px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* LANGUAGE SELECTOR */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {LANGUAGES.map((lang) => {
          const active = language === lang.id;

          return (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 12,
                border: active
                  ? "1px solid #3b82f6"
                  : "1px solid #374151",
                background: active ? "#1e3a8a" : "#111827",
                color: "white",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
                boxShadow: active
                  ? "0 0 0 2px rgba(59,130,246,0.3)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#1f2937";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#111827";
                  e.currentTarget.style.transform = "translateY(0px)";
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{lang.icon}</span>
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: 16 }}>
        <button
          onClick={handleReview}
          disabled={loading}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            padding: "10px 24px",
            borderRadius: 12,
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            color: "white",
            background:
              "linear-gradient(135deg, #2563eb, #4f46e5)",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>

        <button
          onClick={handleClear}
          style={{
            cursor: "pointer",
            padding: "10px 24px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            background: "#1f2937",
            border: "1px solid #374151",
            color: "white",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2d3748";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1f2937";
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}