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
    'inline-flex align-top items-center gap-2 px-3 h-7 rounded-lg font-semibold',
    BadgeColor[color],
    className
  )
  if (onClick) {
    return (
      <div ref={ ref }>
        <button
          className={ classNames('cursor-pointer ring-0 hover:ring-4 active:ring-1 transition-all duration-100 select-none focus:outline-none focus:ring-4', classes) }
          onClick={ onClick }
        >
          { Icon && <Icon className={ 'h-4 w-4 shrink-0' }/> }
          <div className={ 'break-all line-clamp-1 text-left' }>{ children }</div>
          { showCloseIcon && (
            <IconX
              className={ 'h-4 w-4 shrink-0' }
            />
          ) }
        </button>
      </div>
    );
  }
  return (
    <div className={ classes } ref={ ref }>
      { Icon && <Icon className={ 'h-4 w-4 shrink-0' }/> }
      <div className={ 'break-all line-clamp-1 text-left' }>{ children }</div>
    </div>
  );
});