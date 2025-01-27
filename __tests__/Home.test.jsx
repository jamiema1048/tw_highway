import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// 測試 Home 組件
describe("Home", () => {
  it("renders the Home component", () => {
    render(<Home />);

    screen.debug(); // prints out the jsx in the Home component unto the command line
  });
});
describe("Mock example", () => {
  it("calls the mock function", () => {
    const mockFn = vi.fn(() => "Hello"); // 創建一個模擬函數，回傳 'Hello'

    // 調用 mock 函數
    expect(mockFn()).toBe("Hello"); // 測試回傳值是否為 'Hello'
    expect(mockFn()).not.equal("Go away");

    // 驗證 mock 函數是否被呼叫過
    expect(mockFn).toHaveBeenCalled();
  });
});
