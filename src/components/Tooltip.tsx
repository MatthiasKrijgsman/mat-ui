import * as React from "react";
import { useState } from "react";
import { usePopover } from "@/popover/use-popover.tsx";
import { classNames } from "@/util/classnames.util.ts";
import type { Placement } from "@floating-ui/react";

export type TooltipProps = {
  children?: React.ReactNode;
  content: React.ReactNode;
  /** Class for the anchor wrapper around `children`. */
  className?: string;
  /** Class for the tooltip panel itself. */
  contentClassName?: string;
  placement?: Placement;
  minWidth?: number;
  maxWidth?: number;
  /** Milliseconds to wait before showing on hover/focus. */
  delay?: number;
  /** Distance in pixels between the anchor and the tooltip. */
  offset?: number;
}

/* The panel is a dedicated tokenized surface (see tokens.css "Tooltip"):
 * every default resolves to the dropdown-panel values the tooltip used
 * before it had its own tokens, so overriding nothing changes nothing. */
const panelClasses =
  'tooltip-panel flex flex-col border-[length:var(--border-width-tooltip)] ' +
  'rounded-[var(--border-radius-tooltip)] shadow-[var(--shadow-tooltip)] ' +
  'px-[var(--tooltip-padding-x)] py-[var(--tooltip-padding-y)] overflow-hidden';

export const Tooltip = (props: TooltipProps) => {
  const {
    children,
    content,
    className,
    contentClassName,
    placement = 'top',
    minWidth = 100,
    maxWidth = 200,
    delay = 0,
    offset = 4,
  } = props;
  const [ open, setOpen ] = useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const { anchorRef, Popover } = usePopover({
    placement: placement,
    minWidth: minWidth,
    maxWidth: maxWidth,
    offset: offset,
  })

  const clearShowTimeout = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const handleShow = () => {
    clearShowTimeout();
    if (delay > 0) {
      timeoutRef.current = window.setTimeout(() => setOpen(true), delay);
    } else {
      setOpen(true);
    }
  };
  const handleHide = () => {
    clearShowTimeout();
    setOpen(false);
  };
  React.useEffect(() => clearShowTimeout, []);

  return (
    <span
      ref={ anchorRef }
      className={ className }
      onMouseEnter={ handleShow }
      onMouseLeave={ handleHide }
      onFocus={ handleShow }
      onBlur={ handleHide }
    >
      { children }
      <Popover open={ open }>
        <div role="tooltip" className={ classNames(panelClasses, contentClassName) }>
          { content }
        </div>
      </Popover>
    </span>
  );
};
