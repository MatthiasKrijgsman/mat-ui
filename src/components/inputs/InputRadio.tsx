import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";

export type InputRadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  name?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
}

export const InputRadio = (props: InputRadioProps) => {
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
          type={ 'radio' }
          className={ 'h-6 w-6 shrink-0 rounded-full border border-gray-300 shadow-sm ring-0 hover:ring-4 focus:ring-4 ring-gray-900/10 ring-offset-0 focus:outline-0 transition-all duration-150' }
          { ...rest }
        />
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