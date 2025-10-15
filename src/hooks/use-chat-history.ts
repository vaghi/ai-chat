import { useState } from "react";
import type { ChatHistoryItem, MessageSender } from "./types";

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

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

  const updateChatHistory = (value: string, source: MessageSender) => {
    const newEntry = buildNewEntry(value, source);
    setChatHistory((prev) => [...prev, newEntry]);
  };

  return {
    chatHistory,
    updateChatHistory,
  };
};
