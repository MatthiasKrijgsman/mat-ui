import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export interface InputSelectGroupHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const InputSelectGroupHeader = React.forwardRef<HTMLDivElement, InputSelectGroupHeaderProps>((props, ref) => {
  const { children, className, ...rest } = props;
  return (
    <div
      ref={ ref }
      { ...rest }
      className={ classNames(
        'option-group-header mat:px-4 mat:pt-3 mat:pb-1 mat:text-xs mat:font-[number:var(--font-weight-group-header)] mat:uppercase mat:tracking-wide mat:select-none',
        className,
      ) }
    >
      { children }
    </div>
  );
});
