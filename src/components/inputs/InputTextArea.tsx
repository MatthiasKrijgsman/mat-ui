import * as React from "react";
import { mergeRefs } from "react-merge-refs";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
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
          'flex flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>
        <div className={ 'flex flex-col relative' }>
          <textarea
            ref={ ref ? mergeRefs([ ref, internalRef ]) : internalRef }
            onChange={ handleChange }
            className={ classNames(
              'py-2.5 border-[length:var(--border-width-input)] input-base transition-all duration-[var(--control-transition-duration)] rounded-[var(--border-radius-input)] shadow-[var(--shadow-control)] ring-0 focus:ring-[length:var(--control-ring-width)] focus:outline-none font-[number:var(--font-weight-input-text)] font-[family-name:var(--font-family-base)]',
              sizeMinHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              error ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
              error && 'input-error',
              autogrow && (maxRows
                ? 'resize-none overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                : 'resize-none overflow-hidden'),
            ) }
            { ...rest }
          />
          <InputIconButtonTray className={ 'top-3.5 translate-y-0' }>
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
