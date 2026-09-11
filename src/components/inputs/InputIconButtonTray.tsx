import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { useControlSize } from "@/control-size/use-control-size.ts";
import { sizeTrayRightPositionClasses } from "@/control-size/control-size.util.ts";

export type InputIconButtonTrayProps = {
  children?: React.ReactNode;
  className?: string;
}

export const InputIconButtonTray = React.forwardRef<HTMLDivElement, InputIconButtonTrayProps>((props, ref) => {
  const {
    children,
    className
  } = props;
  const size = useControlSize();
  return (
    <div
      ref={ ref }
      className={ classNames(
        'mat:absolute mat:top-1/2 mat:-translate-y-1/2 mat:flex mat:flex-row mat:items-center mat:gap-1 mat:pointer-events-none',
        sizeTrayRightPositionClasses[size],
        className
      ) }>
      { children }
    </div>
  );
});
