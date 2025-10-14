import * as React from "react";

type DragXEvent = {
  /** Current pointer X (client) */
  clientX: number;
  /** X where the drag started */
  startX: number;
  /** Total horizontal movement since drag start */
  totalDeltaX: number;
  /** The original pointerdown event target */
  target: EventTarget | null;
};

type UseDragXOptions = {
  /** Called on every move with the incremental dx since the previous event */
  onDelta: (dx: number, meta: DragXEvent) => void;
  /** Called once when drag starts */
  onDragStart?: (meta: DragXEvent) => void;
  /** Called once when drag ends */
  onDragEnd?: (meta: DragXEvent) => void;
  /** Disable the hook */
  disabled?: boolean;
  /** Restrict to primary button drags (left click); default true  */
  primaryButtonOnly?: boolean;
  /** If true, preventDefault on move to avoid scrolling during touch drags */
  preventScrollOnMove?: boolean;
};

type DragBind = {
  onPointerDown: (e: React.PointerEvent) => void;
  /** Recommended for the handle to avoid accidental scroll during touch drags */
  style?: React.CSSProperties;
  /** You can also put `touchAction: "none"` in your CSS */
  role?: string;
};

export function useDragX(options: UseDragXOptions): {
  isDragging: boolean;
  bind: DragBind;
} {
  const {
    onDelta,
    onDragStart,
    onDragEnd,
    disabled = false,
    primaryButtonOnly = true,
    preventScrollOnMove = true,
  } = options;

  const [isDragging, setIsDragging] = React.useState(false);
  const startXRef = React.useRef(0);
  const prevXRef = React.useRef(0);
  const totalRef = React.useRef(0);
  const targetRef = React.useRef<EventTarget | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const cleanup = React.useCallback(
    (clientX?: number) => {
      if (!isDragging) return;

      const meta: DragXEvent = {
        clientX: clientX ?? prevXRef.current,
        startX: startXRef.current,
        totalDeltaX: totalRef.current,
        target: targetRef.current,
      };

      setIsDragging(false);
      window.removeEventListener("pointermove", onWindowPointerMove, {
        capture: true,
      });
      window.removeEventListener("pointerup", onWindowPointerUp, {
        capture: true,
      });
      window.removeEventListener("pointercancel", onWindowPointerUp, {
        capture: true,
      });
      window.removeEventListener("keydown", onWindowKeyDown, true);

      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      onDragEnd?.(meta);
      targetRef.current = null;
      totalRef.current = 0;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDragging, onDragEnd]
  );

  const onWindowKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      // Allow ESC to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup();
      }
    },
    [cleanup]
  );

  const onWindowPointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;

      // Use rAF to coalesce bursts of pointermove events
      const tick = () => {
        const x = e.clientX;
        const dx = x - prevXRef.current;
        if (dx !== 0) {
          prevXRef.current = x;
          totalRef.current += dx;

          const meta: DragXEvent = {
            clientX: x,
            startX: startXRef.current,
            totalDeltaX: totalRef.current,
            target: targetRef.current,
          };

          if (preventScrollOnMove) {
            // Prevent page scroll during touch-drag
            e.preventDefault();
          }
          onDelta(dx, meta);
        }
        rafRef.current = null;
      };

      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [isDragging, onDelta, preventScrollOnMove]
  );

  const onWindowPointerUp = React.useCallback(
    (e: PointerEvent) => {
      cleanup(e.clientX);
    },
    [cleanup]
  );

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;

      if (primaryButtonOnly && e.button !== 0) return;

      // Capture the pointer to keep receiving moves even when the cursor leaves the handle
      (e.target as Element).setPointerCapture?.(e.pointerId);

      startXRef.current = e.clientX;
      prevXRef.current = e.clientX;
      totalRef.current = 0;
      targetRef.current = e.target;

      setIsDragging(true);

      const meta: DragXEvent = {
        clientX: e.clientX,
        startX: e.clientX,
        totalDeltaX: 0,
        target: e.target,
      };
      onDragStart?.(meta);

      // Listen on window so movements outside the element still count
      // Use capture to get early access before other handlers (helps with preventDefault on touch)
      window.addEventListener("pointermove", onWindowPointerMove, {
        passive: !preventScrollOnMove,
        capture: true,
      });
      window.addEventListener("pointerup", onWindowPointerUp, { capture: true });
      window.addEventListener("pointercancel", onWindowPointerUp, {
        capture: true,
      });
      window.addEventListener("keydown", onWindowKeyDown, true);
    },
    [
      disabled,
      onDragStart,
      onWindowKeyDown,
      onWindowPointerMove,
      onWindowPointerUp,
      primaryButtonOnly,
      preventScrollOnMove,
    ]
  );

  // Ensure listeners are removed if the component unmounts mid-drag
  React.useEffect(() => {
    return () => {
      if (isDragging) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return {
    isDragging,
    bind: {
      onPointerDown,
      role: "separator", // handy for resizers
      style: { touchAction: "none", cursor: "col-resize", userSelect: "none" },
    },
  };
}