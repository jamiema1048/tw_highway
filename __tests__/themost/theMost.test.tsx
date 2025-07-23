import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRouter } from "next/router";
import TheMost from "@/app/themost/page";
import { TitleContext } from "@/app/context/TitleContext";
import userEvent from "@testing-library/user-event";

// TypeScript: 對 global.fetch 添加型別
global.fetch = vi.fn() as unknown as typeof fetch;

vi.mock("next/router", () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
    query: {},
  }),
}));

describe("TheMost Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // 每次測試前清除 mock 記錄
  });

  it("shows loading component initially", () => {
    render(
      <TitleContext.Provider value={{ title: "公路之最", setTitle: () => {} }}>
        <TheMost />
      </TitleContext.Provider>
    );

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("fetches and displays highway data", async () => {
    (fetch as unknown as Vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 40100, name: "台1線" }],
    });

    render(
      <TitleContext.Provider value={{ title: "公路之最", setTitle: () => {} }}>
        <TheMost />
      </TitleContext.Provider>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText("台1線")).toBeInTheDocument();
  });

  it("handles API error correctly", async () => {
    (fetch as unknown as Vi.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    render(
      <TitleContext.Provider value={{ title: "公路之最", setTitle: () => {} }}>
        <TheMost />
      </TitleContext.Provider>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText("API error")).toBeInTheDocument();
  });
});
