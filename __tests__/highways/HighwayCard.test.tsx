import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HighwayCard from "../../src/app/highways/HighwayCard";
import { Highway } from "types/highway";
import { useState } from "react";

function Wrapper({ highway }: { highway: Highway }) {
  const [hoveredHighway, setHoveredHighway] = useState<Highway | null>(null);
  return (
    <HighwayCard
      highway={highway}
      hoveredHighway={hoveredHighway}
      setHoveredHighway={setHoveredHighway}
    />
  );
}

describe("HighwayCard", () => {
  const baseHighway: Highway = {
    id: 40100,
    name: "台1線",
    routeName: "台北－楓港",
    remark: "",
    images: ["https://placehold.co/400x200"],
  };

  it("hover link 時應該顯示卡片", async () => {
    render(<Wrapper highway={baseHighway} />);
    const link = screen.getByRole("link", { name: "台1線" });
    await userEvent.hover(link);
    await waitFor(() => {
      expect(screen.getByText("台北－楓港")).toBeInTheDocument();
    });
  });

  it("unhover link 時應該隱藏卡片", async () => {
    render(<Wrapper highway={baseHighway} />);
    const link = screen.getByRole("link", { name: "台1線" });
    await userEvent.hover(link);
    await userEvent.unhover(link);
    await waitFor(() => {
      expect(screen.queryByText("台北－楓港")).not.toBeInTheDocument();
    });
  });

  it("卡片位置應該不會超出螢幕邊界", async () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 500 });
    render(<Wrapper highway={baseHighway} />);
    const link = screen.getByRole("link", { name: "台1線" });
    await userEvent.hover(link);

    const card = await screen.findByText("台北－楓港");
    await waitFor(() => {
      const style = window.getComputedStyle(card.parentElement!);
      expect(parseInt(style.left)).toBeGreaterThanOrEqual(0);
      expect(parseInt(style.left)).toBeLessThanOrEqual(500);
    });
  });

  it("長按 link (touchstart) 也會顯示卡片", async () => {
    vi.useFakeTimers();
    render(<Wrapper highway={baseHighway} />);
    const link = screen.getByRole("link", { name: "台1線" });

    fireEvent.touchStart(link);
    vi.advanceTimersByTime(600);

    await waitFor(() => {
      expect(screen.getByText("台北－楓港")).toBeInTheDocument();
    });

    fireEvent.touchEnd(link);
    vi.useRealTimers();
  });
});
