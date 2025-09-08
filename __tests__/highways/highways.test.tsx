import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HighwayListServer from "../../src/app/highways/page";

// ✅ 正確 mock fs/promises default import
vi.mock("fs/promises", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    __esModule: true,
    default: {
      ...actual,
      readFile: vi.fn(),
    },
  };
});

const mockReadFile = vi.mocked((await import("fs/promises")).default.readFile);

// mock fetch
global.fetch = vi.fn();

describe("HighwayListServer 測試", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("應該能正確讀取 JSON 並渲染 HighwayListClient", async () => {
    // 模擬讀取 images.json 和 descriptions.json
    mockReadFile
      .mockResolvedValueOnce(
        JSON.stringify({
          "40100": ["/image/001/20201206_111653.jpg"],
        })
      ) // 第一次讀 images.json
      .mockResolvedValueOnce(
        JSON.stringify({
          "40100": "台1線",
        })
      ); // 第二次讀 descriptions.json

    // 模擬 fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: "40100", name: "台1線" },
        { id: "40203", name: "台2丙線" },
        { id: "12200", name: "縣道122" },
      ],
    });

    // ✅ 只 render 一次
    const ui = await HighwayListServer();
    render(ui);

    await waitFor(() => {
      waitFor(() => {
        // 先展開 省道
        fireEvent.click(screen.getByText("省道 ▼"));
        fireEvent.click(screen.getByText("1~20 ▼"));
        // 再展開 縣市道
        fireEvent.click(screen.getByText("縣市道 ▼"));
        fireEvent.click(screen.getByText("121~140 ▼"));
      });
      // 驗證內容
      expect(screen.getByText("台1線")).toBeInTheDocument();
      expect(screen.getByText("台2丙線")).toBeInTheDocument();
      expect(screen.getByText("縣道122")).toBeInTheDocument();
    });
  });

  it("遇到錯誤時應顯示錯誤畫面", async () => {
    mockReadFile.mockRejectedValueOnce(new Error("讀取失敗"));

    const ui = await HighwayListServer();
    render(ui);

    expect(await screen.findByText("🚧 發生錯誤")).toBeInTheDocument();
  });
});
