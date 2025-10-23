import styles from "./styles.module.scss";
import ChatContainer from "./components/chat/chat.container";
import ConfigMenuContainer from "./components/config-menu/config-menu.container";

function App() {
  return (
    <div className={styles.appContainer}>
      <h1>AI Chat CV</h1>
      <ChatContainer />
      <ConfigMenuContainer />
    </div>
  );
}

export default App;
