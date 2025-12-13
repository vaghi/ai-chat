import styles from "./styles.module.scss";
import ChatContainer from "./components/chat/chat.container";
import ConfigMenuContainer from "./components/config-menu/config-menu.container";
import { useThemeInitializer } from "./hooks/use-theme-initializer";
import { useStyleStore } from "./stores/use-style-store";

function App() {
  useThemeInitializer();
  const componentStyles = useStyleStore((state) => state.componentStyles);

  return (
    <div className={styles.appContainer} style={componentStyles["main"]}>
      <h1 style={componentStyles["title"]}>AI Chat CV</h1>
      <ChatContainer />
      <ConfigMenuContainer />
    </div>
  );
}

export default App;
