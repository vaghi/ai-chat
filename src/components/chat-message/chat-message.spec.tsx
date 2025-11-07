import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ChatMessage from "../chat-message";
import { MessageSender } from "../../hooks/types";

const styles = {
  message: "message",
  userMessage: "userMessage",
  agentMessage: "agentMessage",
  loadingMessage: "loadingMessage",
  loadingDots: "loadingDots",
};

describe("ChatMessage", () => {
  const baseProps = {
    message: "Test message content.",
    source: MessageSender.USER,
  };

  it("renders the message with the correct user styles when source is USER", () => {
    render(<ChatMessage {...baseProps} source={MessageSender.USER} />);

    const messageElement = screen.getByText(baseProps.message).closest("div");

    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass(styles.message);
    expect(messageElement).toHaveClass(styles.userMessage);
    expect(messageElement).not.toHaveClass(styles.agentMessage);

    expect(messageElement).not.toContainHTML("span");
  });

  it("renders the message with the correct agent styles when source is AGENT", () => {
    const htmlMessage = "This is HTML content.";

    render(
      <ChatMessage
        {...baseProps}
        source={MessageSender.AGENT}
        message={htmlMessage}
      />
    );

    const messageElement = screen
      .getByText("This is HTML content.")
      .closest("div");

    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass(styles.agentMessage);
    expect(messageElement).not.toHaveClass(styles.userMessage);
  });

  it("applies the loading class and displays loading dots when isLoading is true", () => {
    render(<ChatMessage {...baseProps} source="agent" isLoading={true} />);

    const messageElement = screen
      .getByText("Test message content.")
      .closest("div");

    expect(messageElement).toHaveClass(styles.loadingMessage);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("does not display loading dots when isLoading is false", () => {
    render(<ChatMessage {...baseProps} isLoading={false} />);
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });
});
