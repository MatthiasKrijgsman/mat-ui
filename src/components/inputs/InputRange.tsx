import * as React from "react";
import { useRef, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { usePointerDrag } from "@/hooks/use-pointer-drag.ts";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { sizeHeightClasses, sizeIconClasses } from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputRangeProps = {
  id?: string;
  name?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  size?: Size;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  /** Render the current value at the end of the track. */
  showValue?: boolean;
  /** Format the value for `showValue` (defaults to `String`). */
  formatValue?: (value: number) => React.ReactNode;
}

const sizeTrackHeightClasses: Record<Size, string> = {
  sm: 'mat:h-[var(--control-size-sm-range-track)]',
  md: 'mat:h-[var(--control-size-md-range-track)]',
  lg: 'mat:h-[var(--control-size-lg-range-track)]',
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/* Snap to the step grid and trim float noise (0.1 + 0.2 style artifacts). */
const snap = (raw: number, min: number, max: number, step: number) => {
  const stepped = min + Math.round((raw - min) / step) * step;
  const decimals = (String(step).split('.')[1] ?? '').length;
  return clamp(Number(stepped.toFixed(decimals)), min, max);
};


export const InputRange = (props: InputRangeProps) => {

  const {
    id,
    name,
    className,
    label,
    description,
    error,
    size = 'md',
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    disabled = false,
    showValue = false,
    formatValue,
  } = props;

  const [ internalValue, setInternalValue ] = useState<number>(
    value ?? defaultValue ?? min
  );
  const thumbRef = useRef<HTMLDivElement>(null);

  const currentValue = clamp(value ?? internalValue, min, max);
  const ratio = max > min ? (currentValue - min) / (max - min) : 0;

  const commit = (next: number) => {
    if (next === currentValue) return;
    setInternalValue(next);
    onChange?.(next);
  };

  const drag = usePointerDrag((clientX, _clientY, rect) => {
    const raw = min + ((clientX - rect.left) / rect.width) * (max - min);
    commit(snap(raw, min, max, step));
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = snap(currentValue + step, min, max, step);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = snap(currentValue - step, min, max, step);
    else if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    if (next == null) return;
    event.preventDefault();
    commit(next);
  };

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'mat:flex mat:flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>
        <div className={ classNames(
          'mat:flex mat:flex-row mat:items-center mat:gap-3',
          sizeHeightClasses[size],
          disabled && 'mat:opacity-60',
        ) }>
          <div
            className={ classNames(
              'mat:relative mat:flex-1 mat:rounded-full range-track',
              sizeTrackHeightClasses[size],
              disabled ? 'mat:cursor-not-allowed' : 'mat:cursor-pointer',
            ) }
            style={ { touchAction: 'none' } }
            { ...(disabled ? {} : {
              ...drag.bind,
              onPointerDown: (event: React.PointerEvent) => {
                drag.bind.onPointerDown(event);
                thumbRef.current?.focus();
              },
            }) }
          >
            <div
              className={ 'mat:absolute mat:inset-y-0 mat:left-0 mat:rounded-full range-fill' }
              style={ { width: `${ ratio * 100 }%` } }
            />
            <div
              ref={ thumbRef }
              id={ id }
              role={ 'slider' }
              aria-valuemin={ min }
              aria-valuemax={ max }
              aria-valuenow={ currentValue }
              aria-disabled={ disabled }
              aria-orientation={ 'horizontal' }
              tabIndex={ disabled ? -1 : 0 }
              onKeyDown={ disabled ? undefined : handleKeyDown }
              className={ classNames(
                'mat:absolute mat:top-1/2 mat:-translate-y-1/2 mat:-translate-x-1/2 mat:rounded-full mat:border-[length:var(--border-width-input)] range-thumb mat:shadow-md mat:select-none',
                'mat:ring-0 mat:focus:ring-[length:var(--control-ring-width)] mat:focus:outline-none',
                'mat:transition-[box-shadow,scale] mat:duration-[var(--control-transition-duration)]',
                !disabled && 'mat:hover:scale-110 mat:cursor-grab',
                drag.isDragging && 'mat:scale-110 mat:cursor-grabbing',
                sizeIconClasses[size],
              ) }
              style={ { left: `${ ratio * 100 }%` } }
            />
          </div>
          { showValue && (
            <span className={ 'range-value mat:shrink-0 mat:tabular-nums mat:text-[length:var(--font-size-description)] mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)]' }>
              { formatValue ? formatValue(currentValue) : currentValue }
            </span>
          ) }
        </div>
        { name != null && (
          <input type={ 'hidden' } name={ name } value={ currentValue }/>
        ) }
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
