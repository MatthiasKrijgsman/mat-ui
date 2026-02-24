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
        vertical ? 'w-px h-full bg-[var(--color-divider)]' : 'w-full h-px bg-[var(--color-divider)]',
        className
      ) }
      { ...rest }
    />
  );
};