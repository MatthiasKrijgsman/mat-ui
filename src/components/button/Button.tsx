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
  inline-flex flex-row items-center justify-center
  button-ring font-[number:var(--font-weight-button)] font-[family-name:var(--font-family-base)] ring-0 disabled:hover:ring-0 hover:ring-[length:var(--control-ring-width)] active:ring-[length:var(--control-ring-width-active)]
  rounded-[var(--border-radius-button)]
  cursor-pointer transition-all duration-[var(--control-transition-duration)] select-none focus:outline-none focus:ring-[length:var(--control-ring-width)]
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
        { Icon && <Icon className={ classNames(sizeIconClasses[size], '-ml-1') }/> }
        { children }
        { IconRight && <IconRight className={ classNames(sizeIconClasses[size], '-mr-1') }/> }
      </>) }
    </button>
  );
});
