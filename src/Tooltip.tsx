import * as React from "react";
import { useState } from "react";
import { usePopover } from "@/popover/use-popover.tsx";
import { PopoverPanel } from "@/popover/PopoverPanel.tsx";

export type TooltipProps = {
  children?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
}

export const Tooltip = (props: TooltipProps) => {
  const {
    children,
    content,
    className,
    position = 'top',
    delay = 300,
    maxWidth = 200
  } = props;
  //TODO params above
  const [ open, setOpen ] = useState(false);
  const { anchorRef, Popover } = usePopover({})
  return (
    <span
      ref={ anchorRef }
      className={ className }
      onMouseEnter={ () => setOpen(true) }
      onMouseLeave={ () => setOpen(false) }
    >
        { children }
      <Popover open={ open }>
        <PopoverPanel>
          { content }
        </PopoverPanel>
      </Popover>
      </span>
  );
};