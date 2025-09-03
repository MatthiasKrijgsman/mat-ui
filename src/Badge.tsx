import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { BadgeColor, type BadgeColorKey } from "./BadgeColors";

export type BadgeProps = {
  className?: string;
  children?: React.ReactNode;
  color?: BadgeColorKey;
  onClick?: () => void;
}

export const Badge = (props: BadgeProps) => {
  const {
    className,
    children,
    onClick,
    color = 'gray'
  } = props;
  const classes = classNames(
    'inline-block px-3 py-1 rounded-lg font-semibold',
    BadgeColor[color],
    className
  )
  if (onClick) {
    return (
      <button
        className={ classNames('cursor-pointer ring-0 hover:ring-4 active:ring-1 transition-all duration-100 select-none focus:outline-none focus:ring-4', classes) }
        onClick={ onClick }
      >
        { children }
      </button>
    );
  }
  return (
    <div className={ classes }>
      { children }
    </div>
  );
};