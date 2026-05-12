import * as React from "react";

// Captures the element's rect on pointer-down so subsequent moves can compute
// ratios without forcing layout each frame. Uses pointer capture so events
// continue routing to the source element even when the pointer leaves it.
export const usePointerDrag = (
  onPosition: (clientX: number, clientY: number, rect: DOMRect) => void,
) => {
  const rectRef = React.useRef<DOMRect | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const release = (e: React.PointerEvent) => {
    rectRef.current = null;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return {
    isDragging,
    bind: {
      onPointerDown: (e: React.PointerEvent) => {
        const el = e.currentTarget as HTMLElement;
        rectRef.current = el.getBoundingClientRect();
        el.setPointerCapture?.(e.pointerId);
        setIsDragging(true);
        onPosition(e.clientX, e.clientY, rectRef.current);
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (rectRef.current) onPosition(e.clientX, e.clientY, rectRef.current);
      },
      onPointerUp: release,
      onPointerCancel: release,
    },
  };
};
