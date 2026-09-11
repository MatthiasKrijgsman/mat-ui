import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type InputSelectDividerProps = React.HTMLAttributes<HTMLDivElement>;

export const InputSelectDivider = React.forwardRef<HTMLDivElement, InputSelectDividerProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ ref }
      { ...rest }
      className={ classNames(
        'option-divider mat:my-1 mat:h-px',
        className,
      ) }
    />
  );
});
