export type ControlSize = 'sm' | 'md' | 'lg';

export const sizeHeightClasses: Record<ControlSize, string> = {
  sm: 'h-[var(--control-size-sm-height)]',
  md: 'h-[var(--control-size-md-height)]',
  lg: 'h-[var(--control-size-lg-height)]',
};

export const sizeMinHeightClasses: Record<ControlSize, string> = {
  sm: 'min-h-[var(--control-size-sm-height)]',
  md: 'min-h-[var(--control-size-md-height)]',
  lg: 'min-h-[var(--control-size-lg-height)]',
};

export const sizeFontClasses: Record<ControlSize, string> = {
  sm: 'text-[length:var(--control-size-sm-font-size)]',
  md: 'text-[length:var(--control-size-md-font-size)]',
  lg: 'text-[length:var(--control-size-lg-font-size)]',
};

export const sizeGapClasses: Record<ControlSize, string> = {
  sm: 'gap-[var(--control-size-sm-gap)]',
  md: 'gap-[var(--control-size-md-gap)]',
  lg: 'gap-[var(--control-size-lg-gap)]',
};

export const sizePaddingXClasses: Record<ControlSize, string> = {
  sm: 'px-[var(--control-size-sm-px)]',
  md: 'px-[var(--control-size-md-px)]',
  lg: 'px-[var(--control-size-lg-px)]',
};

export const sizePaddingLeftClasses: Record<ControlSize, string> = {
  sm: 'pl-[var(--control-size-sm-px)]',
  md: 'pl-[var(--control-size-md-px)]',
  lg: 'pl-[var(--control-size-lg-px)]',
};

export const sizePaddingRightClasses: Record<ControlSize, string> = {
  sm: 'pr-[var(--control-size-sm-px)]',
  md: 'pr-[var(--control-size-md-px)]',
  lg: 'pr-[var(--control-size-lg-px)]',
};

/* Right padding when an icon-button tray sits inside the input.
 * Layout reserves: base px + 24px (fixed icon button width) + 8px gap. */
export const sizePaddingRightWithTrayClasses: Record<ControlSize, string> = {
  sm: 'pr-[calc(var(--control-size-sm-px)+2rem)]',
  md: 'pr-[calc(var(--control-size-md-px)+2rem)]',
  lg: 'pr-[calc(var(--control-size-lg-px)+2rem)]',
};

/* Left padding when an icon sits absolutely inside the input.
 * Layout reserves: base px + icon size + 0.75rem gap. */
export const sizePaddingLeftWithIconClasses: Record<ControlSize, string> = {
  sm: 'pl-[calc(var(--control-size-sm-px)+var(--control-size-sm-icon)+0.75rem)]',
  md: 'pl-[calc(var(--control-size-md-px)+var(--control-size-md-icon)+0.75rem)]',
  lg: 'pl-[calc(var(--control-size-lg-px)+var(--control-size-lg-icon)+0.75rem)]',
};

/* Absolute left position of a leading icon, aligned with the input's px. */
export const sizeIconLeftPositionClasses: Record<ControlSize, string> = {
  sm: 'left-[var(--control-size-sm-px)]',
  md: 'left-[var(--control-size-md-px)]',
  lg: 'left-[var(--control-size-lg-px)]',
};

/* Absolute right position of an icon-button tray, aligned with the input's px. */
export const sizeTrayRightPositionClasses: Record<ControlSize, string> = {
  sm: 'right-[var(--control-size-sm-px)]',
  md: 'right-[var(--control-size-md-px)]',
  lg: 'right-[var(--control-size-lg-px)]',
};

/* Glyph sizing for icons that should scale with the control. */
export const sizeIconClasses: Record<ControlSize, string> = {
  sm: 'h-[var(--control-size-sm-icon)] w-[var(--control-size-sm-icon)]',
  md: 'h-[var(--control-size-md-icon)] w-[var(--control-size-md-icon)]',
  lg: 'h-[var(--control-size-lg-icon)] w-[var(--control-size-lg-icon)]',
};

/* Square/round icon-button: width = height. */
export const sizeSquareClasses: Record<ControlSize, string> = {
  sm: 'h-[var(--control-size-sm-height)] w-[var(--control-size-sm-height)]',
  md: 'h-[var(--control-size-md-height)] w-[var(--control-size-md-height)]',
  lg: 'h-[var(--control-size-lg-height)] w-[var(--control-size-lg-height)]',
};
