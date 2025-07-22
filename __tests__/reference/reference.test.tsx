import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DataReference from "@/app/reference/page";
import { TitleProvider, TitleContext } from "@/app/context/TitleContext";

describe("DataReference Component", () => {
  console.log("測試開始");
  it("renders correctly", async () => {
    const title = "測試標題";
    const setTitle = vi.fn();

    render(
      <TitleContext.Provider value={{ title, setTitle }}>
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
