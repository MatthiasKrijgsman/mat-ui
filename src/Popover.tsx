import * as React from "react";
import type { Placement } from "@floating-ui/react";
import { FloatingOverlay, size, useFloating } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";

export type PopoverProps = {
  placement?: Placement;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  minWidth?: number;
}

const baseClassName: string = 'flex flex-col bg-white border mt-1 border-gray-200 rounded-xl shadow-lg';

const placementOriginMap: Record<Placement, string> = {
  'top': 'bottom center',
  'top-start': 'bottom left',
  'top-end': 'bottom right',

  'right': 'left center',
  'right-start': 'top left',
  'right-end': 'bottom left',

  'bottom': 'top center',
  'bottom-start': 'top left',
  'bottom-end': 'top right',

  'left': 'right center',
  'left-start': 'top right',
  'left-end': 'bottom right',
}

export const Popover = (props: PopoverProps) => {
  const {
    placement = 'bottom',
    children,
    className,
    open,
    setOpen,
    fullWidth,
    minWidth
  } = props;

  const { refs, floatingStyles } = useFloating({
    placement: placement,
    open: open,
    onOpenChange: setOpen,
    middleware: [
      fullWidth && size({
        apply({ rects, elements }) {
          if (minWidth) {
            elements.floating.style.minWidth = `${ Math.max(minWidth, rects.reference.width) }px`;
          } else {
            elements.floating.style.width = `${ rects.reference.width }px`;
          }
        },
      }),
    ],
  });

  return (
    <>
      <div ref={ refs.setReference } className={ className }/>
      <AnimatePresence>
        { open && (<>
          <FloatingOverlay
            onClick={ () => setOpen(!open) }
          />
          <div
            ref={ refs.setFloating }
            style={ floatingStyles }
          >
            <motion.div
              className={ classNames(baseClassName) }
              style={ { transformOrigin: placementOriginMap[placement] } }
              initial={ { opacity: 0, scale: 0.90 } }
              animate={ { opacity: 1, scale: 1.0 } }
              exit={ { opacity: 0, scale: 0.90 } }
              transition={ { duration: 0.1, ease: 'easeInOut' } }
            >
              { children }
            </motion.div>
          </div>
        </>) }
      </AnimatePresence>
    </>
  );
};