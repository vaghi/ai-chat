// src/network/types.ts
// API types + endpoints. Extended to the new action/subaction contract.



export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001", // ✅ works in browser
  ENDPOINTS: {
    CHAT: "/api/chat",
  },
};

export interface ChatRequest {
  prompt: string;
}

// The backend now returns a structured response with meta.
export interface ChatResponse {
  reply: string;
  meta: {
    intent: string;
    subAction?: string | null;
    confidence: number;
    used_two_stage: boolean;
    timestamp: string;
  };
}

export interface ApiError {
  error: string;
  details?: string;
}
