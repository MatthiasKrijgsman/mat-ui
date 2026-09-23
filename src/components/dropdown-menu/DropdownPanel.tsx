import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { Size } from "@/components/button/Button.tsx";

export type DropdownPanelProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  padding?: Size;
}

const baseClassName: string = 'mat:flex mat:flex-col dropdown-panel mat:border-[length:var(--border-width-input)] mat:mt-1 mat:rounded-[var(--border-radius-dropdown)] mat:shadow-[var(--shadow-dropdown)] mat:overflow-x-hidden mat:overflow-y-auto mat:relative mat:space-y-1';

const paddingClasses: Record<Size, string> = {
  sm: 'mat:p-2',
  md: 'mat:p-3',
  lg: 'mat:p-4'
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