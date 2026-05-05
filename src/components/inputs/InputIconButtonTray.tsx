import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { useControlSize } from "@/control-size/use-control-size.ts";
import { sizeTrayRightPositionClasses } from "@/control-size/control-size.util.ts";

export type InputIconButtonTrayProps = {
  children?: React.ReactNode;
  className?: string;
}

export const InputIconButtonTray = (props: InputIconButtonTrayProps) => {
  const {
    children,
    className
  } = props;
  const size = useControlSize();
  return (
    <div className={ classNames(
      'absolute top-1/2 -translate-y-1/2 flex flex-row items-center gap-1',
      sizeTrayRightPositionClasses[size],
      className
    ) }>
      { children }
    </div>
  );
};
