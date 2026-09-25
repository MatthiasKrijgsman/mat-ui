import * as React from "react";
import { mergeRefs } from "react-merge-refs";
import { classNames } from "@/util/classnames.util.ts";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";

export type InputCheckProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  /** Shows a dash instead of a check — "some, not all". Only settable from JS, so it is a prop. */
  indeterminate?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export const InputCheck = (props: InputCheckProps) => {
  const {
    className,
    label,
    description,
    error,
    indeterminate = false,
    ref,
    ...rest
  } = props;

  const internalRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (internalRef.current) internalRef.current.indeterminate = indeterminate;
  }, [ indeterminate ]);

  return (
    <div
      className={ classNames(
        'mat:flex mat:flex-col',
        className
      ) }
    >
      <div className={ 'mat:flex mat:flex-row mat:gap-3' }>
        <input
          ref={ ref ? mergeRefs([ ref, internalRef ]) : internalRef }
          type={ 'checkbox' }
          aria-invalid={ error ? true : undefined }
          className={ classNames(
            'mat:h-6 mat:w-6 mat:shrink-0 mat:rounded-[var(--border-radius-checkbox)] mat:border-[length:var(--border-width-input)] check-base mat:shadow-[var(--shadow-control)] mat:ring-0 mat:enabled:hover:ring-[length:var(--control-ring-width)] mat:focus:ring-[length:var(--control-ring-width)] mat:ring-offset-0 mat:focus:outline-0 mat:transition-all mat:duration-[var(--control-transition-duration)]',
            error && 'check-error'
          ) }
          { ...rest }
        />
        { label && (
          <label htmlFor={ props.id } className={ classNames(
            'input-label mat:font-[number:var(--font-weight-input-option-label)] mat:mb-1',
            props.id && !props.disabled && 'mat:cursor-pointer',
            props.disabled && 'check-label-disabled mat:cursor-not-allowed'
          ) }>{ label }</label>
        ) }
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};
