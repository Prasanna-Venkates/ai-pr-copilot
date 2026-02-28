import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { useAIStore } from "../../store/ai.store";

interface Props {
  code: string;
  setCode: (v: string) => void;
}

export default function CodeEditor({ code, setCode }: Props) {
  const { language } = useAIStore();

  const handleMount: OnMount = (editor, monaco) => {
    setTimeout(() => {
      editor.layout();
      editor.focus();
    }, 0);

    // Disable TypeScript validation for non-TS languages
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: language !== "typescript",
      noSyntaxValidation: language !== "typescript",
    });
  };

  const mapLanguage = (lang: string) => {
    switch (lang) {
      case "typescript":
        return "typescript";
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      case "go":
        return "go";
      default:
        return "plaintext";
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language={mapLanguage(language)}
        value={code}
        theme="vs-dark"
        onMount={handleMount}
        onChange={(v) => setCode(v || "")}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}