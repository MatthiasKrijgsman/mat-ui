import { FloatingOverlay, type Placement, size, useFloating } from "@floating-ui/react";
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
  onOutsideClick?: () => void;
  fullWidth?: boolean;
  minWidth?: number;
};

export const usePopover = (props: UsePopoverProps) => {
  const { placement = "bottom", onOutsideClick, fullWidth, minWidth } = props;

  const middleware = React.useMemo(() => {
    return [
      size({
        apply({ rects, elements }) {
          if (fullWidth) {
            elements.floating.style.width = `${ rects.reference.width }px`;
          }
          if (minWidth) {
            elements.floating.style.minWidth = `${ Math.max(minWidth, rects.reference.width) }px`;
          }
        },
      })
    ];
  }, [ fullWidth, minWidth ]);

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware,
  });

  const latest = React.useRef({
    onOutsideClick,
    floatingStyles,
    setFloating: refs.setFloating,
    placement,
  });
  latest.current = {
    onOutsideClick,
    floatingStyles,
    setFloating: refs.setFloating,
    placement,
  };

  const PopoverBase = React.useMemo(() => {
    const Comp: React.FC<{ open: boolean; children: React.ReactNode, className?: string }> = (
      {
        open,
        children,
        className
      }) => {
      const { floatingStyles, setFloating, onOutsideClick, placement } = latest.current;
      return (
        <AnimatePresence>
          { open && (<>
              { onOutsideClick && (
                <FloatingOverlay
                  onClick={ onOutsideClick }
                />
              ) }
              <div ref={ setFloating } style={ floatingStyles }>
                <motion.div
                  className={ className }
                  style={ { transformOrigin: placementOriginMap[placement] } }
                  initial={ { opacity: 0, scale: 0.9 } }
                  animate={ { opacity: 1, scale: 1 } }
                  exit={ { opacity: 0, scale: 0.9 } }
                  transition={ { duration: 0.1, ease: "easeInOut" } }
                >
                  { children }
                </motion.div>
              </div>
            </>
          ) }
        </AnimatePresence>
      );
    };
    return React.memo(Comp);
  }, []);

  return {
    anchorRef: refs.setReference,
    PopoverBase: PopoverBase,
  };
};
