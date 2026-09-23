import * as React from "react";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { useControlSize } from "@/control-size/use-control-size.ts";
import type { ControlSize } from "@/control-size/control-size.util.ts";
import { type InputVariant, selectTriggerVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightWithTrayClasses,
  sizePaddingRightWithTrayTwoClasses,
} from "@/control-size/control-size.util.ts";

export type SelectTriggerProps = {
  /** Overrides the size from `ControlSizeContext` when set. */
  size?: ControlSize;
  variant?: InputVariant;
  open?: boolean;
  disabled?: boolean;
  error?: boolean;
  clearable?: boolean;
  /** Whether a value is selected — drives the clear button and right padding. */
  hasValue?: boolean;
  /** Rendered when a value is selected. */
  selectedLabel?: React.ReactNode;
  placeholder?: React.ReactNode;
  onClear?: () => void;
  showChevron?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;

/**
 * The shared trigger surface for the select family (`InputSelect`,
 * `InputSelectSearchable`, `InputSelectDrilldown`): the bordered control box that
 * shows the current selection (or placeholder) plus the icon-button tray (error
 * icon, optional clear, chevron). Extracted so every select-like control shares
 * exactly the same sizing and styling. Interaction props (role, tabIndex,
 * onClick, onKeyDown, floating-ui reference props) are spread onto the box, and
 * the forwarded ref lands on it.
 */
export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>((props, ref) => {
  const {
    size: sizeProp,
    variant = 'default',
    open = false,
    disabled = false,
    error = false,
    clearable = false,
    hasValue = false,
    selectedLabel,
    placeholder,
    onClear,
    showChevron = true,
    className,
    ...rest
  } = props;

  const contextSize = useControlSize();
  const size = sizeProp ?? contextSize;

  return (
    <>
      <div
        ref={ ref }
        className={ classNames(
          'mat:flex mat:flex-row mat:items-center mat:border-[length:var(--border-width-input)] select-trigger mat:transition-all mat:duration-[var(--control-transition-duration)] mat:rounded-[var(--border-radius-input)] mat:ring-0 mat:focus:ring-[length:var(--control-ring-width)] mat:focus:outline-none mat:select-none mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)]',
          selectTriggerVariantClasses[variant],
          sizeHeightClasses[size],
          sizeFontClasses[size],
          sizePaddingLeftClasses[size],
          clearable && hasValue ? sizePaddingRightWithTrayTwoClasses[size] : sizePaddingRightWithTrayClasses[size],
          disabled ? 'select-trigger-disabled' : error && 'select-trigger-error',
          !disabled && open && 'mat:ring-[length:var(--control-ring-width)]',
          className,
        ) }
        { ...rest }
      >
        { selectedLabel && (
          <span className={ 'mat:flex-1 mat:min-w-0 mat:break-all mat:line-clamp-1 mat:text-left' }>{ selectedLabel }</span>
        ) }
        { !selectedLabel && placeholder && (
          <span className={ 'mat:flex-1 mat:min-w-0 mat:break-all mat:line-clamp-1 mat:text-left select-placeholder' }>{ placeholder }</span>
        ) }
      </div>
      <InputIconButtonTray>
        { !disabled && error && (
          <InputErrorIcon/>
        ) }
        { clearable && hasValue && !disabled && (
          <InputIconButton Icon={ IconX } onClick={ onClear }/>
        ) }
        { showChevron && (
          <InputIconButton Icon={ IconChevronDown }/>
        ) }
      </InputIconButtonTray>
    </>
  );
});

SelectTrigger.displayName = 'SelectTrigger';
