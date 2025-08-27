import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type Variant = 'primary' | 'white' | 'black' | 'transparent';
export type Size = 'sm' | 'md' | 'lg';
import type { TablerIcon } from '@tabler/icons-react';

export type ButtonIconSquareProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  Icon: TablerIcon;
}

const base: string = `inline-flex flex-row items-center justify-center font-semibold ring-0 hover:ring-4 active:ring-1 rounded-xl cursor-pointer transition-all duration-150 select-none focus:outline-none focus:ring-4 aspect-square`;

const variantClasses: Record<Variant, string> = {
  primary: 'border border-blue-600 text-white/90 bg-blue-600 active:bg-blue-700 active:border-blue-700 ring-blue-600/10 shadow-sm',
  white: 'border border-gray-200 text-gray-900/70 bg-white active:bg-gray-50 ring-gray-900/10 shadow-sm',
  black: 'border border-gray-950 text-white/90 bg-gray-950 active:bg-gray-800 active:border-gray-800 ring-gray-900/20 shadow-sm',
  transparent: 'border border-transparent text-gray-900/70 bg-transparent ring-gray-900/10'
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