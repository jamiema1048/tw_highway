import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DataReference from "@/app/reference/page";
import { TitleContext } from "@/app/context/TitleContext";

// 定義 Context 的型別（可改為從你實際的定義檔案中 import）
interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

describe("DataReference Component", () => {
  it("renders correctly", async () => {
    const title = "測試標題";
    const setTitle = vi.fn() as (title: string) => void;

    render(
      <TitleContext.Provider value={{ title, setTitle } as TitleContextType}>
        <DataReference />
      </TitleContext.Provider>
    );

    const reference = await screen.findAllByText("參考資料");
    const twroad = await screen.findAllByText("公路邦");
    const wiki = await screen.findAllByText("維基百科");

    expect(reference.length).toBeGreaterThan(0);
    expect(twroad.length).toBeGreaterThan(0);
    expect(wiki.length).toBeGreaterThan(0);
  });
});
