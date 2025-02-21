import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useRouter } from "next/router";
import TheMost from "@/app/themost/page";
import { TitleContext } from "@/app/context/TitleContext";
import userEvent from "@testing-library/user-event";

global.fetch = vi.fn();

vi.mock("next/router", () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
    query: {},
  }),
}));

describe("theMost Component", () => {
  //   it("renders the correct title", () => {
  //     render(
  //       <TitleContext.Provider value={{ title: "公路之最", setTitle: () => {} }}>
  //         <theMost />
  //       </TitleContext.Provider>
  //     );
  //     expect(screen.getByText("公路之最")).toBeInTheDocument();
  //   });

  it("shows loading component initially", () => {
    render(
      <TitleContext.Provider value={{ title: "公路之最", setTitle: () => {} }}>
        <TheMost />
      </TitleContext.Provider>
    );
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("fetches and displays highway data", async () => {
    fetch.mockResolvedValueOnce({
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
    render(
      <TitleContext.Provider value={{ title: "公路之最", setTitle: () => {} }}>
        <TheMost />
      </TitleContext.Provider>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText("API error")).toBeInTheDocument();
  });
});
