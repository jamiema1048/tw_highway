// __tests__/highways/highwayContent.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HighwayContentServer from "../../src/app/highways/[highwayId]/page";

// mock fs/promises
vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
}));

// mock fetch
global.fetch = vi.fn();

describe("HighwayContentServer 測試", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("應該正確渲染 HighwayContentClient", async () => {
    const imagesData = JSON.stringify({ "40100": ["/img1.jpg"] });
    const descriptionsData = JSON.stringify({ "40100": ["描述文字"] });
    const mockReadFile = (await import("fs/promises")).readFile as vi.Mock;
    mockReadFile
      .mockResolvedValueOnce(imagesData)
      .mockResolvedValueOnce(descriptionsData);

    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 40100, // 注意：Server 裡有 Number(h.id) === Number(highwayId)
          name: "台1線",
          start: "台北市中正區(行政院)",
          end: "屏東縣枋山鄉楓港",
          length: 461.081,
        },
      ],
    });

    const ui = await HighwayContentServer({ params: { highwayId: "40100" } });
    render(ui);

    // 斷言 heading 顯示 highway 名稱
    // expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
    //   "台1線"
    // );
    await waitFor(() => {
      expect(
        screen.getByText(
          (content, element) =>
            element?.tagName === "H3" && content.includes("起點:")
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          (content, element) =>
            element?.tagName === "H3" && content.includes("終點:")
        )
      ).toBeInTheDocument();
    });
  });

  it("遇到 fetch 失敗時應顯示錯誤畫面", async () => {
    const highwayId = "40100";

    (global.fetch as vi.Mock).mockRejectedValueOnce(new Error("fetch failed"));
    const mockReadFile = (await import("fs/promises")).readFile as vi.Mock;
    mockReadFile
      .mockResolvedValueOnce(JSON.stringify({}))
      .mockResolvedValueOnce(JSON.stringify({}));

    const ui = await HighwayContentServer({ params: { highwayId } });
    render(ui);

    expect(await screen.findByText("無法載入資料")).toBeInTheDocument();
  });

  it("找不到 highway 時顯示 not found", async () => {
    const highwayId = "99999";

    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 40100,
          name: "台1線",
          start: "台北市中正區(行政院)",
          end: "屏東縣枋山鄉楓港",
          length: 461.081,
        },
      ],
    });

    const mockReadFile = (await import("fs/promises")).readFile as vi.Mock;
    mockReadFile
      .mockResolvedValueOnce(JSON.stringify({}))
      .mockResolvedValueOnce(JSON.stringify({}));

    const ui = await HighwayContentServer({ params: { highwayId } });
    render(ui);

    expect(await screen.findByText("Highway not found")).toBeInTheDocument();
  });
});
