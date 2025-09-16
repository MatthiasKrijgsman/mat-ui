import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type Variant = 'primary' | 'secondary' | 'tertiary' | 'white' | 'black' | 'transparent';
export type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
}

const base: string = `inline-flex flex-row items-center button-ring justify-center font-semibold ring-0 hover:ring-4 active:ring-1 rounded-xl cursor-pointer transition-all duration-150 select-none focus:outline-none focus:ring-4 button-ring`;

const variantClasses: Record<Variant, string> = {
  primary: 'border button-primary shadow-sm',
  secondary: 'border button-secondary shadow-sm',
  tertiary: 'border button-tertiary',
  white: 'border button-white shadow-sm',
  black: 'border button-black shadow-sm',
  transparent: 'border button-transparent'
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-10 px-4',
  md: 'h-12 px-6',
  lg: 'h-14 px-8'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

  const {
    variant = 'white',
    size = 'md',
    className,
    children,
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
      { children }
    </button>
  );
});
