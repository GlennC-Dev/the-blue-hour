import { useCallback, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TestWindow } from "@/components/TestWindow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Blue Hour" },
      { name: "description", content: "A quiet place to reflect on how you work." },
      { property: "og:title", content: "The Blue Hour" },
      { property: "og:description", content: "A quiet place to reflect on how you work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TESTS = [
  { id: "superhero", label: "Superhero Traits" },
  { id: "arcana", label: "Arcana Personality" },
  { id: "impact", label: "Workplace Impact" },
] as const;

type TestId = (typeof TESTS)[number]["id"];

function Index() {
  const [open, setOpen] = useState<TestId | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const show = useCallback((id: TestId, el: HTMLElement) => {
    triggerRef.current = el;
    setOpen(id);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const active = TESTS.find((t) => t.id === open);

  return (
    <main className="bh-hub">
      <h1 className="bh-hub__title">The Blue Hour</h1>
      <div className="bh-hub__buttons">
        {TESTS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="bh-hub__btn"
            aria-haspopup="dialog"
            onClick={(e) => show(t.id, e.currentTarget)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {active && <TestWindow title={active.label} onClose={close} />}
    </main>
  );
}
