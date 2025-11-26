// src/stores/use-chat-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiError, ChatService } from "../network";
import { formatAiMessageHtml } from "../utils/format";
import { ChatHistoryItem, MessageSender } from "../types/types";
import { handleActionResponse } from "../utils/handle-action-response";
import { useThemeStore } from "./use-theme-store";

interface ChatState {
  chatHistory: ChatHistoryItem[];
  isLoading: boolean;
  error: ApiError | null;
}

interface ChatActions {
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
  clearChatHistory: () => void;
  setHistory: (history: ChatHistoryItem[]) => void;
}

type ChatStore = ChatState & ChatActions;

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
      sendMessage: async (prompt: string) => {
        set({ isLoading: true, error: null });

        // Optimistic update
        const userMsg = buildNewEntry(prompt, MessageSender.USER);
        set((state) => ({
          chatHistory: [...state.chatHistory, userMsg],
        }));

        try {
          const resp = await ChatService.sendMessage(prompt);

          // Handle side-effects (theme, clear chat, etc.)
          // We pass callbacks to avoid circular dependency in handleActionResponse
          const { uiMessage } = handleActionResponse(resp, {
            toggleTheme: () => useThemeStore.getState().toggleTheme(),
            clearChat: () => get().clearChatHistory(),
          });

          if (uiMessage) {
            const botMsg = buildNewEntry(
              formatAiMessageHtml(uiMessage),
              MessageSender.AGENT
            );
            set((state) => ({
              chatHistory: [...state.chatHistory, botMsg],
            }));
          }
        } catch (err: any) {
          set({ error: err.message || "Failed to send message" });
        } finally {
          set({ isLoading: false });
        }
      },

      clearChatHistory: () => set({ chatHistory: [] }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ chatHistory: state.chatHistory }),
    }
  )
);
