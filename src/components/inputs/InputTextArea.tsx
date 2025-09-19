import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";


export type InputTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
}


export const InputTextArea = (props: InputTextAreaProps) => {

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
      ) }>
      <InputLabel>{ label }</InputLabel>
      <div className={ 'flex flex-col relative' }>
        <textarea
          className={ classNames(
            'px-4 py-2.5 min-h-12 border border-gray-200 text-gray-900 placeholder:text-gray-400 bg-white transition-colors duration-150 rounded-xl shadow-sm ring-0 ring-gray-900/10 focus:ring-4 focus:outline-none',
            error && 'border-red-600 focus:ring-red-600/20 !pr-10',
          ) }
          { ...rest }
        />
        <InputIconButtonTray className={'top-3.5 translate-y-0'}>
          { error && (
            <InputErrorIcon/>
          ) }
        </InputIconButtonTray>
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};