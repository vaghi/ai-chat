import { useState, useCallback } from "react";
import { MessageSender, type ChatHistoryItem } from "./types";
import { ChatService } from "../network";
import { formatAiMessageHtml } from "../utils/format";
import type { ApiError } from "../network/types";

interface UseChatHistoryReturn {
  chatHistory: ChatHistoryItem[];
  isLoading: boolean;
  error: ApiError | null;
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
}

export const useChatHistory = (): UseChatHistoryReturn => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const buildNewEntry = (
    value: string,
    source: MessageSender
  ): ChatHistoryItem => {
    return {
      value,
      id: crypto.randomUUID(),
      source,
    };
  };

  const updateChatHistory = useCallback(
    (value: string, source: MessageSender) => {
      const newEntry = buildNewEntry(value, source);
      setChatHistory((prev) => [...prev, newEntry]);
    },
    []
  );

  const sendMessage = useCallback(
    async (message: string): Promise<void> => {
      if (!message.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Add user message to chat history
        updateChatHistory(message, MessageSender.USER);

        // Send message to API
        const response = await ChatService.sendMessage(message);

        // Add AI response to chat history (HTML formatted)
        updateChatHistory(
          formatAiMessageHtml(response.reply),
          MessageSender.AGENT
        );
      } catch (err) {
        const apiError: ApiError = err as ApiError;
        setError(apiError);

        // Optionally add error message to chat history
        updateChatHistory(
          `Sorry, I encountered an error: ${apiError.error}`,
          MessageSender.AGENT
        );
      } finally {
        setIsLoading(false);
      }
    },
    [updateChatHistory]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    chatHistory,
    isLoading,
    error,
    sendMessage,
    clearError,
  };
};
