import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import {
  sizeFontClasses,
  sizeMinHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightClasses,
  sizePaddingRightWithTrayClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  size?: Size;
}


export const InputTextArea = (props: InputTextAreaProps) => {

  const {
    className,
    label,
    description,
    error,
    size = 'md',
    ...rest
  } = props;

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'flex flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>
        <div className={ 'flex flex-col relative' }>
          <textarea
            className={ classNames(
              'py-2.5 border input-base transition-all duration-150 rounded-xl shadow-sm ring-0 focus:ring-4 focus:outline-none',
              sizeMinHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              error ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
              error && 'input-error',
            ) }
            { ...rest }
          />
          <InputIconButtonTray className={ 'top-3.5 translate-y-0' }>
            { error && (
              <InputErrorIcon/>
            ) }
          </InputIconButtonTray>
        </div>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
