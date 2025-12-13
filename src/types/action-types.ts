// src/types/action-types.ts
// Central, type-safe contract that mirrors the backend response shape.
// Keep this file tiny and reusable across app layers.

export enum ActionType {
  RESPONSE = "response",
  UI = "ui",
  ERROR = "error",
}

export enum SubActionType {
  THEME_TOGGLE = "theme.toggle",
  CLEAR_CACHE = "cache.clear",
  CLEAR_CHAT = "chat.clear",
  STYLE_CHANGE = "style.change",
  STYLE_RESET = "style.reset",

  // Add future UI ops here...
  // e.g., OPEN_MODAL = "modal.open",
}

export type ActionData = { text?: string } | Record<string, unknown>;

export interface ActionResponse {
  action: ActionType;
  subAction?: SubActionType;
  data?: ActionData;
}
