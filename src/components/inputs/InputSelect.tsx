import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { InputSelectOption } from "@/components/inputs/InputSelectOption.tsx";
import { InputSelectGroupHeader } from "@/components/inputs/InputSelectGroupHeader.tsx";
import { InputSelectDivider } from "@/components/inputs/InputSelectDivider.tsx";
import { isSelectOption, selectValueEquals, type Option, type SelectItem } from "@/components/inputs/select-item.ts";
import { useSelectPopover } from "@/popover/use-select-popover.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightWithTrayClasses,
  sizePaddingRightWithTrayTwoClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputSelectProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options: SelectItem<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  maxHeight?: number;
  error?: string | React.ReactNode;
  size?: Size;
  disabled?: boolean;
  clearable?: boolean;
}

export type { Option, SelectGroupHeader, SelectDivider, SelectItem } from "@/components/inputs/select-item.ts";


export const InputSelect = <T, >(props: InputSelectProps<T>) => {

  const {
    className,
    label,
    description,
    options,
    onChange,
    value,
    placeholder,
    maxHeight = 300,
    error,
    size = 'md',
    disabled = false,
    clearable = false,
  } = props;

  const [ open, setOpen ] = useState(false);
  const [ activeIndex, setActiveIndex ] = useState<number | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const selectedOption = options?.find((item): item is Option<T> => isSelectOption(item) && selectValueEquals(item.value, value));

  const disabledIndices = useMemo(
    () => options
      .map((item, i) => (!isSelectOption(item) || item.disabled) ? i : -1)
      .filter(i => i !== -1),
    [options],
  );

  useDismiss(open, () => setOpen(false));

  useEffect(() => {
    if (open) {
      ref.current?.focus({ preventScroll: true });
      const selectedIdx = options.findIndex(item => isSelectOption(item) && selectValueEquals(item.value, value));
      if (selectedIdx >= 0) {
        setActiveIndex(selectedIdx);
      } else {
        const firstSelectable = options.findIndex(item => isSelectOption(item) && !item.disabled);
        setActiveIndex(firstSelectable >= 0 ? firstSelectable : null);
      }
    } else {
      setActiveIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open ])

  const { anchorRef, Popover, getReferenceProps, getItemProps } = useSelectPopover({
    placement: 'bottom',
    fullWidth: true,
    minWidth: 200,
    open,
    onOpenChange: setOpen,
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    disabledIndices,
  })

  const handleSelect = (idx: number) => {
    const item = options[idx];
    if (item && isSelectOption(item) && !item.disabled) {
      onChange(item.value);
      setOpen(false);
    }
  };

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'flex flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>

        <div className={ 'relative flex w-full flex-col' } ref={ anchorRef }>
          <div
            { ...getReferenceProps({
              ref,
              role: 'button',
              tabIndex: disabled ? -1 : 0,
              'aria-disabled': disabled,
              onClick: () => { if (!disabled) setOpen(!open); },
              onKeyDown: (e) => {
                if (disabled) return;
                if (e.key === ' ') {
                  e.preventDefault();
                  setOpen(o => !o);
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  if (open && activeIndex != null) {
                    handleSelect(activeIndex);
                  } else {
                    setOpen(true);
                  }
                }
              },
            }) }
            className={ classNames(
              'flex flex-row items-center border select-trigger transition-all duration-150 rounded-xl shadow-sm ring-0 focus:ring-4 focus:outline-none select-none',
              sizeHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              clearable && value ? sizePaddingRightWithTrayTwoClasses[size] : sizePaddingRightWithTrayClasses[size],
              disabled ? 'select-trigger-disabled' : error && 'select-trigger-error',
              !disabled && open && 'ring-4',
            ) }
          >
            { selectedOption && (
              <span className={ 'flex-1 min-w-0 break-all line-clamp-1 text-left' }>{ selectedOption.label }</span>
            ) }
            { !selectedOption && placeholder && (
              <span className={ 'flex-1 min-w-0 break-all line-clamp-1 text-left select-placeholder' }>{ placeholder }</span>
            ) }
          </div>
          <InputIconButtonTray>
            { !disabled && error && (
              <InputErrorIcon/>
            ) }
            { clearable && !!value && !disabled && (
              <InputIconButton Icon={ IconX } onClick={ () => onChange(null) }/>
            ) }
            <InputIconButton Icon={ IconChevronDown }/>
          </InputIconButtonTray>
          <Popover open={ open }>
            <DropdownPanel className={ '!p-0' } style={ { maxHeight: maxHeight } }>
              <div className={ 'flex flex-col p-2 gap-1' }>
                { options.map((item, i) => {
                  if (!isSelectOption(item)) {
                    if (item.kind === 'header') {
                      return (
                        <InputSelectGroupHeader
                          key={ `header-${ i }` }
                          ref={ (el) => { listRef.current[i] = el; } }
                        >
                          { item.label }
                        </InputSelectGroupHeader>
                      );
                    }
                    return (
                      <InputSelectDivider
                        key={ `divider-${ i }` }
                        ref={ (el) => { listRef.current[i] = el; } }
                      />
                    );
                  }
                  const isSelected = selectValueEquals(item.value, value);
                  return (
                    <InputSelectOption
                      key={ `option-${ i }` }
                      { ...getItemProps({
                        ref(el: HTMLElement | null) {
                          listRef.current[i] = el;
                        },
                      }) }
                      onClick={ () => handleSelect(i) }
                      selected={ isSelected }
                      active={ activeIndex === i }
                      disabled={ item.disabled }
                    >
                      { item.label }
                    </InputSelectOption>
                  )
                }) }
              </div>
            </DropdownPanel>
          </Popover>
        </div>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
