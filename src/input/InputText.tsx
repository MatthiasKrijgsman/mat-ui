import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";


export type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
}


export const InputText = (props: InputTextProps) => {

  const {
    className,
    label,
    description,
    ...rest
  } = props;

  return (
    <div
      className={ classNames(
        'flex flex-col',
        className
      ) }>
      { label && (
        <label className={'text-gray-900 font-medium mb-1'}>{ label }</label>
      ) }
      <input
        className={ `
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
      />
      { description && (
        <div className={'text-gray-500 text-sm font-medium mt-2'}>{ description }</div>
      ) }
    </div>
  );
};