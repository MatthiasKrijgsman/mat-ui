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
  /** Renders a trailing × button that calls this; ignored when `onClick` is set. */
  onRemove?: () => void;
  /** Accessible name of the × button. */
  removeLabel?: string;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>((props: BadgeProps, ref) => {
  const {
    className,
    children,
    onClick,
    showCloseIcon,
    Icon,
    onRemove,
    removeLabel = 'Remove',
    color = 'gray',
  } = props;
  // The font family sits at zero specificity (`:where`) so a consumer's
  // className — e.g. `font-mono` for identifiers — wins regardless of CSS order.
  const classes = classNames(
    'mat:inline-flex mat:align-top mat:items-center mat:gap-2 mat:px-3 mat:h-7 mat:rounded-[var(--border-radius-badge)] mat:font-[number:var(--font-weight-badge)] mat:[:where(&)]:font-[family-name:var(--font-family-base)]',
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
      { onRemove && (
        <button
          type={ 'button' }
          aria-label={ removeLabel }
          title={ removeLabel }
          onClick={ onRemove }
          className={ 'mat:-mr-1.5 mat:inline-flex mat:shrink-0 mat:items-center mat:justify-center mat:h-5 mat:w-5 mat:p-0 mat:appearance-none mat:border-0 mat:bg-transparent mat:text-inherit mat:rounded-full mat:cursor-pointer mat:opacity-60 mat:hover:opacity-100 mat:ring-0 mat:focus:outline-none mat:focus-visible:opacity-100 mat:focus-visible:ring-[length:var(--control-ring-width)] mat:transition-all mat:duration-[var(--control-transition-duration-fast)]' }
        >
          <IconX className={ 'mat:h-3.5 mat:w-3.5' }/>
        </button>
      ) }
    </div>
  );
});