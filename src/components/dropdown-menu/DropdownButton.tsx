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

const base: string = `mat:inline-flex mat:flex-row mat:items-center mat:gap-3 mat:h-10 mat:px-3 mat:font-[number:var(--font-weight-dropdown-item)] mat:font-[family-name:var(--font-family-base)] mat:ring-0 dropdown-item mat:rounded-[var(--border-radius-menu-item)] mat:cursor-pointer mat:transition-all mat:duration-[var(--control-transition-duration)] mat:select-none mat:focus:outline-none mat:focus:ring-0 mat:border mat:border-transparent mat:bg-transparent`;

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
      { Icon && <Icon className={ 'mat:h-5 mat:w-5 mat:shrink-0' }/> }
      { children }
    </button>
  );
});