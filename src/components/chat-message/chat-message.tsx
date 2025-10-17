import classNames from "classnames";
import { MessageSender } from "../../hooks/types";
import styles from "./styles.module.scss";

interface ChatMessageProps {
  message: string;
  source: MessageSender | string;
  isLoading?: boolean;
}

const ChatMessage = ({
  message,
  source,
  isLoading = false,
}: ChatMessageProps) => {
  const isUser = source === MessageSender.USER || source === "user";

  return (
    <div
      className={classNames(
        styles.message,
        isUser ? styles.userMessage : styles.agentMessage,
        isLoading && styles.loadingMessage
      )}
    >
      {isUser ? (
        message
      ) : (
        <span dangerouslySetInnerHTML={{ __html: message }} />
      )}
      {isLoading && <span className={styles.loadingDots}>...</span>}
    </div>
  );
};

export default ChatMessage;
