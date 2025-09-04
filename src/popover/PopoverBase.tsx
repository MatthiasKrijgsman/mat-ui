import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { FloatingOverlay, type Placement } from "@floating-ui/react";
import type { PopoverBaseRefProps, PopoverRendererProps } from "@/popover/use-popover.tsx";

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
};

export type PopoverBaseProps = PopoverRendererProps & PopoverBaseRefProps;

export const PopoverBase: React.FC<PopoverBaseProps> = React.memo(
  ({ open, children, className, onOutsideClick, floatingStyles, setFloating, placement }) => {
    return (
      <AnimatePresence>
        { open && (
          <>
            { onOutsideClick && <FloatingOverlay onClick={ onOutsideClick }/> }
            <div ref={ setFloating } style={ floatingStyles } className={'z-10'}>
              <motion.div
                className={ className }
                style={ { transformOrigin: placementOriginMap[placement] } }
                initial={ { opacity: 0, scale: 0.95 } }
                animate={ { opacity: 1, scale: 1 } }
                exit={ { opacity: 0, scale: 0.95 } }
                transition={ { duration: 0.1, ease: "easeInOut" } }
              >
                { children }
              </motion.div>
            </div>
          </>
        ) }
      </AnimatePresence>
    );
  }
);

