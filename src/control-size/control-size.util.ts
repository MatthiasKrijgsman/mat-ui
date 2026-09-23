export type ControlSize = 'sm' | 'md' | 'lg';

export const sizeHeightClasses: Record<ControlSize, string> = {
  sm: 'mat:h-[var(--control-size-sm-height)]',
  md: 'mat:h-[var(--control-size-md-height)]',
  lg: 'mat:h-[var(--control-size-lg-height)]',
};

export const sizeMinHeightClasses: Record<ControlSize, string> = {
  sm: 'mat:min-h-[var(--control-size-sm-height)]',
  md: 'mat:min-h-[var(--control-size-md-height)]',
  lg: 'mat:min-h-[var(--control-size-lg-height)]',
};

export const sizeFontClasses: Record<ControlSize, string> = {
  sm: 'mat:text-[length:var(--control-size-sm-font-size)]',
  md: 'mat:text-[length:var(--control-size-md-font-size)]',
  lg: 'mat:text-[length:var(--control-size-lg-font-size)]',
};

export const sizeGapClasses: Record<ControlSize, string> = {
  sm: 'mat:gap-[var(--control-size-sm-gap)]',
  md: 'mat:gap-[var(--control-size-md-gap)]',
  lg: 'mat:gap-[var(--control-size-lg-gap)]',
};

export const sizePaddingXClasses: Record<ControlSize, string> = {
  sm: 'mat:px-[var(--control-size-sm-px)]',
  md: 'mat:px-[var(--control-size-md-px)]',
  lg: 'mat:px-[var(--control-size-lg-px)]',
};

export const sizePaddingLeftClasses: Record<ControlSize, string> = {
  sm: 'mat:pl-[var(--control-size-sm-px)]',
  md: 'mat:pl-[var(--control-size-md-px)]',
  lg: 'mat:pl-[var(--control-size-lg-px)]',
};

export const sizePaddingRightClasses: Record<ControlSize, string> = {
  sm: 'mat:pr-[var(--control-size-sm-px)]',
  md: 'mat:pr-[var(--control-size-md-px)]',
  lg: 'mat:pr-[var(--control-size-lg-px)]',
};

/* Right padding when an icon-button tray sits inside the input.
 * Layout reserves: base px + 24px (fixed icon button width) + 8px gap. */
export const sizePaddingRightWithTrayClasses: Record<ControlSize, string> = {
  sm: 'mat:pr-[calc(var(--control-size-sm-px)+2rem)]',
  md: 'mat:pr-[calc(var(--control-size-md-px)+2rem)]',
  lg: 'mat:pr-[calc(var(--control-size-lg-px)+2rem)]',
};

/* Right padding when the icon-button tray holds two buttons.
 * Layout reserves: base px + 24px + 4px gap + 24px + 8px gap. */
export const sizePaddingRightWithTrayTwoClasses: Record<ControlSize, string> = {
  sm: 'mat:pr-[calc(var(--control-size-sm-px)+3.75rem)]',
  md: 'mat:pr-[calc(var(--control-size-md-px)+3.75rem)]',
  lg: 'mat:pr-[calc(var(--control-size-lg-px)+3.75rem)]',
};

/* Left padding when an icon sits absolutely inside the input.
 * Layout reserves: icon-offset + icon size + 0.75rem gap. */
export const sizePaddingLeftWithIconClasses: Record<ControlSize, string> = {
  sm: 'mat:pl-[calc(var(--control-size-sm-icon-offset)+var(--control-size-sm-icon)+0.75rem)]',
  md: 'mat:pl-[calc(var(--control-size-md-icon-offset)+var(--control-size-md-icon)+0.75rem)]',
  lg: 'mat:pl-[calc(var(--control-size-lg-icon-offset)+var(--control-size-lg-icon)+0.75rem)]',
};

/* Absolute left position of a leading icon, using the dedicated icon-offset
 * token (tighter than the input's overall px). */
export const sizeIconLeftPositionClasses: Record<ControlSize, string> = {
  sm: 'mat:left-[var(--control-size-sm-icon-offset)]',
  md: 'mat:left-[var(--control-size-md-icon-offset)]',
  lg: 'mat:left-[var(--control-size-lg-icon-offset)]',
};

/* Absolute right position of an icon-button tray, aligned with the input's px. */
export const sizeTrayRightPositionClasses: Record<ControlSize, string> = {
  sm: 'mat:right-[var(--control-size-sm-px)]',
  md: 'mat:right-[var(--control-size-md-px)]',
  lg: 'mat:right-[var(--control-size-lg-px)]',
};

/* Glyph sizing for icons that should scale with the control. */
export const sizeIconClasses: Record<ControlSize, string> = {
  sm: 'mat:h-[var(--control-size-sm-icon)] mat:w-[var(--control-size-sm-icon)]',
  md: 'mat:h-[var(--control-size-md-icon)] mat:w-[var(--control-size-md-icon)]',
  lg: 'mat:h-[var(--control-size-lg-icon)] mat:w-[var(--control-size-lg-icon)]',
};

/* Square/round icon-button: width = height. */
export const sizeSquareClasses: Record<ControlSize, string> = {
  sm: 'mat:h-[var(--control-size-sm-height)] mat:w-[var(--control-size-sm-height)]',
  md: 'mat:h-[var(--control-size-md-height)] mat:w-[var(--control-size-md-height)]',
  lg: 'mat:h-[var(--control-size-lg-height)] mat:w-[var(--control-size-lg-height)]',
};
