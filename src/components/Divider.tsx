import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type DividerProps = {
  vertical?: boolean;
} & React.HTMLAttributes<HTMLHRElement>

export const Divider = (props: DividerProps) => {
  const {
    className,
    vertical = false,
    ...rest
  } = props;
  return (
    <div
      className={ classNames(
        vertical ? 'mat:w-px mat:h-full mat:bg-[var(--color-divider)]' : 'mat:w-full mat:h-px mat:bg-[var(--color-divider)]',
        className
      ) }
      { ...rest }
    />
  );
};