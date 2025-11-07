export const CHAT_HISTORY_STORAGE_KEY = "chatHistory";

export enum MessageSender {
  USER = "user",
  AGENT = "agent",
}

export interface ChatHistoryItem {
  id: string;
  value: string;
  source: MessageSender;
}

export interface ThemeState {
  theme: string;
  toggleTheme: () => void;
  // Initialize function to pull state from persistence before mount
  initializeTheme: (initialTheme: string) => void;
}
