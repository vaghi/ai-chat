// src/network/ChatService.ts
import { apiClient } from "./api";
import { API_CONFIG } from "./types";
import type { ChatRequest, ChatResponse, ApiError } from "./types";

export class ChatService {
  static async sendMessage(prompt: string): Promise<ChatResponse> {
    try {
      const request: ChatRequest = { prompt };
      const response = await apiClient.post<ChatResponse>(
        API_CONFIG.ENDPOINTS.CHAT,
        request
      );
      return response;
    } catch (error) {
      const apiError: ApiError = {
        error: "Failed to send message",
        details: error instanceof Error ? error.message : "Unknown error",
      };
      throw apiError;
    }
  }
}

export default ChatService;
