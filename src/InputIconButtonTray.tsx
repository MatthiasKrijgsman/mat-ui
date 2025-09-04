import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type InputIconButtonTrayProps = {
  children?: React.ReactNode;
  className?: string;
}

export const InputIconButtonTray = (props: InputIconButtonTrayProps) => {
  const {
    children,
    className
  } = props;
  return (
    <div className={ classNames(
      'absolute top-1/2 -translate-y-1/2 right-3.5 flex flex-row items-center gap-1',
      className
    ) }>
      { children }
    </div>
  );
};