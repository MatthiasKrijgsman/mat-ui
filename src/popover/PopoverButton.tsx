import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from "@tabler/icons-react";


export type PopoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children?: React.ReactNode;
  Icon?: TablerIcon;
}

const base: string = `inline-flex flex-row items-center gap-3 h-10 px-3 font-semibold ring-0 hover:bg-gray-100 active:bg-gray-200 rounded-xl cursor-pointer transition-all duration-150 select-none focus:outline-none focus:ring-0 border border-transparent text-gray-900 bg-transparent ring-gray-900/10`;

export const PopoverButton = React.forwardRef<HTMLButtonElement, PopoverButtonProps>((props, ref) => {
  const {
    className,
    children,
    Icon,
    ...rest
  } = props;

  return (
    <button
      ref={ ref }
      className={ classNames(
        base,
        className
      ) }
      { ...rest }
    >
      { Icon && <Icon className={ 'h-5 w-5' }/> }
      { children }
    </button>
  );
});