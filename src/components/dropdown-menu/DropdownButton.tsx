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

const base: string = `inline-flex flex-row items-center gap-3 h-10 px-3 font-[number:var(--font-weight-dropdown-item)] font-[family-name:var(--font-family-base)] ring-0 dropdown-item rounded-[var(--border-radius-menu-item)] cursor-pointer transition-all duration-[var(--control-transition-duration)] select-none focus:outline-none focus:ring-0 border border-transparent bg-transparent`;

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
      { Icon && <Icon className={ 'h-5 w-5 shrink-0' }/> }
      { children }
    </button>
  );
});