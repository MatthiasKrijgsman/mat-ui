import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from '@tabler/icons-react';
import { sizeIconClasses, sizeSquareClasses } from "@/control-size/control-size.util.ts";

export type Variant = 'primary' | 'secondary' | 'tertiary' | 'white' | 'black' | 'transparent';
export type Size = 'sm' | 'md' | 'lg';

export type ButtonIconRoundProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  Icon: TablerIcon;
}

const base: string = `
  mat:inline-flex mat:flex-row mat:items-center mat:justify-center
  button-ring mat:font-[number:var(--font-weight-button)] mat:font-[family-name:var(--font-family-base)] mat:ring-0 mat:disabled:hover:ring-0 mat:hover:ring-[length:var(--control-ring-width)] mat:active:ring-[length:var(--control-ring-width-active)] mat:rounded-full mat:cursor-pointer mat:transition-all mat:duration-[var(--control-transition-duration)] mat:select-none mat:focus:outline-none mat:focus:ring-[length:var(--control-ring-width)]
  mat:disabled:cursor-default
`;

const variantClasses: Record<Variant, string> = {
  primary: 'mat:border-[length:var(--border-width-input)] button-primary mat:shadow-[var(--shadow-control)]',
  secondary: 'mat:border-[length:var(--border-width-input)] button-secondary mat:shadow-[var(--shadow-control)]',
  tertiary: 'mat:border-[length:var(--border-width-input)] button-tertiary',
  white: 'mat:border-[length:var(--border-width-input)] button-white mat:shadow-[var(--shadow-control)]',
  black: 'mat:border-[length:var(--border-width-input)] button-black mat:shadow-[var(--shadow-control)]',
  transparent: 'mat:border-[length:var(--border-width-input)] button-transparent'
}

export const ButtonIconRound = React.forwardRef<HTMLButtonElement, ButtonIconRoundProps>((props, ref) => {

  const {
    variant = 'white',
    size = 'md',
    className,
    Icon,
    ...rest
  } = props;

  return (
    <button
      ref={ ref }
      className={ classNames(
        base,
        variantClasses[variant],
        sizeSquareClasses[size],
        className
      ) }
      { ...rest }
    >
      { <Icon className={ sizeIconClasses[size] } /> }
    </button>
  );
});
