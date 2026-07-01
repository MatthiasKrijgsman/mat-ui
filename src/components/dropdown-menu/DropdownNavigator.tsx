import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronLeft } from "@tabler/icons-react";
import { DropdownButton } from "@/components/dropdown-menu/DropdownButton.tsx";
import { DropdownDrilldownContext, type DropdownDrilldownLevel } from "@/components/dropdown-menu/use-dropdown-drilldown.ts";

export type DropdownNavigatorProps = {
  open: boolean;
  children?: React.ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction >= 0 ? '35%' : '-35%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? '-35%' : '35%', opacity: 0 }),
};

export const DropdownNavigator = (props: DropdownNavigatorProps) => {
  const { open, children } = props;
  const [ stack, setStack ] = useState<DropdownDrilldownLevel[]>([]);
  const [ direction, setDirection ] = useState<number>(1);

  // Reset the drill-down stack whenever the menu closes so it reopens at the root level.
  useEffect(() => {
    if (!open) setStack([]);
  }, [open]);

  const push = useCallback((level: DropdownDrilldownLevel) => {
    setDirection(1);
    setStack((prev) => [ ...prev, level ]);
  }, []);

  const pop = useCallback(() => {
    setDirection(-1);
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const reset = useCallback(() => {
    setDirection(-1);
    setStack([]);
  }, []);

  const current = stack[stack.length - 1];
  const levelKey = current ? current.id : '__root__';
  const content = current ? current.content : children;

  return (
    <DropdownDrilldownContext.Provider value={ { push, pop, reset, depth: stack.length } }>
      { /* Clip the horizontal slide, but scroll vertically so a height-capped
           parent (e.g. InputSelectDrilldown's maxHeight) scrolls instead of
           clipping — `overflow` also gives this flex child min-height:0 so it
           shrinks to the cap and becomes the scroll container. */ }
      <div className={ 'flex flex-col overflow-x-hidden overflow-y-auto' }>
        <AnimatePresence initial={ false } mode={ 'wait' } custom={ direction }>
          <motion.div
            key={ levelKey }
            custom={ direction }
            variants={ slideVariants }
            initial={ 'enter' }
            animate={ 'center' }
            exit={ 'exit' }
            transition={ { duration: 0.15, ease: 'easeInOut' } }
            className={ 'flex flex-col space-y-1 p-2' }
          >
            { current && (
              <DropdownButton dismissOnClick={ false } Icon={ IconChevronLeft } onClick={ pop } className={ 'mb-1' }>
                <span className={ 'flex-1 text-left font-[number:var(--font-weight-group-header)]' }>{ current.label }</span>
              </DropdownButton>
            ) }
            { content }
          </motion.div>
        </AnimatePresence>
      </div>
    </DropdownDrilldownContext.Provider>
  );
};
