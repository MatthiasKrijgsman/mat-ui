import { type Placement, size, useFloating } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

const placementOriginMap: Record<Placement, string> = {
  top: "bottom center",
  "top-start": "bottom left",
  "top-end": "bottom right",
  right: "left center",
  "right-start": "top left",
  "right-end": "bottom left",
  bottom: "top center",
  "bottom-start": "top left",
  "bottom-end": "top right",
  left: "right center",
  "left-start": "top right",
  "left-end": "bottom right",
};

export type UsePopoverProps = {
  placement?: Placement;
  open: boolean;
  fullWidth?: boolean;
  minWidth?: number;
};

export const usePopover = (props: UsePopoverProps) => {
  const { placement = "bottom", open, fullWidth, minWidth } = props;

  // Stabilize middleware to avoid re-creating functions every render
  const middleware = React.useMemo(() => {
    if (!fullWidth) return [] as NonNullable<Parameters<typeof useFloating>[0]>["middleware"];
    return [
      size({
        apply({ rects, elements }) {
          if (minWidth) {
            elements.floating.style.minWidth = `${Math.max(minWidth, rects.reference.width)}px`;
          } else {
            elements.floating.style.width = `${rects.reference.width}px`;
          }
        },
      }),
    ];
  }, [fullWidth, minWidth]);

  const { refs, floatingStyles } = useFloating({
    placement,
    // `open` is not needed for positioning; keeping options stable prevents loops
    middleware,
  });

  // Render helper avoids changing component identity and re-mount loops
  const renderPopover = React.useCallback(
    (children: React.ReactNode) => (
      <AnimatePresence>
        {open && (
          <div ref={refs.setFloating} style={floatingStyles}>
            <motion.div
              style={{ transformOrigin: placementOriginMap[placement] }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    ),
    [open, refs.setFloating, floatingStyles, placement]
  );

  return {
    anchorRef: refs.setReference,
    renderPopover,
  };
};
