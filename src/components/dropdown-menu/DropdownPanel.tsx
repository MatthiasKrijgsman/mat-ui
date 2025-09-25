import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { Size } from "@/components/button/Button.tsx";

export type DropdownPanelProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  padding?: Size;
}

const baseClassName: string = 'flex flex-col bg-white border mt-1 border-gray-200 rounded-xl shadow-lg overflow-y-auto relative space-y-1';

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