import { FC } from "react";
import { useThemeStore } from "../../hooks/use-theme-store";
import Sun from "@assets/icons/sun.svg";
import Moon from "@assets/icons/moon.svg";
import IconButton from "../icon-button";

const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  const Icon = theme.includes("dark") ? Moon : Sun;

  return <IconButton icon={Icon} onClick={toggleTheme} size={"small"} />;
};

export default ThemeToggle;
