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
        'flex flex-col gap-6 border-[length:var(--border-width-input)] panel-base rounded-[var(--border-radius-panel)] shadow-[var(--shadow-control)] px-6 py-6',
        className
      ) }
      { ...rest }
    >
      { children }
    </div>
  );
});