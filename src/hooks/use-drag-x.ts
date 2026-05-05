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

  // The active flag must be readable by listeners attached during pointerdown,
  // before React has flushed the corresponding state update — so we mirror it
  // into a ref. The state value is kept around for consumers that want to
  // re-render based on drag status.
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const prevXRef = React.useRef(0);
  const totalRef = React.useRef(0);
  const targetRef = React.useRef<EventTarget | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // Keep the latest callbacks in a ref so the listeners (attached once per
  // drag) always see fresh handlers without re-attaching on every render.
  const callbacksRef = React.useRef({ onDelta, onDragStart, onDragEnd, preventScrollOnMove });
  React.useEffect(() => {
    callbacksRef.current = { onDelta, onDragStart, onDragEnd, preventScrollOnMove };
  });

  // Live references to the per-drag listeners so cleanup can detach them by
  // identity even if the component re-renders mid-drag.
  const handlersRef = React.useRef<{
    move?: (e: PointerEvent) => void;
    up?: (e: PointerEvent) => void;
    keydown?: (e: KeyboardEvent) => void;
  }>({});

  const cleanup = React.useCallback((clientX?: number) => {
    if (!isDraggingRef.current) return;

    const meta: DragXEvent = {
      clientX: clientX ?? prevXRef.current,
      startX: startXRef.current,
      totalDeltaX: totalRef.current,
      target: targetRef.current,
    };

    isDraggingRef.current = false;
    setIsDragging(false);

    const { move, up, keydown } = handlersRef.current;
    if (move) {
      window.removeEventListener("pointermove", move, true);
    }
    if (up) {
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
    }
    if (keydown) {
      window.removeEventListener("keydown", keydown, true);
    }
    handlersRef.current = {};

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    callbacksRef.current.onDragEnd?.(meta);
    targetRef.current = null;
    totalRef.current = 0;
  }, []);

  const onPointerDown = React.useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    if (primaryButtonOnly && e.button !== 0) return;

    // Capture the pointer to keep receiving moves even when the cursor leaves the handle.
    (e.target as Element).setPointerCapture?.(e.pointerId);

    startXRef.current = e.clientX;
    prevXRef.current = e.clientX;
    totalRef.current = 0;
    targetRef.current = e.target;

    isDraggingRef.current = true;
    setIsDragging(true);

    const startMeta: DragXEvent = {
      clientX: e.clientX,
      startX: e.clientX,
      totalDeltaX: 0,
      target: e.target,
    };
    callbacksRef.current.onDragStart?.(startMeta);

    const move = (ev: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const x = ev.clientX;
        const dx = x - prevXRef.current;
        if (dx === 0) return;
        prevXRef.current = x;
        totalRef.current += dx;

        const meta: DragXEvent = {
          clientX: x,
          startX: startXRef.current,
          totalDeltaX: totalRef.current,
          target: targetRef.current,
        };

        if (callbacksRef.current.preventScrollOnMove) {
          ev.preventDefault();
        }
        callbacksRef.current.onDelta(dx, meta);
      });
    };

    const up = (ev: PointerEvent) => {
      cleanup(ev.clientX);
    };

    const keydown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        cleanup();
      }
    };

    handlersRef.current = { move, up, keydown };

    window.addEventListener("pointermove", move, {
      passive: !preventScrollOnMove,
      capture: true,
    });
    window.addEventListener("pointerup", up, { capture: true });
    window.addEventListener("pointercancel", up, { capture: true });
    window.addEventListener("keydown", keydown, true);
  }, [cleanup, disabled, preventScrollOnMove, primaryButtonOnly]);

  // Ensure listeners are removed if the component unmounts mid-drag.
  React.useEffect(() => {
    return () => {
      if (isDraggingRef.current) cleanup();
    };
  }, [cleanup]);

  return {
    isDragging,
    bind: {
      onPointerDown,
      role: "separator",
      style: { touchAction: "none", cursor: "col-resize", userSelect: "none" },
    },
  };
}
