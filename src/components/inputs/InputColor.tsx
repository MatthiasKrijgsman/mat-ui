import * as React from "react";
import { useRef, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { formatHex } from "@/util/color.util.ts";
import { ColorPicker } from "@/components/inputs/ColorPicker.tsx";
import { ColorSwatch } from "@/components/inputs/ColorSwatch.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { type InputVariant, inputVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
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
  variant?: InputVariant;
}


const setInputValueAndNotify = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};


export const InputColor = (props: InputColorProps) => {

  const {
    className,
    label,
    description,
    error,
    buttonTray,
    size = 'md',
    variant = 'default',
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<string>(
    value != null ? String(value) : defaultValue != null ? String(defaultValue) : ''
  );
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = value != null ? String(value) : internalValue;
  const swatchColor = currentValue || 'white';

  useDismiss(open, () => setOpen(false));

  const { anchorRef, Popover } = usePopover({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value);
    onChange?.(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setOpen(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const formatted = formatHex(raw);
    if (formatted && formatted !== raw && inputRef.current) {
      setInputValueAndNotify(inputRef.current, formatted);
    }
    setOpen(false);
    onBlur?.(event);
  };

  const handlePickerChange = (hex: string) => {
    if (inputRef.current) setInputValueAndNotify(inputRef.current, hex);
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
        <div className={ 'flex flex-col relative' } ref={ anchorRef }>
          <ColorSwatch
            color={ swatchColor }
            size={ size }
            className={ classNames(
              'absolute top-1/2 -translate-y-1/2 pointer-events-none',
              sizeIconLeftPositionClasses[size],
            ) }
          />
          <input
            ref={ inputRef }
            className={ classNames(
              'border-[length:var(--border-width-input)] input-base transition-all duration-[var(--control-transition-duration)] rounded-[var(--border-radius-input)] ring-0 focus:ring-[length:var(--control-ring-width)] focus:outline-none font-[number:var(--font-weight-input-text)] font-[family-name:var(--font-family-base)]',
              inputVariantClasses[variant],
              sizeHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftWithIconClasses[size],
              hasTray ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
              error && 'input-error',
            ) }
            value={ value != null ? value : internalValue }
            onChange={ handleChange }
            onFocus={ handleFocus }
            onBlur={ handleBlur }
            onClick={ () => setOpen(true) }
            { ...rest }
          />
          <InputIconButtonTray>
            { error && (
              <InputErrorIcon/>
            ) }
            { buttonTray }
          </InputIconButtonTray>
          <Popover open={ open }>
            <DropdownPanel padding={ 'md' }>
              <ColorPicker value={ currentValue } onChange={ handlePickerChange }/>
            </DropdownPanel>
          </Popover>
        </div>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
