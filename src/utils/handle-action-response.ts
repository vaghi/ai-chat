// src/utils/handle-action-response.ts
// Single place to interpret ActionResponse and trigger UI side-effects.
// Uses Zustand stores via .getState()/.setState() so it's usable anywhere.

import { SubActionType } from "../types/action-types";
import { ChatResponse } from "../network/types";
import { clearPersistedState } from "./cache";
import { useStyleStore } from "../stores/use-style-store";

// Return value used by the caller to optionally append a message to chat.
export interface HandleResult {
  uiMessage?: string; // formatted/ready-to-display text (if any)
}

export interface ActionCallbacks {
  toggleTheme: () => void;
  clearChat: () => void;
}

export function handleActionResponse(
  resp: ChatResponse,
  actions: ActionCallbacks
): HandleResult {
  if (!resp || !resp.meta) return { uiMessage: resp?.reply || "" };

  const { intent, subAction } = resp.meta;

  if (intent === "UI_COMMAND" && subAction) {
    // Run side-effects
    switch (subAction) {
      case SubActionType.THEME_TOGGLE: {
        actions.toggleTheme();
        break;
      }

      case SubActionType.CLEAR_CHAT: {
        setTimeout(() => {
          actions.clearChat();
        }, 3000);
        break;
      }

      case SubActionType.CLEAR_CACHE: {
        // Also clear in-memory chat so UI reflects immediately
        setTimeout(() => {
          clearPersistedState({ hardReload: false });
          actions.clearChat();
        }, 3000);
        break;
      }

      case SubActionType.STYLE_CHANGE: {
        if (resp.meta.payload) {
          const { component, styles } = resp.meta.payload;
          if (component && styles) {
            useStyleStore.getState().updateStyle(component, styles);
          }
        }
        break;
      }

      case SubActionType.STYLE_RESET: {
        useStyleStore.getState().resetStyles();
        break;
      }

      default:
        console.warn("Unknown subAction:", subAction);
    }
  }

  // Always return the reply message to be displayed
  return { uiMessage: resp.reply };
}
