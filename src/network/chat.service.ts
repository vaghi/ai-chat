import { apiClient } from "./api";
import { API_CONFIG } from "./types";
import type { ChatRequest, ChatResponse, ApiError } from "./types";

/**
 * Chat API service
 */
export class ChatService {
  /**
   * Send a message to the chat API
   */
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

  /**
   * Check if the API is healthy
   */
  static async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      return await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH);
    } catch (error) {
      const apiError: ApiError = {
        error: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      };
      throw apiError;
    }
  }
}

export default ChatService;
