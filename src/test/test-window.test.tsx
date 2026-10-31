import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TestWindow } from "@/components/TestWindow";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Workplace Impact
      </button>
      {open && <TestWindow title="Workplace Impact" onClose={() => setOpen(false)} />}
    </>
  );
}

describe("TestWindow", () => {
  it("opens as a dialog and locks page scroll", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Workplace Impact" }));

    expect(screen.getByRole("dialog", { name: "Workplace Impact" })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes on Escape, the close button, and a backdrop click, and unlocks scroll", () => {
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Workplace Impact" });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not close when the window itself is clicked", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Workplace Impact" }));

    fireEvent.click(screen.getByText("Workplace Impact", { selector: ".bh-window__title" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
