// src/utils/cache.ts
// Side-effect helpers for clearing persisted state safely.

export const PERSIST_KEYS = {
  CHAT: "chat-storage",
  THEME: "app-theme-storage",
};

export function clearPersistedState(options?: { hardReload?: boolean }) {
  try {
    localStorage.removeItem(PERSIST_KEYS.CHAT);
    localStorage.removeItem(PERSIST_KEYS.THEME);
  } catch {
    /* no-op */
  }

  if (options?.hardReload) {
    window.location.reload();
  }
}
