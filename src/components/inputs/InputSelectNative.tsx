import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown } from "@tabler/icons-react";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightWithTrayClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputSelectNativeProps = Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options?: OptionNative[];
  error?: string | React.ReactNode;
  size?: Size;
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
        <div className={ 'relative flex w-full flex-col' }>
          <select
            className={ classNames(
              'appearance-none border input-base bg-none transition-all duration-150 rounded-xl shadow-sm ring-0 focus:ring-4 focus:outline-none',
              sizeHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              sizePaddingRightWithTrayClasses[size],
            ) }
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
    </ControlSizeContext.Provider>
  );
};
