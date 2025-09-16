import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown } from "@tabler/icons-react";
import { InputLabel } from "@/components/InputLabel.tsx";
import { InputDescription } from "@/components/InputDescription.tsx";
import { InputError } from "@/components/InputError.tsx";
import { InputErrorIcon } from "@/components/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/InputIconButtonTray.tsx";


export type InputSelectNativeProps = React.InputHTMLAttributes<HTMLSelectElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options?: OptionNative[];
  error?: string | React.ReactNode;
}

export type OptionNative = {
  label: string;
  value: string;
  disabled?: boolean;
}


export const InputSelectNative = (props: InputSelectNativeProps) => {

  const {
    className,
    label,
    description,
    options,
    error,
    ...rest
  } = props;

  return (
    <div
      className={ classNames(
        'flex flex-col',
        className
      ) }>
      <InputLabel>{ label }</InputLabel>
      <div className={ 'relative flex w-full flex-col' }>
        <select
          className={ `
          appearance-none
          h-12 
          pl-4
          pr-10
          border 
          border-gray-200 
          text-gray-900
          placeholder:text-gray-400
          bg-white
          bg-none
          transition-all 
          duration-150
          rounded-xl
          shadow-sm 
          ring-0
          ring-gray-900/10
          focus:ring-4
          focus:outline-none
          ` }
          { ...rest }
        >
          { options && options.map((option, index) => (
            <option
              key={ index }
              value={ option.value }
              disabled={ option.disabled }
            >{ option.label }</option>
          )) }
        </select>
        <InputIconButtonTray>
          { error && (
            <InputErrorIcon/>
          ) }
          <InputIconButton Icon={ IconChevronDown }/>
        </InputIconButtonTray>
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};