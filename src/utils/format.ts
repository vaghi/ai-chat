/**
 * Format AI message text for display in plain text UI.
 * - Converts Markdown-like bullets (-, *) to • bullets
 * - Removes bold/italic markers (**, *) while preserving content
 * - Normalizes newlines
 */
export function formatAiMessage(input: string): string {
  if (!input) return "";

  let text = input.replace(/\r\n/g, "\n");

  // Remove bold (**text**) and italic (*text*) markers while keeping content
  text = text.replace(/\*\*(.+?)\*\*/g, "$1");
  text = text.replace(
    /(^|[^*])\*(?!\*)([^*]+)\*(?!\*)/g,
    (_m, p1, p2) => `${p1}${p2}`
  );

  // Split into lines and normalize bullet points
  const lines = text.split(/\n/).map((line) => {
    const trimmed = line.trim();
    // Convert markdown bullets to dot bullets
    if (/^[-*]\s+/.test(trimmed)) {
      return `• ${trimmed.replace(/^[-*]\s+/, "")}`;
    }
    // Convert numbered lists to dot bullets
    if (/^\d+\.\s+/.test(trimmed)) {
      return `• ${trimmed.replace(/^\d+\.\s+/, "")}`;
    }
    return line;
  });

  // Collapse excessive blank lines (max 2 in a row)
  const collapsed = lines.join("\n").replace(/\n{3,}/g, "\n\n");

  return collapsed.trim();
}

/**
 * Convert AI message to basic-safe HTML while preserving emphasis and line breaks.
 * - Escapes HTML first
 * - Converts **bold** -> <strong>, *italic* -> <em>
 * - Normalizes bullets and numbered lists to •
 * - Converts newlines to <br/>
 */
export function formatAiMessageHtml(input: string): string {
  if (!input) return "";

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  let text = input.replace(/\r\n/g, "\n");
  text = escapeHtml(text);

  // Bold: **text** -> <strong>text</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic: single *text* (avoid matching already converted strong)
  text = text.replace(
    /(^|[^*])\*(?!\*)([^*]+)\*(?!\*)/g,
    (_m, p1, p2) => `${p1}<em>${p2}</em>`
  );

  // Normalize bullets per line
  const lines = text.split(/\n/).map((line) => {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed)) {
      return `• ${trimmed.replace(/^[-*]\s+/, "")}`;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      return `• ${trimmed.replace(/^\d+\.\s+/, "")}`;
    }
    return line;
  });

  // Collapse excessive blank lines (max 2)
  const collapsed = lines.join("\n").replace(/\n{3,}/g, "\n\n");

  // Convert newlines to <br/>
  return collapsed.replace(/\n/g, "<br/>");
}
