import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { hexToHsv, hsvToHex, type HSV } from "@/util/color.util.ts";
import { usePointerDrag } from "@/hooks/use-pointer-drag.ts";


const HUE_GRADIENT = 'linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)';
const SV_SATURATION_GRADIENT = 'linear-gradient(to right, #fff, rgba(255,255,255,0))';
const SV_VALUE_GRADIENT = 'linear-gradient(to top, #000, rgba(0,0,0,0))';
const THUMB_SHADOW = '0 0 0 1px rgba(0,0,0,0.15)';
const THUMB_SIZE = 14;
const THUMB_SIZE_ACTIVE = 28;
const THUMB_RADIUS = 6;
const THUMB_RADIUS_ACTIVE = 8;
const THUMB_SPRING = { type: 'spring', stiffness: 500, damping: 18, mass: 0.6 } as const;

const thumbAnimate = (active: boolean) => {
  const size = active ? THUMB_SIZE_ACTIVE : THUMB_SIZE;
  const half = size / 2;
  return {
    width: size,
    height: size,
    marginLeft: -half,
    marginTop: -half,
    borderRadius: active ? THUMB_RADIUS_ACTIVE : THUMB_RADIUS,
  };
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));


export type ColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
};

/* The bare HSV picker panel (saturation/value surface + hue and brightness
 * rails). InputColor wraps it in a popover; it also works standalone inside
 * any popover/panel of your own. */
export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
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
        className={ 'relative w-full' }
        style={ {
          height: 160,
          touchAction: 'none',
          cursor: 'crosshair',
        } }
        { ...svDrag.bind }
      >
        <div
          className={ 'absolute inset-0 rounded-[var(--border-radius-control-inner)] overflow-hidden border-[length:var(--border-width-input)] color-picker-surface' }
          style={ { backgroundColor: hueOnly } }
        >
          <div
            className={ 'absolute inset-0 pointer-events-none' }
            style={ { background: SV_SATURATION_GRADIENT } }
          />
          <div
            className={ 'absolute inset-0 pointer-events-none' }
            style={ { background: SV_VALUE_GRADIENT } }
          />
        </div>
        <motion.div
          className={ 'absolute pointer-events-none border-1 border-white' }
          style={ {
            left: `${ s * 100 }%`,
            top: `${ (1 - v) * 100 }%`,
            boxShadow: THUMB_SHADOW,
            backgroundColor: currentColor,
          } }
          initial={ thumbAnimate(false) }
          animate={ thumbAnimate(svDrag.isDragging) }
          transition={ THUMB_SPRING }
        />
      </div>

      <div
        className={ 'relative w-full rounded-[var(--border-radius-control-inner)]' }
        style={ {
          height: 12,
          background: HUE_GRADIENT,
          touchAction: 'none',
          cursor: 'ew-resize',
        } }
        { ...hueDrag.bind }
      >
        <motion.div
          className={ 'absolute pointer-events-none border-1 border-white' }
          style={ {
            top: '50%',
            left: `${ (h / 360) * 100 }%`,
            backgroundColor: hueOnly,
            boxShadow: THUMB_SHADOW,
          } }
          initial={ thumbAnimate(false) }
          animate={ thumbAnimate(hueDrag.isDragging) }
          transition={ THUMB_SPRING }
        />
      </div>

      <div
        className={ 'relative w-full rounded-[var(--border-radius-control-inner)]' }
        style={ {
          height: 12,
          background: `linear-gradient(to right, #000, ${ brightnessMax })`,
          touchAction: 'none',
          cursor: 'ew-resize',
        } }
        { ...brightnessDrag.bind }
      >
        <motion.div
          className={ 'absolute pointer-events-none border-1 border-white' }
          style={ {
            top: '50%',
            left: `${ v * 100 }%`,
            backgroundColor: currentColor,
            boxShadow: THUMB_SHADOW,
          } }
          initial={ thumbAnimate(false) }
          animate={ thumbAnimate(brightnessDrag.isDragging) }
          transition={ THUMB_SPRING }
        />
      </div>
    </div>
  );
};
