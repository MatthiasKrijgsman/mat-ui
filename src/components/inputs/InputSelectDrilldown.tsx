import * as React from "react";
import { useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { usePopover } from "@/popover/use-popover.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { DropdownNavigator } from "@/components/dropdown-menu/DropdownNavigator.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { SelectTrigger } from "@/components/inputs/SelectTrigger.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import type { ControlSize } from "@/control-size/control-size.util.ts";

export type SelectDrilldownApi = {
  /** Dismisses the popover — call after committing a leaf selection. */
  close: () => void;
};

export type InputSelectDrilldownProps = {
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  size?: ControlSize;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string | React.ReactNode;
  /** Whether a value is selected — drives the clear button + trigger padding. */
  hasValue?: boolean;
  /** Rendered inside the trigger for the current selection. */
  valueLabel?: React.ReactNode;
  onClear?: () => void;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  /**
   * Root-level menu content. Rendered inside the drilldown navigator, so it (and
   * anything it drills into via {@link DropdownDrilldown}) slides between levels.
   * Pass a function to receive `{ close }` for dismissing after a leaf pick.
   */
  children: React.ReactNode | ((api: SelectDrilldownApi) => React.ReactNode);
};

/**
 * A single-select control whose menu is a sliding drilldown rather than a flat
 * option list — for hierarchies too large or too lazy to flatten up front. It
 * owns the (shared) {@link SelectTrigger}, popover, and {@link DropdownNavigator};
 * the consumer supplies the level content and uses {@link DropdownDrilldown} for
 * rows that descend a level. The current value is opaque to this component — pass
 * `valueLabel` for the trigger and `hasValue`/`onClear` for clearing.
 */
export const InputSelectDrilldown = (props: InputSelectDrilldownProps) => {
  const {
    id,
    className,
    label,
    description,
    error,
    size = 'md',
    disabled = false,
    clearable = false,
    placeholder,
    hasValue = false,
    valueLabel,
    onClear,
    minWidth = 200,
    maxWidth,
    maxHeight = 300,
    children,
  } = props;

  const [ open, setOpen ] = useState(false);
  const { anchorRef, Popover } = usePopover({
    placement: 'bottom-start',
    fullWidth: true,
    minWidth,
    maxWidth,
    open,
    onOpenChange: setOpen,
  });

  const content = typeof children === 'function'
    ? children({ close: () => setOpen(false) })
    : children;

  return (
    <ControlSizeContext.Provider value={ size }>
      <div className={ classNames('flex flex-col', className) }>
        <InputLabel>{ label }</InputLabel>

        <div className={ 'relative flex w-full flex-col' } ref={ anchorRef }>
          <SelectTrigger
            id={ id }
            role={ 'button' }
            tabIndex={ disabled ? -1 : 0 }
            aria-disabled={ disabled }
            size={ size }
            open={ open }
            disabled={ disabled }
            error={ !!error }
            clearable={ clearable }
            hasValue={ hasValue }
            selectedLabel={ valueLabel }
            placeholder={ placeholder }
            onClear={ onClear }
            onClick={ () => { if (!disabled) setOpen(!open); } }
            onKeyDown={ (e) => {
              if (disabled) return;
              if (e.key === ' ') {
                e.preventDefault();
                setOpen(o => !o);
              } else if (e.key === 'Enter' && !open) {
                e.preventDefault();
                setOpen(true);
              }
            } }
          />
          <Popover open={ open }>
            <DropdownPanel className={ '!p-0' } style={ { maxHeight } }>
              <DropdownNavigator open={ open }>
                { content }
              </DropdownNavigator>
            </DropdownPanel>
          </Popover>
        </div>

        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
