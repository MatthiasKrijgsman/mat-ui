import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";

export type InputCheckProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
}

export const InputCheck = (props: InputCheckProps) => {
  const {
    className,
    label,
    description,
    error,
    ...rest
  } = props;
  return (
    <div
      className={ classNames(
        'flex flex-col',
        className
      ) }
    >
      <div className={ 'flex flex-row gap-3' }>
        <input
          type={ 'checkbox' }
          className={ 'h-6 w-6 shrink-0 rounded-[var(--border-radius-checkbox)] border-[length:var(--border-width-input)] check-base shadow-[var(--shadow-control)] ring-0 hover:ring-[length:var(--control-ring-width)] focus:ring-[length:var(--control-ring-width)] ring-offset-0 focus:outline-0 transition-all duration-[var(--control-transition-duration)]' }
          { ...rest }
        />
        { label && (
          <label htmlFor={ props.id } className={ classNames(
            'input-label font-[number:var(--font-weight-input-option-label)] mb-1',
            props.id && 'cursor-pointer'
          ) }>{ label }</label>
        ) }
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};
