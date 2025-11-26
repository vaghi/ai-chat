import { useEffect } from "react";
import { useThemeStore } from "../stores/use-theme-store";
import styles from "@styles/variables.module.scss";

export const useThemeInitializer = () => {
  const { theme, initializeTheme } = useThemeStore();

  useEffect(() => {
    // 1. Check localStorage manually on initial mount (needed for quick SSR/hydration fix)
    const storedTheme = localStorage.getItem("app-theme-storage");
    if (storedTheme) {
      try {
        const parsed = JSON.parse(storedTheme);
        const savedTheme = parsed.state.theme;
        // 2. Set the Zustand store state based on localStorage
        initializeTheme(savedTheme);
      } catch (e) {
        console.error("Could not parse stored theme:", e);
      }
    }
  }, [initializeTheme]);

  // 3. Sync the class name to the root HTML element whenever the store's theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(styles.light, styles.dark);
    const themeClassname = theme === styles.light ? styles.light : styles.dark;
    root.classList.add(themeClassname);
  }, [theme]);

  return { theme };
};
