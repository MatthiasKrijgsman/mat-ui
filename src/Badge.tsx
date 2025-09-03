import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { BadgeColor, type BadgeColorKey } from "./BadgeColors";
import { IconX, type TablerIcon } from "@tabler/icons-react";

export type BadgeProps = {
  className?: string;
  children?: React.ReactNode;
  color?: BadgeColorKey;
  onClick?: () => void;
  showCloseIcon?: boolean;
  Icon?: TablerIcon;
}

export const Badge = (props: BadgeProps) => {
  const {
    className,
    children,
    onClick,
    showCloseIcon,
    Icon,
    color = 'gray'
  } = props;
  const classes = classNames(
    'inline-flex align-top items-center gap-2 px-3 h-8 rounded-xl font-semibold',
    BadgeColor[color],
    className
  )
  if (onClick) {
    return (
      <button
        className={ classNames('cursor-pointer ring-0 hover:ring-4 active:ring-1 transition-all duration-100 select-none focus:outline-none focus:ring-4', classes) }
        onClick={ onClick }
      >
        { Icon && <Icon className={ 'h-4 w-4 shrink-0' }/> }
        { children }
        { showCloseIcon && (
          <IconX
            className={ 'h-4 w-4 shrink-0' }
          />
        ) }
      </button>
    );
  }
  return (
    <div className={ classes }>
      { Icon && <Icon className={ 'h-4 w-4 shrink-0' }/> }
      { children }
    </div>
  );
};