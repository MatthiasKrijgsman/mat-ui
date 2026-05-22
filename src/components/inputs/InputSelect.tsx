import * as React from "react";
import { useEffect, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { InputSelectOption } from "@/components/inputs/InputSelectOption.tsx";
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
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputSelectProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  maxHeight?: number;
  error?: string | React.ReactNode;
  size?: Size;
}

export type Option<T> = {
  label: string | React.ReactNode;
  value: T;
  disabled?: boolean;
}


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
  } = props;

  const [ open, setOpen ] = useState(false);
  const [ activeIndex, setActiveIndex ] = useState<number | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const selectedOption = options?.find(option => option.value === value);
  useDismiss(open, () => setOpen(false));

  useEffect(() => {
    if (open) {
      ref.current?.focus({ preventScroll: true });
      const selectedIdx = options.findIndex(o => o.value === value);
      setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
    } else {
      setActiveIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open ])

  const { anchorRef, Popover, getReferenceProps, getItemProps } = useSelectPopover({
    placement: 'bottom',
    fullWidth: true,
    onOutsideClick: () => setOpen(false),
    open,
    onOpenChange: setOpen,
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
  })

  const handleSelect = (idx: number) => {
    const option = options[idx];
    if (option && !option.disabled) {
      onChange(option.value);
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
              tabIndex: 0,
              onClick: () => setOpen(!open),
              onKeyDown: (e) => {
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
              sizePaddingRightWithTrayClasses[size],
              error && 'select-trigger-error',
              open && 'ring-4',
            ) }
          >
            { selectedOption && (
              <span>{ selectedOption.label }</span>
            ) }
            { !selectedOption && placeholder && (
              <span className={ 'select-placeholder' }>{ placeholder }</span>
            ) }
          </div>
          <InputIconButtonTray>
            { error && (
              <InputErrorIcon/>
            ) }
            { !!value && (
              <InputIconButton Icon={ IconX } onClick={ () => onChange(null) }/>
            ) }
            <InputIconButton Icon={ IconChevronDown }/>
          </InputIconButtonTray>
          <Popover open={ open }>
            <DropdownPanel className={ '!p-0' } style={ { maxHeight: maxHeight } }>
              <div className={ 'flex flex-col p-2 gap-1' }>
                { options.map((option, i) => {
                  const isSelected = option.value === value;
                  return (
                    <InputSelectOption
                      key={ String(option.value) }
                      { ...getItemProps({
                        ref(el: HTMLElement | null) {
                          listRef.current[i] = el;
                        },
                      }) }
                      onClick={ () => handleSelect(i) }
                      selected={ isSelected }
                      active={ activeIndex === i }
                      disabled={ option.disabled }
                    >
                      { option.label }
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
