import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import ArrowUpIcon from "@assets/icons/arrow-up.svg";
import IconButton from "../icon-button/icon-button";
import type { ChatHistoryItem } from "../../types/types";
import type { ApiError } from "../../network/types";
import classNames from "classnames";
import ChatMessage from "../chat-message/chat-message";
import { useStyleStore } from "../../stores/use-style-store";

interface ChatProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeInput: (value: string) => void;
  inputValue: string;
  chatHistory: ChatHistoryItem[];
  showChatHistory: boolean;
  isLoading?: boolean;
  error?: ApiError | null;
  inputRef: React.RefObject<HTMLInputElement>;
}
export const Chat = ({
  onSubmit,
  onChangeInput,
  inputValue,
  chatHistory,
  showChatHistory,
  isLoading = false,
  error = null,
  inputRef,
}: ChatProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const componentStyles = useStyleStore((state) => state.componentStyles);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory.length, isLoading]);

  return (
    <div
      className={classNames(styles.chatContainer, {
        [styles.containerExpanded]: showChatHistory,
      })}
      style={componentStyles["chat"]}
    >
      {showChatHistory ? (
        <div className={styles.chatHistoryContainer}>
          {chatHistory.map(({ value, id, source }) => (
            <ChatMessage key={id} message={value} source={source} />
          ))}
          {isLoading && (
            <ChatMessage
              message="Thinking..."
              source="agent"
              isLoading={true}
            />
          )}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className={styles.featureDescription}>
          <p>
            Hi! I can help you with: <br />
            - <strong>Answering questions</strong> about my CV. <br />
            - <strong>Changing styles</strong> (e.g., "Make background blue"). <br />
            - <strong>Toggling theme</strong> (light/dark). <br />
            - <strong>Resetting styles</strong> ("Reset styles"). <br />
          </p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            Error: {error.error}
            {error.details && (
              <span className={styles.errorDetails}> - {error.details}</span>
            )}
          </p>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className={styles.chatInputContainer}>
          <input
            ref={inputRef}
            className={styles.chatInput}
            name="message"
            type="text"
            placeholder="Lets get started..."
            autoComplete="off"
            value={inputValue}
            onChange={(e) => onChangeInput(e.target.value)}
            disabled={isLoading}
            style={componentStyles["input"]}
          />
          <IconButton
            icon={ArrowUpIcon}
            disabled={!inputValue.trim() || isLoading}
            id="send-button"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};
