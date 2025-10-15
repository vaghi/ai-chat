import { useState } from "react";
import { Chat } from "./chat";
import { useChatHistory } from "../../hooks/use-chat-history";
import { MessageSender } from "../../hooks/types";

const ChatContainer = () => {
  const [inputValue, setInputValue] = useState("");
  const { chatHistory, updateChatHistory } = useChatHistory();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    updateChatHistory(message, MessageSender.USER);

    if (message.trim()) {
      console.log("Message:", message);
      // TODO: Handle the message (send to API, add to chat, etc.)
      e.currentTarget.reset();
    }
  };

  const handleOnChangeInput = (value: string) => {
    setInputValue(value);
  };

  return (
    <div>
      <Chat
        onSubmit={handleSubmit}
        onChangeInput={handleOnChangeInput}
        inputValue={inputValue}
        chatHistory={chatHistory}
      />
    </div>
  );
};

export default ChatContainer;
