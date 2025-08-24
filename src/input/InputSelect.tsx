import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown } from "@tabler/icons-react";


export type InputSelectProps<T> = React.InputHTMLAttributes<HTMLSelectElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options?: Option<T>[];
}

export type Option<T> = {
  label: string;
  value: T;
  disabled?: boolean;
}


export const InputSelect = <T, >(props: InputSelectProps<T>) => {

  const {
    className,
    label,
    description,
    options,
    ...rest
  } = props;

  return (
    <div
      className={ classNames(
        'flex flex-col',
        className
      ) }>
      { label && (
        <label className={ 'text-gray-900 font-medium mb-1' }>{ label }</label>
      ) }
      <div className={ 'relative flex w-full flex-col' }>
        <select
          className={ `
          appearance-none
          h-12 
          px-4
          border 
          border-gray-200 
          text-gray-900
          placeholder:text-gray-400
          bg-white
          transition-all 
          duration-150
          rounded-xl
          shadow-sm 
          ring-0
          ring-gray-900/10
          focus-visible:ring-4
          focus-visible:outline-none
          ` }
          { ...rest }
        >
          { options && options.map((option, index) => (
            <option
              key={ index }
              value={ String(option.value) }
              disabled={ option.disabled }
            >{ option.label }</option>
          )) }
        </select>
        <IconChevronDown className={ 'h-5 w-5 absolute text-gray-900 top-3.5 right-3' }/>
      </div>
      { description && (
        <div className={ 'text-gray-500 text-sm font-medium mt-2' }>{ description }</div>
      ) }
    </div>
  );
};