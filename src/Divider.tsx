import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type DividerProps = React.HTMLAttributes<HTMLHRElement>

export const Divider = (props: DividerProps) => {
  const {
    className,
    ...rest
  } = props;
  return (
    <div
      className={ classNames(
        'w-full h-px bg-gray-200',
        className
      ) }
      { ...rest }
    ></div>
  );
};