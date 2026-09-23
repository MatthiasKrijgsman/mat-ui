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
import { type InputVariant, inputVariantClasses } from "@/components/inputs/input-variant.util.ts";
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
  variant?: InputVariant;
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
    variant = 'default',
    ...rest
  } = props;

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'mat:flex mat:flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>
        <div className={ 'mat:relative mat:flex mat:w-full mat:flex-col' }>
          <select
            className={ classNames(
              'mat:appearance-none mat:border-[length:var(--border-width-input)] input-base mat:bg-none mat:transition-all mat:duration-[var(--control-transition-duration)] mat:rounded-[var(--border-radius-input)] mat:ring-0 mat:focus:ring-[length:var(--control-ring-width)] mat:focus:outline-none mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)]',
              inputVariantClasses[variant],
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
