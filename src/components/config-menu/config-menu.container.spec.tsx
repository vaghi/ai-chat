import { render, screen, fireEvent } from "@testing-library/react";
import ConfigMenuContainer from "./config-menu.container";
import { act } from "react";

describe("ConfigMenuContainer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize with isOpen=false and showContent=false", () => {
    render(<ConfigMenuContainer />);

    const menu = screen.getByTestId("config-menu-main");
    const content = screen.getByTestId("config-menu-content");

    expect(menu).not.toHaveClass("menuOpen");
    expect(content).not.toHaveClass("showContent");
  });

  it("should open the menu immediately and show content after 600ms delay", () => {
    render(<ConfigMenuContainer />);
    const menu = screen.getByTestId("config-menu-main");
    const content = screen.getByTestId("config-menu-content");
    const toggleButton = screen.getByTestId("config-menu-toggle-button");

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(menu).toHaveClass("menuOpen");
    expect(content).not.toHaveClass("showContent");

    act(() => {
      jest.advanceTimersByTime(599);
    });
    expect(content).not.toHaveClass("showContent");

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(menu).toHaveClass("menuOpen");
    expect(content).toHaveClass("showContent");
  });

  it("should hide content immediately and close the menu after 500ms delay", () => {
    render(<ConfigMenuContainer />);
    const menu = screen.getByTestId("config-menu-main");
    const content = screen.getByTestId("config-menu-content");
    const toggleButton = screen.getByTestId("config-menu-toggle-button");

    act(() => {
      fireEvent.click(toggleButton);
      jest.advanceTimersByTime(600);
    });
    expect(content).toHaveClass("showContent");
    expect(menu).toHaveClass("menuOpen");

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(content).not.toHaveClass("showContent");
    expect(menu).toHaveClass("menuOpen");

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(menu).toHaveClass("menuOpen");

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(menu).not.toHaveClass("menuOpen");
    expect(content).not.toHaveClass("showContent");
  });
});
