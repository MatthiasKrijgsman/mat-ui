import * as React from "react";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { useControlSize } from "@/control-size/use-control-size.ts";
import type { ControlSize } from "@/control-size/control-size.util.ts";
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
          'flex flex-row items-center border-[length:var(--border-width-input)] select-trigger transition-all duration-[var(--control-transition-duration)] rounded-[var(--border-radius-input)] shadow-[var(--shadow-control)] ring-0 focus:ring-[length:var(--control-ring-width)] focus:outline-none select-none font-[number:var(--font-weight-input-text)] font-[family-name:var(--font-family-base)]',
          sizeHeightClasses[size],
          sizeFontClasses[size],
          sizePaddingLeftClasses[size],
          clearable && hasValue ? sizePaddingRightWithTrayTwoClasses[size] : sizePaddingRightWithTrayClasses[size],
          disabled ? 'select-trigger-disabled' : error && 'select-trigger-error',
          !disabled && open && 'ring-[length:var(--control-ring-width)]',
          className,
        ) }
        { ...rest }
      >
        { selectedLabel && (
          <span className={ 'flex-1 min-w-0 break-all line-clamp-1 text-left' }>{ selectedLabel }</span>
        ) }
        { !selectedLabel && placeholder && (
          <span className={ 'flex-1 min-w-0 break-all line-clamp-1 text-left select-placeholder' }>{ placeholder }</span>
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
