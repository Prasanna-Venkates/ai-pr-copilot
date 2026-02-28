import { useState, useMemo } from "react";
import { useAIStore } from "../../store/ai.store";

function getStatusColor(status: string) {
  if (status === "error") return "#ef4444";
  if (status === "warning") return "#facc15";
  return "#22c55e";
}

function formatLanguage(lang: string) {
  switch (lang) {
    case "typescript":
      return "TypeScript";
    case "javascript":
      return "JavaScript";
    case "python":
      return "Python";
    case "java":
      return "Java";
    case "cpp":
      return "C++";
    case "go":
      return "Go";
    default:
      return lang;
  }
}

export default function HistoryPanel() {
  const {
    history,
    loadHistoryItem,
    deleteHistoryItem,
    clearHistory,
    activeId,
  } = useAIStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "clean">(
    "all"
  );

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [history, search, filter]);

  const handleExport = () => {
    if (!history.length) return;

    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-review-history-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!history.length) {
    return (
      <div style={{ padding: 16, color: "#6b7280", fontSize: 14 }}>
        No history yet
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      
      {/* Header Controls */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #1f2937",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #1f2937",
            background: "#0f1623",
            color: "white",
            fontSize: 13,
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "all" | "error" | "warning" | "clean"
              )
            }
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              background: "#0f1623",
              color: "white",
              border: "1px solid #1f2937",
              fontSize: 12,
            }}
          >
            <option value="all">All</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="clean">Clean</option>
          </select>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleExport}
              style={{
                fontSize: 12,
                background: "#2563eb",
                color: "white",
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Export
            </button>

            <button
              onClick={clearHistory}
              style={{
                fontSize: 12,
                background: "#dc2626",
                color: "white",
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
        {filteredHistory.length === 0 && (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            No matching results
          </div>
        )}

        {filteredHistory.map((item) => {
          const isActive = activeId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => loadHistoryItem(item)}
              style={{
                marginBottom: 10,
                padding: 12,
                borderRadius: 8,
                background: isActive ? "#1f2937" : "#0f1623",
                border: "1px solid #1f2937",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1f2937")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = isActive
                  ? "#1f2937"
                  : "#0f1623")
              }
            >
              {/* Status Bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                  background: getStatusColor(item.status),
                }}
              />

              <div
                style={{
                  marginLeft: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  {/* Title + Language */}
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "white",
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {item.title}

                    {/* 🏷 Language Badge */}
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: "#111827",
                        border: "1px solid #374151",
                        color: "#9ca3af",
                      }}
                    >
                      {formatLanguage(item.language)}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHistoryItem(item.id);
                  }}
                  style={{
                    fontSize: 12,
                    color: "#f87171",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}