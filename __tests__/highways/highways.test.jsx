import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeAll, afterEach, afterAll } from "vitest";
import HighwayList from "../../src/app/highways/page";
import {
  TitleProvider,
  TitleContext,
} from "../../src/app/context/TitleContext";
import { rest } from "msw";
import { setupServer } from "msw/node";

// 設置 Mock API Server
const server = setupServer(
  rest.get("http://localhost:8000/highways", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 10100, name: "市道101", remark: "" },
        { id: 18400, name: "縣道184", remark: "已解編" },
        { id: 40203, name: "台2丙線", remark: "" },
      ])
    );
  })
);

// 讓測試用的 API Server 正確啟動與關閉
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("HighwayList Component", () => {
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

    expect(screen.getByText("載入中請稍後")).toBeInTheDocument();
  });

  it("應該成功顯示公路列表", async () => {
    render(
      <TitleProvider>
        <HighwayList />
      </TitleProvider>
    );

    // 確保 Loading 消失
    await waitFor(() => {
      expect(screen.queryByText("載入中請稍後")).not.toBeInTheDocument();
    });

    // 檢查 API 回應的內容
    expect(screen.getByText("市道101")).toBeInTheDocument();
    expect(screen.getByText("縣道184  (已解編)")).toBeInTheDocument();
    expect(screen.getByText("台2丙線")).toBeInTheDocument();
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

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch highways data")
      ).toBeInTheDocument();
    });
  });
});
