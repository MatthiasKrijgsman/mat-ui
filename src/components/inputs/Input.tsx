import * as React from "react";
import { useRef } from "react";
import { mergeRefs } from "react-merge-refs";
import { classNames } from "@/util/classnames.util.ts";
import { type TablerIcon } from "@tabler/icons-react";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { type InputVariant, inputVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizeIconLeftPositionClasses,
  sizePaddingLeftClasses,
  sizePaddingLeftWithIconClasses,
  sizePaddingRightClasses,
  sizePaddingRightWithTrayClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  Icon?: TablerIcon;
  buttonTray?: React.ReactNode;
  size?: Size;
  variant?: InputVariant;
  /**
   * Fixed, non-editable text inside the field on the left (e.g. `/zaken/`
   * before a slug), set off by a vertical rule. With `Icon`, the icon sits
   * in front of the prefix, inside the same segment.
   */
  prefix?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}


export const Input = (props: InputProps) => {

  const {
    className,
    label,
    description,
    Icon,
    error,
    buttonTray,
    size = 'md',
    variant = 'default',
    prefix,
    ref,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const hasTray = !!error || !!buttonTray;
  const hasPrefix = prefix !== undefined && prefix !== null && prefix !== false && prefix !== '';

  const control = 'mat:border-[length:var(--border-width-input)] input-base mat:transition-all mat:duration-[var(--control-transition-duration)] mat:rounded-[var(--border-radius-input)] mat:ring-0 mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)]';
  const numeric = rest.type === 'number' && 'mat:font-[family-name:var(--font-family-numeric)] mat:tabular-nums';

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'mat:flex mat:flex-col',
          className
        ) }>
        <InputLabel htmlFor={ rest.id }>{ label }</InputLabel>
        <div className={ 'mat:flex mat:flex-col mat:relative' }>
          { hasPrefix ? (
            // One bordered control: the muted prefix segment, then the borderless input.
            // The wrapper carries border, radius, variant fill and a focus-within ring.
            <div className={ classNames(
              control,
              'mat:flex mat:flex-row mat:items-stretch mat:overflow-hidden mat:focus-within:ring-[length:var(--control-ring-width)]',
              inputVariantClasses[variant],
              sizeHeightClasses[size],
              sizeFontClasses[size],
              error && 'input-error mat:focus-within:ring-[var(--color-input-ring-error)]',
            ) }>
              <span
                onMouseDown={ (e) => {
                  e.preventDefault();
                  inputRef.current?.focus();
                } }
                className={ classNames(
                  'input-prefix mat:flex mat:shrink-0 mat:flex-row mat:items-center mat:gap-2 mat:whitespace-nowrap mat:select-none mat:cursor-text mat:border-r-[length:var(--border-width-input)]',
                  variant === 'flat' && 'input-prefix-flat',
                  sizePaddingLeftClasses[size],
                  sizePaddingRightClasses[size],
                ) }
              >
                { Icon && (
                  <Icon className={ classNames('input-icon mat:shrink-0', sizeIconClasses[size]) }/>
                ) }
                { prefix }
              </span>
              <input
                ref={ mergeRefs([ inputRef, ref ]) }
                className={ classNames(
                  'mat:flex-1 mat:min-w-0 mat:h-full mat:appearance-none mat:border-0 mat:bg-transparent mat:shadow-none mat:ring-0 mat:rounded-none mat:focus:ring-0 mat:focus:shadow-none mat:focus:outline-none mat:text-[var(--color-input-text)] mat:placeholder:text-[var(--color-input-placeholder)] mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)] mat:py-0',
                  sizeFontClasses[size],
                  sizePaddingLeftClasses[size],
                  hasTray ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
                  numeric,
                ) }
                { ...rest }
              />
            </div>
          ) : (
            <>
              { Icon && (
                <Icon className={ classNames(
                  'input-icon mat:absolute mat:top-1/2 mat:-translate-y-1/2',
                  sizeIconClasses[size],
                  sizeIconLeftPositionClasses[size],
                ) }/>
              ) }
              <input
                ref={ mergeRefs([ inputRef, ref ]) }
                className={ classNames(
                  control,
                  'mat:focus:ring-[length:var(--control-ring-width)] mat:focus:outline-none',
                  inputVariantClasses[variant],
                  sizeHeightClasses[size],
                  sizeFontClasses[size],
                  Icon ? sizePaddingLeftWithIconClasses[size] : sizePaddingLeftClasses[size],
                  hasTray ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
                  // Numbers get their own family and tabular figures (--font-family-numeric)
                  numeric,
                  error && 'input-error',
                ) }
                { ...rest }
              />
            </>
          ) }
          <InputIconButtonTray>
            { error && (
              <InputErrorIcon/>
            ) }
            { buttonTray }
          </InputIconButtonTray>
        </div>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
