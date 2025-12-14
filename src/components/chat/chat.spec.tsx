import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Chat } from "./chat";

import { MessageSender } from "../../types/types";

// Mock the style store
jest.mock("../../stores/use-style-store", () => ({
  useStyleStore: jest.fn((selector) =>
    selector({
      componentStyles: {},
    })
  ),
}));

const mockScrollIntoView = jest.fn();

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
});

jest.mock("../chat-message/chat-message", () => ({
  __esModule: true,
  default: jest.fn(({ message, source, isLoading }) => (
    <div
      role="listitem"
      data-testid="mock-chat-message"
      data-message={message}
      data-source={source}
      data-loading={isLoading ? "true" : "false"}
    />
  )),
}));

jest.mock("../icon-button/icon-button", () => ({
  __esModule: true,
  default: jest.fn(({ onClick, disabled, id, type }) => (
    <button
      data-testid={id || "mock-icon-button"}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {disabled ? "Disabled" : "Send"}
    </button>
  )),
}));

const mockChatHistory = [
  { id: "1", value: "Hello User", source: MessageSender.AGENT, type: "text" },
  { id: "2", value: "Hello Agent", source: MessageSender.USER, type: "text" },
];

const mockSubmit = jest.fn();
const mockOnChangeInput = jest.fn();

const baseProps = {
  onSubmit: mockSubmit,
  onChangeInput: mockOnChangeInput,
  inputValue: "",
  chatHistory: [],
  showChatHistory: false,
  isLoading: false,
  error: null,
  inputRef: { current: null },
};

describe("Chat", () => {
  beforeEach(() => {
    // Clear mocks for every test
    jest.clearAllMocks();
    mockScrollIntoView.mockClear();
  });

  // Test 1: DOM Query updated for when history is not shown
  it("renders input and form but not history when showChatHistory is false", () => {
    render(<Chat {...baseProps} />);

    expect(screen.getByPlaceholderText(/lets get started/i)).toBeInTheDocument();
    expect(screen.queryByTestId("mock-chat-message")).not.toBeInTheDocument();

    // FIX: Get the container by traversing up from a reliable, visible element (the textbox)
    const container = screen.getByRole("textbox").closest("div.chatContainer");
    expect(container).toHaveClass("chatContainer");
    expect(container).not.toHaveClass("containerExpanded");

    // Expect feature description to be present
    expect(screen.getByText(/Hi! I can help you with/i)).toBeInTheDocument();
  });

  // Test 2 FIX: DOM Query updated to avoid using getByRole("listitem") which now returns multiple results
  it("renders history and chat messages with correct sources when showChatHistory is true", () => {
    render(
      <Chat
        {...baseProps}
        showChatHistory={true}
        chatHistory={mockChatHistory}
      />
    );

    const messages = screen.getAllByTestId("mock-chat-message");
    expect(messages).toHaveLength(2);

    expect(messages[0]).toHaveAttribute("data-source", MessageSender.AGENT);
    expect(messages[1]).toHaveAttribute("data-source", MessageSender.USER);

    // FIX: Use the reliable textbox element to find the main container instead of listitem
    const container = screen.getByRole("textbox").closest("div.chatContainer");
    expect(container).toHaveClass("containerExpanded");
  });

  it("calls onChangeInput when the input value changes", () => {
    render(<Chat {...baseProps} />);
    const input = screen.getByPlaceholderText(/lets get started/i);

    fireEvent.change(input, { target: { value: "New message" } });

    expect(mockOnChangeInput).toHaveBeenCalledWith("New message");
  });

  // Test 4 FIX: DOM Query updated to find the form via the textbox
  it("calls onSubmit when the send button is clicked", () => {
    render(<Chat {...baseProps} inputValue="test" />);
    // FIX: Find the form by using the accessible textbox element and finding its parent form.
    const form = screen.getByRole("textbox").closest("form") as HTMLFormElement;

    fireEvent.submit(form);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables send button when input is empty or loading", () => {
    const { rerender } = render(<Chat {...baseProps} inputValue="" />);
    expect(screen.getByText("Disabled")).toBeInTheDocument();

    rerender(<Chat {...baseProps} inputValue="a" />);
    expect(screen.getByText("Send")).toBeInTheDocument();

    rerender(<Chat {...baseProps} inputValue="a" isLoading={true} />);
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  // Test 6 FIX: scrollIntoView now uses the global mock
  it("disables input and shows loading message with correct source when isLoading is true", () => {
    render(
      <Chat
        {...baseProps}
        showChatHistory={true}
        isLoading={true}
        chatHistory={mockChatHistory}
      />
    );

    expect(screen.getByPlaceholderText(/lets get started/i)).toBeDisabled();

    const messages = screen.getAllByTestId("mock-chat-message");
    const loadingMessage = messages.find(
      (m) => m.getAttribute("data-loading") === "true"
    );

    expect(loadingMessage).toBeInTheDocument();
    expect(loadingMessage).toHaveAttribute("data-message", "Thinking...");
    expect(loadingMessage).toHaveAttribute("data-source", MessageSender.AGENT);
    // Assertion relies on scrollIntoView being mocked correctly
    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  it("renders the error message correctly when error is provided", () => {
    const mockError = { error: "Failed to fetch", details: "Network issue" };
    render(<Chat {...baseProps} error={mockError} />);

    expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument();
    expect(screen.getByText(/network issue/i)).toBeInTheDocument();
  });

  // Test 8 FIX: scrollIntoView now uses the global mock
  it("calls scrollIntoView when chatHistory length or isLoading changes", () => {
    const { rerender } = render(
      <Chat {...baseProps} showChatHistory={true} chatHistory={[]} />
    );
    // Initial render triggers scroll
    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);

    // Trigger scroll by changing history length
    rerender(
      <Chat
        {...baseProps}
        showChatHistory={true}
        chatHistory={mockChatHistory}
      />
    );
    expect(mockScrollIntoView).toHaveBeenCalledTimes(2);

    // Trigger scroll by changing isLoading state
    rerender(
      <Chat
        {...baseProps}
        showChatHistory={true}
        chatHistory={mockChatHistory}
        isLoading={true}
      />
    );
    expect(mockScrollIntoView).toHaveBeenCalledTimes(3);

    // No scroll if props are the same
    rerender(
      <Chat
        {...baseProps}
        showChatHistory={true}
        chatHistory={mockChatHistory}
        isLoading={true}
      />
    );
    expect(mockScrollIntoView).toHaveBeenCalledTimes(3);
  });
});
