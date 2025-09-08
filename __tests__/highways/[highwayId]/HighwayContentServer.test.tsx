import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import HighwayContentServer from "../../../src/app/highways/[highwayId]/page";

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

describe("HighwayContentServer 測試", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("應該能正確渲染 HighwayContentClient (台1線)", async () => {
    // mock fs
    mockReadFile
      .mockResolvedValueOnce(JSON.stringify({ "40100": ["/img1.jpg"] })) // images
      .mockResolvedValueOnce(JSON.stringify({ "40100": ["描述文字"] })); // descriptions

    // mock fetch
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 40100, // number!!
          name: "台1線",
          start: "台北市中正區(行政院)",
          end: "屏東縣枋山鄉楓港",
          length: "461.081",
        },
      ],
    });

    const ui = await HighwayContentServer({ params: { highwayId: "40100" } });
    render(ui);

    await waitFor(() => {
      // 檢查 highway 名稱
      expect(screen.getByText("台1線")).toBeInTheDocument();

      // 檢查起點/終點
      expect(screen.getByText(/起點:/)).toBeInTheDocument();
      expect(screen.getByText("台北市中正區(行政院)")).toBeInTheDocument();
      expect(screen.getByText(/終點:/)).toBeInTheDocument();
      expect(screen.getByText("屏東縣枋山鄉楓港")).toBeInTheDocument();

      // 檢查長度
      expect(screen.getByText(/長度:/)).toBeInTheDocument();
      expect(screen.getByText(/461\.081/)).toBeInTheDocument();

      // 檢查描述文字
      expect(screen.getByText("描述文字")).toBeInTheDocument();
    });
  });

  it("fetch 失敗時顯示錯誤畫面", async () => {
    (global.fetch as vi.Mock).mockRejectedValueOnce(new Error("fetch failed"));
    mockReadFile
      .mockResolvedValueOnce(JSON.stringify({}))
      .mockResolvedValueOnce(JSON.stringify({}));

    const ui = await HighwayContentServer({ params: { highwayId: "40100" } });
    render(ui);

    expect(await screen.findByText("無法載入資料")).toBeInTheDocument();
  });

  it("找不到 highway 時顯示 not found", async () => {
    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 40100,
          name: "台1線",
          start: "台北市中正區(行政院)",
          end: "屏東縣枋山鄉楓港",
          length: "461.081",
        },
      ],
    });

    mockReadFile
      .mockResolvedValueOnce(JSON.stringify({}))
      .mockResolvedValueOnce(JSON.stringify({}));

    const ui = await HighwayContentServer({ params: { highwayId: "99999" } });
    render(ui);

    expect(await screen.findByText("Highway not found")).toBeInTheDocument();
  });
});
