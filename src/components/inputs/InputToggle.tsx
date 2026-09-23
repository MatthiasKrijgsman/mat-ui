import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";

export type InputToggleProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
}

export const InputToggle = (props: InputToggleProps) => {
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
        'mat:flex mat:flex-col',
        className
      ) }
    >
      <div className={ 'mat:flex mat:flex-row mat:gap-3' }>
        <div className={'mat:relative mat:shrink-0 mat:h-6 mat:w-10'}>
          <input
            type={ 'checkbox' }
            className={ 'mat:appearance-none mat:absolute mat:inset-0 mat:h-6 mat:w-10 mat:rounded-full mat:checked:bg-transparent mat:border-0 toggle-input mat:ring-0 mat:hover:ring-[length:var(--control-ring-width)] mat:focus:ring-[length:var(--control-ring-width)] mat:ring-offset-0 mat:focus:outline-0 mat:transition-all mat:duration-[var(--control-transition-duration)]' }
            { ...rest }
          />
          <div className={classNames(
            'mat:rounded-full mat:absolute mat:border mat:inset-0 mat:pointer-events-none mat:transition-colors mat:duration-[var(--control-transition-duration)] ',
            props.checked ? 'toggle-track-on' : 'toggle-track-off'
          )}>
            <div className={classNames(
              'mat:absolute mat:top-1/2 mat:-translate-y-1/2 mat:left-1 mat:h-4 mat:w-4 mat:rounded-full toggle-thumb mat:shadow-md mat:transition-all mat:duration-[var(--control-transition-duration)]',
              props.checked && 'mat:translate-x-3.5 '
            )}/>
          </div>
        </div>
        { label && (
          <label htmlFor={ props.id } className={ classNames(
            'input-label mat:font-[number:var(--font-weight-input-option-label)] mat:mb-1',
            props.id && 'mat:cursor-pointer'
          ) }>{ label }</label>
        ) }
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};