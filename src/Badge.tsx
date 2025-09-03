import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { BadgeColor, type BadgeColorKey } from "./BadgeColors";
import type { TablerIcon } from "@tabler/icons-react";

export type BadgeProps = {
  className?: string;
  children?: React.ReactNode;
  color?: BadgeColorKey;
  onClick?: () => void;
  Icon?: TablerIcon;
}

export const Badge = (props: BadgeProps) => {
  const {
    className,
    children,
    onClick,
    Icon,
    color = 'gray'
  } = props;
  const classes = classNames(
    'inline-block px-3 py-1 rounded-lg font-semibold',
    Icon && 'pl-2.5 pr-3',
    BadgeColor[color],
    className
  )
  if (onClick) {
    return (
      <button
        className={ classNames('cursor-pointer ring-0 hover:ring-4 active:ring-1 transition-all duration-100 select-none focus:outline-none focus:ring-4', classes) }
        onClick={ onClick }
      >
        <div className={'flex flex-row gap-2 items-center'}>
          { Icon && <Icon className={'h-4 w-4'} /> }
          { children }
        </div>
      </button>
    );
  }
  return (
    <div className={ classes }>
      <div className={'flex flex-row gap-2 items-center'}>
        { Icon && <Icon className={'h-4 w-4'} /> }
        { children }
      </div>
    </div>
  );
};