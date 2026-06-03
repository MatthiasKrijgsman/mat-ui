import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { Size } from "@/components/button/Button.tsx";

export type DropdownPanelProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  padding?: Size;
}

const baseClassName: string = 'flex flex-col dropdown-panel border-[length:var(--border-width-input)] mt-1 rounded-[var(--border-radius-dropdown)] shadow-[var(--shadow-dropdown)] overflow-y-auto relative space-y-1';

const paddingClasses: Record<Size, string> = {
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4'
}

export const DropdownPanel = (props: DropdownPanelProps) => {
  const {
    className,
    children,
    padding = 'md',
    ...rest
  } = props;
  return (
    <div
      className={ classNames(baseClassName, paddingClasses[padding], className) }
      { ...rest }
    >
      { children }
    </div>
  );
};