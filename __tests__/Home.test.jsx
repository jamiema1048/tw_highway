import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { TitleProvider } from "@/app/context/TitleContext"; // 確保引入 TitleProvider

// 測試 Home 組件
describe("Home", () => {
  it("renders the Home component", () => {
    render(
      <TitleProvider>
        <Home />
      </TitleProvider>
    );

    screen.debug(); // prints out the JSX in the Home component to the command line
  });
});

describe("Mock example", () => {
  it("calls the mock function", () => {
    const mockFn = vi.fn(() => "Hello"); // 創建一個模擬函數，回傳 'Hello'

    // 調用 mock 函數
    expect(mockFn()).toBe("Hello"); // 測試回傳值是否為 'Hello'
    expect(mockFn()).not.toBe("Go away");

    // 驗證 mock 函數是否被呼叫過
    expect(mockFn).toHaveBeenCalled();
  });
});
