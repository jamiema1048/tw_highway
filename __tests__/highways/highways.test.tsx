import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, vi, beforeAll, afterEach, afterAll } from "vitest";
import HighwayList from "../../src/app/highways/page";
import { TitleProvider } from "../../src/app/context/TitleContext";
import { rest } from "msw";
import { setupServer } from "msw/node";

// Mock API Server 設置
const server = setupServer(
  rest.get("http://localhost:8000/highways", (req, res, ctx) => {
    const delayTime = Math.random() * 3000 + 1000; // 模擬延遲
    return res(
      ctx.delay(delayTime),
      ctx.json([
        { id: 10100, name: "市道101", remark: "" },
        { id: 18400, name: "縣道184", remark: "已解編" },
        { id: 40203, name: "台2丙線", remark: "" },
      ])
    );
  })
);

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn",
  });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("HighwayList Component", () => {
  it("手動測試 Mock API", async () => {
    const response = await fetch("http://localhost:8000/highways");
    const data = await response.json();
    expect(data).toEqual([
      { id: 10100, name: "市道101", remark: "" },
      { id: 18400, name: "縣道184", remark: "已解編" },
      { id: 40203, name: "台2丙線", remark: "" },
    ]);
  });

  it("應該顯示 '公路列表' 作為標題", () => {
    render(
      <TitleProvider>
        <HighwayList />
      </TitleProvider>
    );
    expect(screen.getByText("公路列表")).toBeInTheDocument();
  });

  it("應該在載入時顯示 Loading", () => {
    render(
      <TitleProvider>
        <HighwayList />
      </TitleProvider>
    );
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("應該成功顯示公路列表", async () => {
    render(
      <TitleProvider>
        <HighwayList />
      </TitleProvider>
    );

    await waitFor(
      () =>
        expect(screen.queryByText("Loading data...")).not.toBeInTheDocument(),
      { timeout: 15000 }
    );

    await act(async () => {
      const highway101 = await screen.findByText("市道101");
      const highway184 = await screen.findByText("縣道184 (已解編)");
      const highway203 = await screen.findByText("台2丙線");

      expect(highway101).toBeInTheDocument();
      expect(highway184).toBeInTheDocument();
      expect(highway203).toBeInTheDocument();
    });
  });

  it("應該處理 API 錯誤並顯示錯誤訊息", async () => {
    server.use(
      rest.get("http://localhost:8000/highways", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <TitleProvider>
        <HighwayList />
      </TitleProvider>
    );

    // 根據你的 HighwayList 組件，錯誤訊息會以文字形式呈現，這裡以範例 "Failed to fetch highways data" 作判斷
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch highways data/i)
      ).toBeInTheDocument();
    });
  });
});
