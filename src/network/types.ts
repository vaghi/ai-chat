// API Request/Response Types
export interface ChatRequest {
  prompt: string;
}

export interface ChatResponse {
  reply: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://localhost:3001",
  ENDPOINTS: {
    CHAT: "/api/chat",
    HEALTH: "/health",
  },
} as const;

// HTTP Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  isLoading: boolean;
}
