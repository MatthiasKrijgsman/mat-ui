import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type Variant = 'primary' | 'secondary' | 'tertiary' | 'white' | 'black' | 'transparent';
export type Size = 'sm' | 'md' | 'lg';
import type { TablerIcon } from '@tabler/icons-react';

export type ButtonIconSquareProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  Icon: TablerIcon;
}

const base: string = `inline-flex flex-row items-center justify-center font-semibold ring-0 hover:ring-4 active:ring-1 rounded-xl cursor-pointer transition-all duration-150 select-none focus:outline-none focus:ring-4 aspect-square button-ring`;

const variantClasses: Record<Variant, string> = {
  primary: 'border button-primary shadow-sm',
  secondary: 'border button-secondary shadow-sm',
  tertiary: 'border button-tertiary',
  white: 'border button-white shadow-sm',
  black: 'border button-black shadow-sm',
  transparent: 'border button-transparent'
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14'
}

export const ButtonIconSquare = React.forwardRef<HTMLButtonElement, ButtonIconSquareProps>((props, ref) => {

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
        sizeClasses[size],
        className
      ) }
      { ...rest }
    >
      { <Icon className={'h-5 w-5'} /> }
    </button>
  );
});
