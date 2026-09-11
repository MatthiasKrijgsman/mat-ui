import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";


export type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>((props, ref) => {

  const {
    className,
    children,
    ...rest
  } = props;

  return (
    <div
      ref={ ref }
      className={ classNames(
        'mat:flex mat:flex-col mat:gap-6 mat:border-[length:var(--border-width-input)] panel-base mat:rounded-[var(--border-radius-panel)] mat:shadow-[var(--shadow-control)] mat:px-6 mat:py-6',
        className
      ) }
      { ...rest }
    >
      { children }
    </div>
  );
});