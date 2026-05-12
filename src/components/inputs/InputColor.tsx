import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
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


type HSV = [number, number, number];

const hexToRgb = (hex: string): [number, number, number] | null => {
  const m = hex.match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const c = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0').toUpperCase();
  return '#' + c(r) + c(g) + c(b);
};

const rgbToHsv = (r: number, g: number, b: number): HSV => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, max === 0 ? 0 : d / max, max];
};

const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh < 1) { r = c; g = x; }
  else if (hh < 2) { r = x; g = c; }
  else if (hh < 3) { g = c; b = x; }
  else if (hh < 4) { g = x; b = c; }
  else if (hh < 5) { r = x; b = c; }
  else { r = c; b = x; }
  const m = v - c;
  return [r + m, g + m, b + m];
};

const hsvToHex = (h: number, s: number, v: number): string => {
  const [r, g, b] = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
};

const hexToHsv = (hex: string): HSV | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsv(rgb[0], rgb[1], rgb[2]);
};

const formatHex = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
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

// Programmatically set an input's value while still triggering React's onChange.
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
    const normalized = (value || '').toUpperCase();
    if (normalized === lastEmittedRef.current) return;
    const parsed = hexToHsv(value);
    if (parsed) setHsv(parsed);
  }, [value]);

  const updateHsv = (next: HSV) => {
    setHsv(next);
    const hex = hsvToHex(next[0], next[1], next[2]);
    lastEmittedRef.current = hex;
    onChange(hex);
  };

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const brightnessRef = useRef<HTMLDivElement>(null);
  const svDragging = useRef(false);
  const hueDragging = useRef(false);
  const brightnessDragging = useRef(false);

  const handleSv = (clientX: number, clientY: number) => {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    updateHsv([hsv[0], x, 1 - y]);
  };

  const handleHue = (clientX: number) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    updateHsv([x * 360, hsv[1], hsv[2]]);
  };

  const handleBrightness = (clientX: number) => {
    if (!brightnessRef.current) return;
    const rect = brightnessRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    updateHsv([hsv[0], hsv[1], x]);
  };

  const [h, s, v] = hsv;
  const hueOnly = hsvToHex(h, 1, 1);
  const brightnessMax = hsvToHex(h, s, 1);
  const currentColor = hsvToHex(h, s, v);

  return (
    <div
      className={ 'flex flex-col gap-3' }
      style={ { width: 220, userSelect: 'none' } }
      onMouseDown={ (e) => e.preventDefault() }
    >
      <div
        ref={ svRef }
        className={ 'relative w-full rounded-md overflow-hidden border color-picker-surface' }
        style={ {
          height: 160,
          backgroundColor: hueOnly,
          touchAction: 'none',
          cursor: 'crosshair',
        } }
        onPointerDown={ (e) => {
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
          svDragging.current = true;
          handleSv(e.clientX, e.clientY);
        } }
        onPointerMove={ (e) => {
          if (svDragging.current) handleSv(e.clientX, e.clientY);
        } }
        onPointerUp={ (e) => {
          svDragging.current = false;
          (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        } }
      >
        <div
          className={ 'absolute inset-0 pointer-events-none' }
          style={ { background: 'linear-gradient(to right, #fff, rgba(255,255,255,0))' } }
        />
        <div
          className={ 'absolute inset-0 pointer-events-none' }
          style={ { background: 'linear-gradient(to top, #000, rgba(0,0,0,0))' } }
        />
        <div
          className={ 'absolute pointer-events-none rounded-full border-2 border-white' }
          style={ {
            width: 14,
            height: 14,
            left: `calc(${ s * 100 }% - 7px)`,
            top: `calc(${ (1 - v) * 100 }% - 7px)`,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
          } }
        />
      </div>

      <div
        ref={ hueRef }
        className={ 'relative w-full rounded-md' }
        style={ {
          height: 12,
          background: 'linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)',
          touchAction: 'none',
          cursor: 'ew-resize',
        } }
        onPointerDown={ (e) => {
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
          hueDragging.current = true;
          handleHue(e.clientX);
        } }
        onPointerMove={ (e) => {
          if (hueDragging.current) handleHue(e.clientX);
        } }
        onPointerUp={ (e) => {
          hueDragging.current = false;
          (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        } }
      >
        <div
          className={ 'absolute pointer-events-none rounded-full border-2 border-white' }
          style={ {
            width: 14,
            height: 14,
            top: -1,
            left: `calc(${ (h / 360) * 100 }% - 7px)`,
            backgroundColor: hueOnly,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
          } }
        />
      </div>

      <div
        ref={ brightnessRef }
        className={ 'relative w-full rounded-md' }
        style={ {
          height: 12,
          background: `linear-gradient(to right, #000, ${ brightnessMax })`,
          touchAction: 'none',
          cursor: 'ew-resize',
        } }
        onPointerDown={ (e) => {
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
          brightnessDragging.current = true;
          handleBrightness(e.clientX);
        } }
        onPointerMove={ (e) => {
          if (brightnessDragging.current) handleBrightness(e.clientX);
        } }
        onPointerUp={ (e) => {
          brightnessDragging.current = false;
          (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        } }
      >
        <div
          className={ 'absolute pointer-events-none rounded-full border-2 border-white' }
          style={ {
            width: 14,
            height: 14,
            top: -1,
            left: `calc(${ v * 100 }% - 7px)`,
            backgroundColor: currentColor,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
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
