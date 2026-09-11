import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconCheck } from "@tabler/icons-react";

export interface InputSelectOptionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export const InputSelectOption = React.forwardRef<HTMLDivElement, InputSelectOptionProps>((props, ref) => {
  const {
    children,
    onClick,
    selected,
    disabled = false,
    active = false,
    className,
    ...rest
  } = props;

  return (
    <div
      ref={ ref }
      { ...rest }
      onClick={ () => !disabled && onClick && onClick() }
      className={ classNames(
        'option-base mat:px-4 mat:py-2 mat:rounded-[var(--border-radius-option)] mat:cursor-pointer mat:transition-all mat:duration-[var(--control-transition-duration)] mat:select-none mat:flex mat:flex-row mat:gap-3 mat:items-center',
        (selected && !disabled) && 'option-selected',
        (active && !disabled) && 'option-active',
        disabled && 'option-disabled mat:cursor-not-allowed mat:hover:bg-transparent mat:active:bg-transparent',
        className,
      ) }
    >
      <div className={ 'mat:flex-1 mat:min-w-0 mat:break-all mat:line-clamp-1' }>{ children }</div>
      { (selected && !disabled) && (
        <div className={ 'mat:shrink-0' }>
          <IconCheck className={ 'mat:h-5 mat:w-5' }/>
        </div>
      ) }
    </div>
  );
});
