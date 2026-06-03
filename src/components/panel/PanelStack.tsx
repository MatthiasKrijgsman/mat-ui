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
        'flex flex-col gap-1 border-[length:var(--border-width-input)] panel-base rounded-[var(--border-radius-panel)] shadow-[var(--shadow-control)] p-2',
        className
      ) }
      { ...rest }
    >
      { children }
    </div>
  );
});
