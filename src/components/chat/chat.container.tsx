import { useState } from "react";
import { Chat } from "./chat";
import { useChatHistory } from "../../hooks/use-chat-history";

const ChatContainer = () => {
  const [inputValue, setInputValue] = useState("");
  const { chatHistory, isLoading, error, sendMessage, clearError } =
    useChatHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    if (message.trim()) {
      try {
        // Send message to API (handles adding to chat history internally)
        await sendMessage(message);

        // Clear form after successful submission
        e.currentTarget.reset();
      } catch (err) {
        console.error("Failed to send message:", err);
        // Error handling is done in the hook
      }

      setInputValue("");
    }
  };

  const handleOnChangeInput = (value: string) => {
    setInputValue(value);
    // Clear any existing errors when user starts typing
    if (error) {
      clearError();
    }
  };

  return (
    <div>
      <Chat
        onSubmit={handleSubmit}
        onChangeInput={handleOnChangeInput}
        inputValue={inputValue}
        chatHistory={chatHistory}
        showChatHistory={!!chatHistory.length}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default ChatContainer;
