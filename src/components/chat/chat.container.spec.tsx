import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatContainer from "./chat.container";

jest.mock("./chat", () => ({
  Chat: jest.fn(
    ({
      onSubmit,
      onChangeInput,
      inputValue,
      chatHistory,
      showChatHistory,
      isLoading,
      error,
    }) => (
      <div>
        <form onSubmit={onSubmit} data-testid="chat-form">
          <input
            name="message"
            value={inputValue}
            onChange={(e) => onChangeInput(e.target.value)}
            data-testid="chat-input"
          />
          <button type="submit">Send</button>
        </form>
        <div data-testid="chat-history">{chatHistory.join(",")}</div>
        <div data-testid="show-chat-history">{showChatHistory.toString()}</div>
        {isLoading && <div data-testid="loading">Loading...</div>}
        {error && <div data-testid="error">{error}</div>}
      </div>
    )
  ),
}));

// --- Mock useChatHistory hook ---
const mockSendMessage = jest.fn();
const mockClearError = jest.fn();

jest.mock("../../hooks/use-chat-history", () => ({
  useChatHistory: jest.fn(),
}));

import { useChatHistory } from "../../hooks/use-chat-history";
const mockedUseChatHistory = useChatHistory as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ChatContainer", () => {
  it("renders Chat with correct props (initial state)", () => {
    mockedUseChatHistory.mockReturnValue({
      chatHistory: [],
      isLoading: false,
      error: null,
      sendMessage: mockSendMessage,
      clearError: mockClearError,
    });

    render(<ChatContainer />);

    expect(screen.getByTestId("show-chat-history")).toHaveTextContent("false");
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  it("submits non-empty message and resets input", async () => {
    mockedUseChatHistory.mockReturnValue({
      chatHistory: ["Hello"],
      isLoading: false,
      error: null,
      sendMessage: mockSendMessage.mockResolvedValueOnce("ok"),
      clearError: mockClearError,
    });

    render(<ChatContainer />);

    const input = screen.getByTestId("chat-input");
    const form = screen.getByTestId("chat-form");

    fireEvent.change(input, { target: { value: "Hi there" } });
    fireEvent.submit(form);

    await waitFor(() =>
      expect(mockSendMessage).toHaveBeenCalledWith("Hi there")
    );
    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("does not call sendMessage when message is empty", async () => {
    mockedUseChatHistory.mockReturnValue({
      chatHistory: [],
      isLoading: false,
      error: null,
      sendMessage: mockSendMessage,
      clearError: mockClearError,
    });

    render(<ChatContainer />);

    const input = screen.getByTestId("chat-input");
    const form = screen.getByTestId("chat-form");

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(form);

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("handles sendMessage errors gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedUseChatHistory.mockReturnValue({
      chatHistory: [],
      isLoading: false,
      error: null,
      sendMessage: jest.fn().mockRejectedValueOnce(new Error("API fail")),
      clearError: mockClearError,
    });

    render(<ChatContainer />);
    const input = screen.getByTestId("chat-input");
    const form = screen.getByTestId("chat-form");

    fireEvent.change(input, { target: { value: "Test" } });
    fireEvent.submit(form);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    consoleSpy.mockRestore();
  });

  it("calls clearError when input changes and error exists", () => {
    mockedUseChatHistory.mockReturnValue({
      chatHistory: [],
      isLoading: false,
      error: "Something went wrong",
      sendMessage: mockSendMessage,
      clearError: mockClearError,
    });

    render(<ChatContainer />);
    const input = screen.getByTestId("chat-input");
    fireEvent.change(input, { target: { value: "new text" } });

    expect(mockClearError).toHaveBeenCalled();
  });

  it("passes loading and error props to Chat", () => {
    mockedUseChatHistory.mockReturnValue({
      chatHistory: ["msg"],
      isLoading: true,
      error: "Oops",
      sendMessage: mockSendMessage,
      clearError: mockClearError,
    });

    render(<ChatContainer />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByTestId("error")).toHaveTextContent("Oops");
    expect(screen.getByTestId("show-chat-history")).toHaveTextContent("true");
  });
});
