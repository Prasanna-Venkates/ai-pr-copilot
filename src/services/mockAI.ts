import type { SupportedLanguage } from "../store/ai.store";

export async function reviewCode(
  code: string,
  language: SupportedLanguage
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!code.trim()) {
        resolve("Error: No code provided.");
        return;
      }

      const lower = code.toLowerCase();

      /* ---------------- STRONG LANGUAGE SIGNATURES ---------------- */

      const strongSignatures: Record<SupportedLanguage, RegExp[]> = {
        python: [/^\s*def\s+\w+/m],
        java: [/public\s+class/, /public\s+static\s+void\s+main/],
        javascript: [/console\.log/, /function\s+\w+/, /=>/],
        typescript: [/: \w+/, /interface\s+\w+/, /type\s+\w+/],
        cpp: [/#include/, /std::/, /int\s+main/],
        go: [/package\s+main/, /func\s+\w+/],
      };

      /* ---------------- MISMATCH CHECK ---------------- */

      for (const [lang, patterns] of Object.entries(strongSignatures)) {
        if (lang === language) continue;

        for (const pattern of patterns) {
          if (pattern.test(code)) {
            resolve(`
AI Review:

• Language mismatch detected
• Code appears to be ${lang}, but selected language is ${language}

Severity: High 🔴
            `);
            return;
          }
        }
      }

      /* ---------------- ERROR DETECTION ---------------- */

      if (lower.includes("throw") || lower.includes("division by zero")) {
        resolve(`
AI Review:

• Runtime error risk detected
• Add proper error handling

Severity: High 🔴
        `);
        return;
      }

      /* ---------------- WARNING ---------------- */

      if (lower.includes("any") || lower.includes("var ")) {
        resolve(`
AI Review:

• Improve type safety
• Consider stricter typing

Severity: Medium 🟡
        `);
        return;
      }

      /* ---------------- CLEAN ---------------- */

      resolve(`
AI Review:

• Looks valid for ${language}
• No major issues detected

Severity: Low 🟢
      `);
    }, 800);
  });
}