import { create } from "zustand";
import { persist } from "zustand/middleware"; // ⬅️ Use middleware for Local Storage
import { ApiError, ChatService } from "../network";
import { formatAiMessageHtml } from "../utils/format";
import { ChatHistoryItem, MessageSender } from "../types/types";

interface ChatState {
  chatHistory: ChatHistoryItem[];
  isLoading: boolean;
  error: ApiError | null;
}

interface ChatActions {
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
  clearChatHistory: () => void;
  setHistory: (history: ChatHistoryItem[]) => void; // Helper for persist/testing
}

// Combine state and actions into one type
type ChatStore = ChatState & ChatActions;

// Helper function from your original hook (must be defined here or imported)
const buildNewEntry = (
  value: string,
  source: MessageSender
): ChatHistoryItem => ({
  value,
  id: crypto.randomUUID(),
  source,
});

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chatHistory: [],
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),
      setHistory: (history) => set({ chatHistory: history }),

      clearChatHistory: () => {
        set({ chatHistory: [], error: null });
      },

      sendMessage: async (message: string): Promise<void> => {
        if (!message.trim()) return;

        set({ isLoading: true, error: null });

        const updateHistory = (value: string, source: MessageSender) => {
          const newEntry = buildNewEntry(value, source);
          set((state) => ({ chatHistory: [...state.chatHistory, newEntry] }));
        };

        try {
          updateHistory(message, MessageSender.USER);

          const response = await ChatService.sendMessage(message);

          updateHistory(
            formatAiMessageHtml(response.reply),
            MessageSender.AGENT
          );
        } catch (err) {
          const apiError: ApiError = err as ApiError;
          set({ error: apiError });

          updateHistory(
            `Sorry, I encountered an error: ${apiError.error}`,
            MessageSender.AGENT
          );
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "chat-storage",
    }
  )
);
