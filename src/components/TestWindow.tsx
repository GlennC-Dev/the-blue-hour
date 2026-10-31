import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * A browser-style window that opens over a dimmed backdrop: the same dialog
 * pattern as the portfolio's project cards (portal on document.body, Escape
 * and backdrop click close it, page scroll locks, focus returns to the
 * trigger). Content goes in as children; it may be empty for now.
 *
 * Only mount this while open (`{open && <TestWindow .../>}`): the portal
 * needs `document`, which does not exist during server rendering.
 */
export function TestWindow({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="bh-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="bh-modal__close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>
      <div className="bh-modal__stage">
        <div className="bh-window">
          <div className="bh-window__bar">
            <span className="bh-window__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="bh-window__title">{title}</span>
          </div>
          <div className="bh-window__body">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
