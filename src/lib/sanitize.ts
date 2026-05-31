const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const MAX_AI_INPUT_CHARS = 60000;

export function sanitizeFilename(fileName: string) {
  return fileName
    .replace(CONTROL_CHARACTERS, "")
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

export function sanitizeExtractedText(text: string) {
  return text
    .replace(CONTROL_CHARACTERS, "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function sanitizeAIInput(text: string) {
  return sanitizeExtractedText(text)
    .replace(/```/g, "' ' '")
    .replace(/<script/gi, "&lt;script")
    .slice(0, MAX_AI_INPUT_CHARS);
}

export function sanitizeUserPrompt(prompt: string) {
  return prompt
    .replace(CONTROL_CHARACTERS, "")
    .replace(/```/g, "' ' '")
    .trim()
    .slice(0, 1200);
}
