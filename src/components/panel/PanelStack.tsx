import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";


export type PanelStackProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
}

export const PanelStack = React.forwardRef<HTMLDivElement, PanelStackProps>((props, ref) => {

  const {
    className,
    children,
    ...rest
  } = props;

  return (
    <div
      ref={ ref }
      className={ classNames(
        'mat:flex mat:flex-col mat:gap-1 mat:border-[length:var(--border-width-input)] panel-base mat:rounded-[var(--border-radius-panel)] mat:shadow-[var(--shadow-control)] mat:p-2',
        className
      ) }
      { ...rest }
    >
      { children }
    </div>
  );
});
