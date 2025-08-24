import * as React from "react";
import { Button } from "@/button/Button.tsx";
import { FloatingOverlay, useFloating } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";


export const Dropdown = () => {

  const [ open, setOpen ] = React.useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start'
  });

  return (
    <div>
      <Button
        ref={ refs.setReference }
        onClick={ () => setOpen(!open) }
      >Dropdown</Button>
      <AnimatePresence>
        { open && (<>
          <FloatingOverlay
            onClick={ () => setOpen(!open) }
          />
          <div
            ref={ refs.setFloating }
            style={ floatingStyles }
            className={ 'transform-3d perspective-normal' }
          >
            <motion.div
              className={ 'p-3 bg-white border mt-1 border-gray-200 rounded-xl shadow-2xl origin-top-left perspective-origin-top-left' }
              initial={ { opacity: 0, scale: 0.95, rotateX: -30, } }
              animate={ { opacity: 1, scale: 1.0, rotateX: 0 } }
              exit={ { opacity: 0, scale: 0.95, rotateX: -30, } }
              transition={ { duration: 0.1, ease: 'easeInOut' } }
            >Dropdown Panel
            </motion.div>
          </div>
        </>) }
      </AnimatePresence>
    </div>
  );
};