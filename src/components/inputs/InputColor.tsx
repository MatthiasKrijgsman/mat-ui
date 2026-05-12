import * as React from "react";
import { useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizeIconLeftPositionClasses,
  sizePaddingLeftWithIconClasses,
  sizePaddingRightClasses,
  sizePaddingRightWithTrayClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputColorProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  buttonTray?: React.ReactNode;
  size?: Size;
}


const formatHex = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    return '#' + hex.toUpperCase();
  }

  if (typeof document === 'undefined') return null;

  const probe = document.createElement('div');
  probe.style.color = trimmed;
  if (!probe.style.color) return null;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);

  const rgb = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgb) return null;
  return '#' + [rgb[1], rgb[2], rgb[3]]
    .map(n => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
};


export const InputColor = (props: InputColorProps) => {

  const {
    className,
    label,
    description,
    error,
    buttonTray,
    size = 'md',
    value,
    defaultValue,
    onChange,
    onBlur,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<string>(
    value != null ? String(value) : defaultValue != null ? String(defaultValue) : ''
  );

  const currentValue = value != null ? String(value) : internalValue;
  const swatchColor = currentValue || 'white';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value);
    onChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const formatted = formatHex(raw);
    if (formatted && formatted !== raw) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(event.target, formatted);
      event.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
    onBlur?.(event);
  };

  const hasTray = !!error || !!buttonTray;

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'flex flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>
        <div className={ 'flex flex-col relative' }>
          <div
            className={ classNames(
              'absolute top-1/2 -translate-y-1/2 rounded-md border border-black/10',
              sizeIconClasses[size],
              sizeIconLeftPositionClasses[size],
            ) }
            style={ { backgroundColor: swatchColor } }
          />
          <input
            className={ classNames(
              'border input-base transition-all duration-150 rounded-xl shadow-sm ring-0 focus:ring-4 focus:outline-none',
              sizeHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftWithIconClasses[size],
              hasTray ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
              error && 'input-error',
            ) }
            value={ value != null ? value : internalValue }
            onChange={ handleChange }
            onBlur={ handleBlur }
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
