import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { TitleProvider } from "@/app/context/TitleContext"; // 確保引入 TitleProvider

describe("Home", () => {
  it("renders the Home component", () => {
    render(
      <TitleProvider>
        <Home />
      </TitleProvider>
    );

    screen.debug(); // 輸出組件的 DOM 結構到控制台
  });
});

describe("Mock example", () => {
  it("calls the mock function", () => {
    const mockFn: () => string = vi.fn(() => "Hello"); // 指定返回字串的型別

    expect(mockFn()).toBe("Hello");
    expect(mockFn()).not.toBe("Go away");

    expect(mockFn).toHaveBeenCalled(); // 確保函數被呼叫
  });
});
