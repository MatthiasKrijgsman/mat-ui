import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { type TablerIcon } from "@tabler/icons-react";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";


export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  Icon?: TablerIcon;
  buttonTray?: React.ReactNode;
}


export const Input = (props: InputProps) => {

  const {
    className,
    label,
    description,
    Icon,
    error,
    buttonTray,
    ...rest
  } = props;

  return (
    <div
      className={ classNames(
        'flex flex-col',
        className
      ) }>
      <InputLabel>{ label }</InputLabel>
      <div className={ 'flex flex-col relative' }>
        { Icon && (
          <Icon className={ 'h-5 w-5 text-gray-900/60 absolute left-4 top-1/2 -translate-y-1/2' }/>
        ) }
        <input
          className={ classNames(
            'h-12 border border-gray-200 text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-150 rounded-xl shadow-sm ring-0 ring-gray-900/10 focus:ring-4 focus:outline-none',
            Icon ? 'pl-12 pr-4' : 'px-4',
            error && 'border-red-600 focus:ring-red-600/20 !pr-10',
          ) }
          { ...rest }
        />
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
  );
};