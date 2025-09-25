import * as React from "react";
import { useState } from "react";
import { usePopover } from "@/popover/use-popover.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import type { Placement } from "@floating-ui/react";

export type TooltipProps = {
  children?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  placement?: Placement;
  minWidth?: number;
  maxWidth?: number;
}

export const Tooltip = (props: TooltipProps) => {
  const {
    children,
    content,
    className,
    placement = 'top',
    minWidth = 100,
    maxWidth = 200
  } = props;
  //TODO params above
  const [ open, setOpen ] = useState(false);
  const { anchorRef, Popover } = usePopover({
    placement: placement,
    minWidth: minWidth,
    maxWidth: maxWidth,
  })
  return (
    <span
      ref={ anchorRef }
      className={ className }
      onMouseEnter={ () => setOpen(true) }
      onMouseLeave={ () => setOpen(false) }
    >
      { children }
      <Popover open={ open }>
        <DropdownPanel>
          { content }
        </DropdownPanel>
      </Popover>
      </span>
  );
};