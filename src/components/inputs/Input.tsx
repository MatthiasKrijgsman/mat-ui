import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { type TablerIcon } from "@tabler/icons-react";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { type InputVariant, inputVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizeIconLeftPositionClasses,
  sizePaddingLeftClasses,
  sizePaddingLeftWithIconClasses,
  sizePaddingRightClasses,
  sizePaddingRightWithTrayClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  Icon?: TablerIcon;
  buttonTray?: React.ReactNode;
  size?: Size;
  variant?: InputVariant;
}


export const Input = (props: InputProps) => {

  const {
    className,
    label,
    description,
    Icon,
    error,
    buttonTray,
    size = 'md',
    variant = 'default',
    ...rest
  } = props;

  const hasTray = !!error || !!buttonTray;

  //TODO: set htmlfor on label if id is provided in props

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'flex flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>
        <div className={ 'flex flex-col relative' }>
          { Icon && (
            <Icon className={ classNames(
              'input-icon absolute top-1/2 -translate-y-1/2',
              sizeIconClasses[size],
              sizeIconLeftPositionClasses[size],
            ) }/>
          ) }
          <input
            className={ classNames(
              'border-[length:var(--border-width-input)] input-base transition-all duration-[var(--control-transition-duration)] rounded-[var(--border-radius-input)] ring-0 focus:ring-[length:var(--control-ring-width)] focus:outline-none font-[number:var(--font-weight-input-text)] font-[family-name:var(--font-family-base)]',
              inputVariantClasses[variant],
              sizeHeightClasses[size],
              sizeFontClasses[size],
              Icon ? sizePaddingLeftWithIconClasses[size] : sizePaddingLeftClasses[size],
              hasTray ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
              error && 'input-error',
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
    </ControlSizeContext.Provider>
  );
};
