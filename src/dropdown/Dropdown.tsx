import * as React from "react";
import type { Placement } from "@floating-ui/react";
import { FloatingOverlay, size, useFloating } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";

export type DropdownProps = {
  placement?: Placement;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const baseClassName: string = 'flex flex-col bg-white border mt-1 border-gray-200 rounded-xl shadow-lg';

export const Dropdown = (props: DropdownProps) => {
  const {
    placement = 'bottom-start',
    children,
    className,
    open,
    setOpen
  } = props;

  const { refs, floatingStyles } = useFloating({
    placement: placement,
    open: open,
    onOpenChange: setOpen,
    middleware: [
      size({
        apply({ rects, elements }) {
          elements.floating.style.width = `${ rects.reference.width }px`;
        },
      }),
    ],
  });

  //TODO: Add proper origin based on placement

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
              className={ classNames(baseClassName, 'origin-top-left') }
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