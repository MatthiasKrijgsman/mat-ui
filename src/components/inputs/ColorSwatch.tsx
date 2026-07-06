import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { useControlSize } from "@/control-size/use-control-size.ts";
import type { ControlSize } from "@/control-size/control-size.util.ts";
import { sizeIconClasses } from "@/control-size/control-size.util.ts";


export type ColorSwatchProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Any CSS color. Falls back to white so an empty value still renders a tile. */
  color?: string;
  /** Overrides the size from `ControlSizeContext` when set. */
  size?: ControlSize;
};

/* The small rounded color tile InputColor shows inside its input box; also
 * works standalone wherever a color value needs a visual chip. */
export const ColorSwatch = (props: ColorSwatchProps) => {
  const {
    color,
    size: sizeProp,
    className,
    style,
    ...rest
  } = props;

  const contextSize = useControlSize();
  const size = sizeProp ?? contextSize;

  return (
    <div
      className={ classNames(
        'shrink-0 rounded-[var(--border-radius-control-inner)] border-[length:var(--border-width-input)] color-swatch',
        sizeIconClasses[size],
        className,
      ) }
      style={ { backgroundColor: color || 'white', ...style } }
      { ...rest }
    />
  );
};
