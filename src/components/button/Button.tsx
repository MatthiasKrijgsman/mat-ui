import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { Spinner } from "@/spinner/Spinner.tsx";
import type { TablerIcon } from "@tabler/icons-react";

export type Variant = 'primary' | 'secondary' | 'tertiary' | 'white' | 'black' | 'transparent';
export type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
  Icon?: TablerIcon;
}

const base: string = `
  inline-flex flex-row items-center justify-center gap-2
  button-ring font-semibold ring-0 disabled:hover:ring-0 hover:ring-4 active:ring-1
  rounded-[var(--border-radius-input)] 
  cursor-pointer transition-all duration-150 select-none focus:outline-none focus:ring-4
  disabled:cursor-default
  `;

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
    loading = false,
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
      { loading && <Spinner className={'h-5 w-5'} /> }
      { !loading && (<>
        { Icon && <Icon className={ 'h-5 w-5 -ml-2' }/> }
        { children }
      </>) }
    </button>
  );
});
