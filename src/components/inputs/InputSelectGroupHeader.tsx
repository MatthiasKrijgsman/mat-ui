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
        'option-group-header px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide select-none',
        className,
      ) }
    >
      { children }
    </div>
  );
});
