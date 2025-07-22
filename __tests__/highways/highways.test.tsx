import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
  act,
} from "@testing-library/react";
import { describe, it, vi, beforeAll, afterEach, afterAll } from "vitest";
import HighwayList from "../../src/app/highways/page";
import {
  TitleProvider,
  TitleContext,
} from "../../src/app/context/TitleContext";
import { rest } from "msw";
//import "whatwg-fetch";

// import * as msw from "msw";
// console.log("msw:", msw);

import { setupServer } from "msw/node";

// 設置 Mock API Server
//console.log("rest:", rest);
console.log("setupServer:", setupServer);
const server = setupServer(
  rest.get("http://localhost:8000/highways", (req, res, ctx) => {
    const delayTime = Math.random() * 3000 + 1000; // 隨機延遲 1-3 秒
    console.log("Mock API 被呼叫");
    return res(
      ctx.delay(delayTime), // 模擬延遲
      ctx.json([
        { id: 10100, name: "市道101", remark: "" },
        { id: 18400, name: "縣道184", remark: "已解編" },
        { id: 40203, name: "台2丙線", remark: "" },
      ])
    );
  })
);

// 讓測試用的 API Server 正確啟動與關閉
beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn", // 如果有未攔截的請求，顯示警告
  });
  console.log("Mock Server Started"); // 確認 Mock Server 啟動
});
afterEach(() => {
  console.log("🛠️ 重置 MSW handlers...");
  server.resetHandlers();
});
afterAll(() => {
  console.log("🛑 停止 Mock API Server...");
  server.close();
});

describe("HighwayList Component", () => {
  it("手動測試 Mock API", async () => {
    const response = await fetch("http://localhost:8000/highways");
    const data = await response.json();
    console.log("測試環境的 API 回應:", data); // 看看測試環境的回應

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

    // **確保 Loading 消失**
    await waitFor(
      () => {
        expect(screen.queryByText("Loading data...")).not.toBeInTheDocument();
      },
      { timeout: 15000 }
    );

    // 檢查 API 回應的內容
    // await waitFor(() => {
    //   // expect(
    //   //   screen.findByText((content) => content.includes("市道101"))
    //   // ).toBeInTheDocument();
    //   // expect(
    //   //   screen.findByText((content) => content.includes("縣道184 (已解編)"))
    //   // ).toBeInTheDocument();
    //   // expect(
    //   //   screen.findByText((content) => content.includes("台2丙線"))
    //   // ).toBeInTheDocument();
    //   expect(screen.findByText("市道101")).toBeInTheDocument();
    //   expect(screen.findByText("縣道184 (已解編)")).toBeInTheDocument();
    //   expect(screen.findByText("台2丙線")).toBeInTheDocument();
    // });
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

    await waitFor(() => {
      expect(error).toBe("Failed to fetch highways data");
    });
  });
});
