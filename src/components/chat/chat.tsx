import styles from "./styles.module.scss";
import ArrowUpIcon from "../../assets/icons/arrow-up.svg";
import IconButton from "../icon-button/icon-button";
import type { ChatHistoryItem } from "../../hooks/types";

interface ChatProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeInput: (value: string) => void;
  inputValue: string;
  chatHistory: ChatHistoryItem[];
}

export const Chat = ({ onSubmit, onChangeInput, inputValue }: ChatProps) => {
  return (
    <div className={styles.chatContainer}>
      <form onSubmit={onSubmit}>
        <div className={styles.chatInputContainer}>
          <input
            className={styles.chatInput}
            name="message"
            type="text"
            placeholder="Ask me anything about my CV..."
            autoComplete="off"
            onChange={(e) => onChangeInput(e.target.value)}
          />
          <IconButton
            icon={ArrowUpIcon}
            disabled={!inputValue.trim()}
            id="send-button"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};
