import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type PopoverPanelProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
}

const baseClassName: string = 'flex flex-col bg-white border mt-1 border-gray-200 rounded-xl shadow-lg p-3 overflow-y-auto relative';

export const PopoverPanel = (props: PopoverPanelProps) => {
  const {
    className,
    children,
    ...rest
  } = props;
  return (
    <div
      className={ classNames(baseClassName, className) }
      { ...rest }
    >
      { children }
    </div>
  );
};