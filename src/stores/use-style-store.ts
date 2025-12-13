import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CSSProperties } from "react";

interface StyleState {
  // map component ID (e.g. 'main', 'chat') to style object
  componentStyles: Record<string, CSSProperties>;
}

interface StyleActions {
  updateStyle: (component: string, newStyles: CSSProperties) => void;
  resetStyles: () => void;
}

export const useStyleStore = create<StyleState & StyleActions>()(
  persist(
    (set) => ({
      componentStyles: {},

      updateStyle: (component, newStyles) =>
        set((state) => {
          const current = state.componentStyles[component] || {};
          return {
            componentStyles: {
              ...state.componentStyles,
              [component]: { ...current, ...newStyles },
            },
          };
        }),

      resetStyles: () => set({ componentStyles: {} }),
    }),
    {
      name: "style-storage",
    }
  )
);
