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
        'flex flex-col',
        className
      ) }
    >
      <div className={ 'flex flex-row gap-3' }>
        <div className={'relative shrink-0 h-6 w-10'}>
          <input
            type={ 'checkbox' }
            className={ 'appearance-none h-6 w-10 rounded-full checked:bg-transparent border border-gray-300 ring-0 hover:ring-4 focus:ring-4 ring-gray-900/10 ring-offset-0 focus:outline-0 transition-all duration-150' }
            { ...rest }
          />
          <div className={classNames(
            'rounded-full absolute border inset-0 mt-[2px] pointer-events-none transition-colors duration-150 ',
            props.checked ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-300'
          )}>
            <div className={classNames(
              'absolute top-1/2 -translate-y-1/2 left-1 h-4 w-4 rounded-full bg-white shadow-md transition-all duration-150',
              props.checked && 'translate-x-3.5 '
            )}/>
          </div>
        </div>
        { label && (
          <label htmlFor={ props.id } className={ classNames(
            'text-gray-900 font-medium mb-1',
            props.id && 'cursor-pointer'
          ) }>{ label }</label>
        ) }
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};