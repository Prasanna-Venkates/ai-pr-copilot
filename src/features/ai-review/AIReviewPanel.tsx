import { useState } from "react";
import { useAIStore } from "../../store/ai.store";

export default function AIReviewPanel() {
  const { result, loading } = useAIStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const renderFormattedResult = () => {
    if (!result) return null;

    const lines = result.split("\n").filter(Boolean);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lines.map((line, index) => {
          const trimmed = line.trim();

          if (trimmed.toLowerCase().includes("ai review")) {
            return (
              <div
                key={index}
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "white",
                }}
              >
                {trimmed}
              </div>
            );
          }

          if (trimmed.startsWith("•")) {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: 8,
                  color: "#d1d5db",
                }}
              >
                <span style={{ color: "#60a5fa" }}>•</span>
                <span>{trimmed.replace("•", "").trim()}</span>
              </div>
            );
          }

          return (
            <div key={index} style={{ color: "#9ca3af", marginTop: 6 }}>
              {trimmed}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        padding: 16,
        fontSize: 14,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* 📋 Copy Button */}
      {!loading && result && (
        <button
          onClick={handleCopy}
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #1f2937",
            background: copied ? "#16a34a" : "#0f1623",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              height: 16,
              width: "60%",
              background: "#1f2937",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              height: 14,
              width: "80%",
              background: "#1f2937",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              height: 14,
              width: "70%",
              background: "#1f2937",
              borderRadius: 4,
            }}
          />
          <div style={{ marginTop: 10, color: "#9ca3af" }}>
            AI is analyzing your code...
          </div>
        </div>
      )}

      {!loading && !result && (
        <div style={{ color: "#6b7280" }}>
          AI output will appear here
        </div>
      )}

      {!loading && result && (
        <div style={{ marginTop: 28 }}>{renderFormattedResult()}</div>
      )}
    </div>
  );
}