import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { Spinner } from "@/spinner/Spinner.tsx";
import type { TablerIcon } from "@tabler/icons-react";
import {
  sizeFontClasses,
  sizeGapClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizePaddingXClasses,
} from "@/control-size/control-size.util.ts";

export type Variant = 'primary' | 'secondary' | 'tertiary' | 'white' | 'black' | 'transparent';
export type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
  Icon?: TablerIcon;
  IconRight?: TablerIcon;
}

const base: string = `
  mat:inline-flex mat:flex-row mat:items-center mat:justify-center
  button-ring mat:font-[number:var(--font-weight-button)] mat:font-[family-name:var(--font-family-base)] mat:ring-0 mat:disabled:hover:ring-0 mat:hover:ring-[length:var(--control-ring-width)] mat:active:ring-[length:var(--control-ring-width-active)]
  mat:rounded-[var(--border-radius-button)]
  mat:cursor-pointer mat:transition-all mat:duration-[var(--control-transition-duration)] mat:select-none mat:focus:outline-none mat:focus:ring-[length:var(--control-ring-width)]
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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

  const {
    variant = 'white',
    size = 'md',
    className,
    children,
    loading = false,
    Icon,
    IconRight,
    ...rest
  } = props;

  return (
    <button
      ref={ ref }
      className={ classNames(
        base,
        variantClasses[variant],
        sizeHeightClasses[size],
        sizePaddingXClasses[size],
        sizeFontClasses[size],
        sizeGapClasses[size],
        className
      ) }
      { ...rest }
    >
      { loading && <Spinner className={ classNames(sizeIconClasses[size]) } /> }
      { !loading && (<>
        { Icon && <Icon className={ classNames(sizeIconClasses[size], 'mat:-ml-1') }/> }
        { children }
        { IconRight && <IconRight className={ classNames(sizeIconClasses[size], 'mat:-mr-1') }/> }
      </>) }
    </button>
  );
});
