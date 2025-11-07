import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ThemeState } from "../types/types";
import styles from "../styles/variables.module.scss";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: styles.light,

      initializeTheme: (initialTheme) => set({ theme: initialTheme }),

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === styles.light ? styles.dark : styles.light,
        }));
      },
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
