import { useState } from "react";
import { Chat } from "./chat";
import { useChatStore } from "../../stores/use-chat-store";

const ChatContainer = () => {
  const [inputValue, setInputValue] = useState("");
  const { chatHistory, isLoading, error, sendMessage, clearError } =
    useChatStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    if (message.trim()) {
      try {
        await sendMessage(message);

        e.currentTarget?.reset();
      } catch (err) {
        console.error("Failed to send message:", err);
      }

      setInputValue("");
    }
  };

  const handleOnChangeInput = (value: string) => {
    setInputValue(value);
    if (error) {
      clearError();
    }
  };

  return (
    <Chat
      onSubmit={handleSubmit}
      onChangeInput={handleOnChangeInput}
      inputValue={inputValue}
      chatHistory={chatHistory}
      showChatHistory={!!chatHistory.length}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default ChatContainer;
