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
  inline-flex flex-row items-center justify-center
  button-ring font-[number:var(--font-weight-button)] font-[family-name:var(--font-family-base)] ring-0 disabled:hover:ring-0 hover:ring-[length:var(--control-ring-width)] active:ring-[length:var(--control-ring-width-active)] rounded-full cursor-pointer transition-all duration-[var(--control-transition-duration)] select-none focus:outline-none focus:ring-[length:var(--control-ring-width)]
  disabled:cursor-default
`;

const variantClasses: Record<Variant, string> = {
  primary: 'border-[length:var(--border-width-input)] button-primary shadow-[var(--shadow-control)]',
  secondary: 'border-[length:var(--border-width-input)] button-secondary shadow-[var(--shadow-control)]',
  tertiary: 'border-[length:var(--border-width-input)] button-tertiary',
  white: 'border-[length:var(--border-width-input)] button-white shadow-[var(--shadow-control)]',
  black: 'border-[length:var(--border-width-input)] button-black shadow-[var(--shadow-control)]',
  transparent: 'border-[length:var(--border-width-input)] button-transparent'
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
