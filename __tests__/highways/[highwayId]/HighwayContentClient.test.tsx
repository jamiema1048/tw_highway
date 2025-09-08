import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HighwayContentClient from "../../../src/app/highways/[highwayId]/HighwayContentClient";

describe("HighwayContentClient 測試", () => {
  it("應該正確渲染起點與終點", () => {
    const mockHighway = {
      id: 40100,
      name: "台1線",
      start: "台北市中正區(行政院)",
      end: "屏東縣枋山鄉楓港",
      length: 461.081,
      images: ["/img1.jpg"], // ✅ 陣列
      descriptions: ["描述文字"], // ✅ 陣列
    };

    render(<HighwayContentClient highway={mockHighway} />);

    // 驗證 highway 名稱
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "台1線"
    );

    // 驗證起點/終點文字
    expect(screen.getByText(/起點/)).toBeInTheDocument();
    expect(screen.getByText(/終點/)).toBeInTheDocument();

    // 驗證描述文字
    expect(screen.getByText("描述文字")).toBeInTheDocument();
  });
});
