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
        vertical ? 'w-px h-full bg-gray-200' : 'w-full h-px bg-gray-200',
        className
      ) }
      { ...rest }
    />
  );
};