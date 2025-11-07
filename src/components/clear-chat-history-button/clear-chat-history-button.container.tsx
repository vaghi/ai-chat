import { useChatStore } from "../../stores/use-chat-store";
import { ClearChatHistoryButton } from "./clear-chat-history-button";

const ClearChatHistoryButtonContainer = () => {
  const { clearChatHistory } = useChatStore();

  const handleClearChatHistory = () => {
    clearChatHistory();
  };

  return <ClearChatHistoryButton onClearChatHistory={handleClearChatHistory} />;
};

export default ClearChatHistoryButtonContainer;
