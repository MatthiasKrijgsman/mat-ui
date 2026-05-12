import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { formatHex, hexToHsv, hsvToHex, type HSV } from "@/util/color.util.ts";
import { usePointerDrag } from "@/hooks/use-pointer-drag.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";
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


const HUE_GRADIENT = 'linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)';
const SV_SATURATION_GRADIENT = 'linear-gradient(to right, #fff, rgba(255,255,255,0))';
const SV_VALUE_GRADIENT = 'linear-gradient(to top, #000, rgba(0,0,0,0))';
const THUMB_SHADOW = '0 0 0 1px rgba(0,0,0,0.4)';
const THUMB_SIZE = 14;
const THUMB_HALF = THUMB_SIZE / 2;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const setInputValueAndNotify = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};


type ColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
};

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(value) ?? [0, 0, 1]);
  const lastEmittedRef = useRef<string>(hsvToHex(hsv[0], hsv[1], hsv[2]));

  useEffect(() => {
    if ((value || '').toUpperCase() === lastEmittedRef.current) return;
    const parsed = hexToHsv(value);
    if (parsed) setHsv(parsed);
  }, [value]);

  const updateHsv = (next: HSV) => {
    setHsv(next);
    const hex = hsvToHex(next[0], next[1], next[2]);
    lastEmittedRef.current = hex;
    onChange(hex);
  };

  const [h, s, v] = hsv;
  const hueOnly = hsvToHex(h, 1, 1);
  const brightnessMax = hsvToHex(h, s, 1);
  const currentColor = hsvToHex(h, s, v);

  const svDrag = usePointerDrag((cx, cy, rect) => {
    updateHsv([h, clamp01((cx - rect.left) / rect.width), 1 - clamp01((cy - rect.top) / rect.height)]);
  });
  const hueDrag = usePointerDrag((cx, _cy, rect) => {
    updateHsv([clamp01((cx - rect.left) / rect.width) * 360, s, v]);
  });
  const brightnessDrag = usePointerDrag((cx, _cy, rect) => {
    updateHsv([h, s, clamp01((cx - rect.left) / rect.width)]);
  });

  return (
    <div
      className={ 'flex flex-col gap-3' }
      style={ { width: 220, userSelect: 'none' } }
      onMouseDown={ (e) => e.preventDefault() }
    >
      <div
        className={ 'relative w-full rounded-md overflow-hidden border color-picker-surface' }
        style={ {
          height: 160,
          backgroundColor: hueOnly,
          touchAction: 'none',
          cursor: 'crosshair',
        } }
        { ...svDrag }
      >
        <div
          className={ 'absolute inset-0 pointer-events-none' }
          style={ { background: SV_SATURATION_GRADIENT } }
        />
        <div
          className={ 'absolute inset-0 pointer-events-none' }
          style={ { background: SV_VALUE_GRADIENT } }
        />
        <div
          className={ 'absolute pointer-events-none rounded-full border-2 border-white' }
          style={ {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            left: `calc(${ s * 100 }% - ${ THUMB_HALF }px)`,
            top: `calc(${ (1 - v) * 100 }% - ${ THUMB_HALF }px)`,
            boxShadow: THUMB_SHADOW,
          } }
        />
      </div>

      <div
        className={ 'relative w-full rounded-md' }
        style={ {
          height: 12,
          background: HUE_GRADIENT,
          touchAction: 'none',
          cursor: 'ew-resize',
        } }
        { ...hueDrag }
      >
        <div
          className={ 'absolute pointer-events-none rounded-full border-2 border-white' }
          style={ {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            top: -1,
            left: `calc(${ (h / 360) * 100 }% - ${ THUMB_HALF }px)`,
            backgroundColor: hueOnly,
            boxShadow: THUMB_SHADOW,
          } }
        />
      </div>

      <div
        className={ 'relative w-full rounded-md' }
        style={ {
          height: 12,
          background: `linear-gradient(to right, #000, ${ brightnessMax })`,
          touchAction: 'none',
          cursor: 'ew-resize',
        } }
        { ...brightnessDrag }
      >
        <div
          className={ 'absolute pointer-events-none rounded-full border-2 border-white' }
          style={ {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            top: -1,
            left: `calc(${ v * 100 }% - ${ THUMB_HALF }px)`,
            backgroundColor: currentColor,
            boxShadow: THUMB_SHADOW,
          } }
        />
      </div>
    </div>
  );
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
    onOutsideClick: () => setOpen(false),
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
          <div
            className={ classNames(
              'absolute top-1/2 -translate-y-1/2 rounded-md border color-swatch',
              sizeIconClasses[size],
              sizeIconLeftPositionClasses[size],
            ) }
            style={ { backgroundColor: swatchColor } }
          />
          <input
            ref={ inputRef }
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
            <DropdownPanel>
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
