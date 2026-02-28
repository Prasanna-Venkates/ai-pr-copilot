import { useRef, useState, useEffect } from "react";
import CodeEditor from "./features/editor/CodeEditor";
import { useAIStore } from "./store/ai.store";
import ReviewBar from "./features/prompt-panel/ReviewBar";
import AIReviewPanel from "./features/ai-review/AIReviewPanel";
import HistoryPanel from "./features/history/HistoryPanel";

export default function App() {
  const { code, setCode } = useAIStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(340);

  const [isMobile, setIsMobile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDragLeft = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const move = (ev: MouseEvent) => {
      const newWidth = startWidth + (ev.clientX - startX);
      setLeftWidth(Math.max(200, newWidth));
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const startDragRight = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;

    const move = (ev: MouseEvent) => {
      const newWidth = startWidth - (ev.clientX - startX);
      setRightWidth(Math.max(260, newWidth));
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "#0d1117",
        color: "white",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "18px 28px",
          borderBottom: "1px solid #1f2937",
          background: "linear-gradient(to right, #0d1117, #0b1220)",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          AI PR Copilot
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginTop: 6,
            maxWidth: 760,
            lineHeight: 1.6,
          }}
        >
          Frontend-first AI code review platform prototype designed to demonstrate
          scalable architecture, multi-language analysis workflow, and modular state
          management. Built with a backend-ready structure prepared for real LLM API
          integration and production deployment.
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            marginTop: 8,
            opacity: 0.9,
          }}
        >
          ⚡ Note: AI engine is currently simulated for demonstration purposes.
          Architecture supports seamless integration with real AI APIs (OpenAI,
          Claude, Gemini, etc.).
        </div>

        {isMobile && (
          <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
            <button
              onClick={() => setShowHistory(true)}
              style={mobilePrimaryButton}
            >
              📜 History
            </button>

            <button
              onClick={() => setShowReview(true)}
              style={mobileSecondaryButton}
            >
              🤖 AI Review
            </button>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {!isMobile && (
          <>
            <div
              style={{ width: leftWidth }}
              className="h-full border-r border-gray-800 flex flex-col"
            >
              <div className="p-4 font-semibold border-b border-gray-800">
                History
              </div>
              <HistoryPanel />
            </div>

            <div
              onMouseDown={startDragLeft}
              style={{
                width: 4,
                cursor: "col-resize",
                background: "#1f2937",
              }}
            />
          </>
        )}

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ReviewBar />
          <div style={{ flex: 1, minHeight: 0 }}>
            <CodeEditor code={code} setCode={setCode} />
          </div>
        </div>

        {!isMobile && (
          <>
            <div
              onMouseDown={startDragRight}
              style={{
                width: 4,
                cursor: "col-resize",
                background: "#1f2937",
              }}
            />

            <div
              style={{ width: rightWidth }}
              className="h-full border-l border-gray-800 flex flex-col"
            >
              <div className="p-4 font-semibold border-b border-gray-800">
                AI Review
              </div>
              <AIReviewPanel />
            </div>
          </>
        )}

        {isMobile && showHistory && (
          <Drawer title="📜 History" onClose={() => setShowHistory(false)}>
            <HistoryPanel />
          </Drawer>
        )}

        {isMobile && showReview && (
          <Drawer title="🤖 AI Review" onClose={() => setShowReview(false)}>
            <AIReviewPanel />
          </Drawer>
        )}
      </div>
    </div>
  );
}

/* Drawer */

function Drawer({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "85%",
          maxWidth: 420,
          background: "#0f1623",
          height: "100%",
          borderLeft: "1px solid #1f2937",
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 600 }}>{title}</div>

          <button
            onClick={onClose}
            style={closeButtonStyle}
          >
            ✕ Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* Styles */

const mobilePrimaryButton: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "1px solid #2563eb",
  background: "linear-gradient(to right, #2563eb, #1d4ed8)",
  color: "#ffffff",
  fontWeight: 500,
  cursor: "pointer",
};

const mobileSecondaryButton: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "1px solid #1f2937",
  background: "#1f2937",
  color: "#ffffff",
  fontWeight: 500,
  cursor: "pointer",
};

const closeButtonStyle: React.CSSProperties = {
  background: "#1f2937",
  border: "1px solid #374151",
  padding: "6px 12px",
  borderRadius: 8,
  cursor: "pointer",
  color: "#ffffff",
  fontSize: 13,
};