import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { BadgeColor, type BadgeColorKey } from "./BadgeColors.tsx";
import { IconX, type TablerIcon } from "@tabler/icons-react";

export type BadgeProps = {
  className?: string;
  children?: React.ReactNode;
  color?: BadgeColorKey;
  onClick?: () => void;
  showCloseIcon?: boolean;
  Icon?: TablerIcon;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>((props: BadgeProps, ref) => {
  const {
    className,
    children,
    onClick,
    showCloseIcon,
    Icon,
    color = 'gray',
  } = props;
  const classes = classNames(
    'mat:inline-flex mat:align-top mat:items-center mat:gap-2 mat:px-3 mat:h-7 mat:rounded-[var(--border-radius-badge)] mat:font-[number:var(--font-weight-badge)] mat:font-[family-name:var(--font-family-base)]',
    BadgeColor[color],
    className
  )
  if (onClick) {
    return (
      <div ref={ ref }>
        <button
          className={ classNames('mat:cursor-pointer mat:ring-0 mat:hover:ring-[length:var(--control-ring-width)] mat:active:ring-[length:var(--control-ring-width-active)] mat:transition-all mat:duration-[var(--control-transition-duration-fast)] mat:select-none mat:focus:outline-none mat:focus:ring-[length:var(--control-ring-width)]', classes) }
          onClick={ onClick }
        >
          { Icon && <Icon className={ 'mat:h-4 mat:w-4 mat:shrink-0' }/> }
          <div className={ 'mat:break-all mat:line-clamp-1 mat:text-left' }>{ children }</div>
          { showCloseIcon && (
            <IconX
              className={ 'mat:h-4 mat:w-4 mat:shrink-0' }
            />
          ) }
        </button>
      </div>
    );
  }
  return (
    <div className={ classes } ref={ ref }>
      { Icon && <Icon className={ 'mat:h-4 mat:w-4 mat:shrink-0' }/> }
      <div className={ 'mat:break-all mat:line-clamp-1 mat:text-left' }>{ children }</div>
    </div>
  );
});