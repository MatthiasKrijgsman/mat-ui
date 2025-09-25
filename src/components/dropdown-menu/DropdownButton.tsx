import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from "@tabler/icons-react";
import { useDropdownDismiss } from "@/components/dropdown-menu/use-dropdown-dismiss.ts";


export type DropdownButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children?: React.ReactNode;
  Icon?: TablerIcon;
  dismissOnClick?: boolean;
}

const base: string = `inline-flex flex-row items-center gap-3 h-10 px-3 font-semibold ring-0 hover:bg-gray-100 active:bg-gray-200 rounded-lg cursor-pointer transition-all duration-150 select-none focus:outline-none focus:ring-0 border border-transparent text-gray-900 bg-transparent ring-gray-900/10`;

export const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>((props, ref) => {
  const {
    className,
    children,
    Icon,
    onClick,
    dismissOnClick = true,
    ...rest
  } = props;

  const { dismiss } = useDropdownDismiss();

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) onClick(e);
    if (dismissOnClick) dismiss();
  }

  return (
    <button
      ref={ ref }
      className={ classNames(
        base,
        className
      ) }
      onClick={ handleOnClick }
      { ...rest }
    >
      { Icon && <Icon className={ 'h-5 w-5' }/> }
      { children }
    </button>
  );
});