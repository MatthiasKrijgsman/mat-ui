import * as React from "react";
import { mergeRefs } from "react-merge-refs";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { type InputVariant, inputVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeMinHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightClasses,
  sizePaddingRightWithTrayClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  size?: Size;
  variant?: InputVariant;
  autogrow?: boolean;
  maxRows?: number;
  ref?: React.Ref<HTMLTextAreaElement>;
}


export const InputTextArea = (props: InputTextAreaProps) => {

  const {
    className,
    label,
    description,
    error,
    size = 'md',
    variant = 'default',
    autogrow = false,
    maxRows,
    ref,
    onChange,
    ...rest
  } = props;

  const internalRef = React.useRef<HTMLTextAreaElement>(null);

  const resize = React.useCallback(() => {
    const el = internalRef.current;
    if (!el) return;
    el.style.height = 'auto';

    let targetHeight = el.scrollHeight;

    if (maxRows) {
      const styles = window.getComputedStyle(el);
      const lineHeight = parseFloat(styles.lineHeight);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      const borderTop = parseFloat(styles.borderTopWidth);
      const borderBottom = parseFloat(styles.borderBottomWidth);
      const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom + borderTop + borderBottom;
      targetHeight = Math.min(el.scrollHeight, maxHeight);
    }

    el.style.height = `${ targetHeight }px`;
  }, [ maxRows ]);

  React.useLayoutEffect(() => {
    if (!autogrow) {
      if (internalRef.current) {
        internalRef.current.style.height = '';
      }
      return;
    }
    resize();
  }, [ autogrow, resize, props.value, props.defaultValue, size ]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    if (autogrow) resize();
  };

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'mat:flex mat:flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>
        <div className={ 'mat:flex mat:flex-col mat:relative' }>
          <textarea
            ref={ ref ? mergeRefs([ ref, internalRef ]) : internalRef }
            onChange={ handleChange }
            className={ classNames(
              'mat:py-2.5 mat:border-[length:var(--border-width-input)] input-base mat:transition-all mat:duration-[var(--control-transition-duration)] mat:rounded-[var(--border-radius-input)] mat:ring-0 mat:focus:ring-[length:var(--control-ring-width)] mat:focus:outline-none mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)]',
              inputVariantClasses[variant],
              sizeMinHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              error ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
              error && 'input-error',
              autogrow && (maxRows
                ? 'mat:resize-none mat:overflow-y-auto mat:[scrollbar-width:none] mat:[&::-webkit-scrollbar]:hidden'
                : 'mat:resize-none mat:overflow-hidden'),
            ) }
            { ...rest }
          />
          <InputIconButtonTray className={ 'mat:top-3.5 mat:translate-y-0' }>
            { error && (
              <InputErrorIcon/>
            ) }
          </InputIconButtonTray>
        </div>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
