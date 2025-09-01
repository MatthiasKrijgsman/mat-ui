import * as React from "react";
import { useEffect, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown } from "@tabler/icons-react";
import { InputSelectOption } from "@/InputSelectOption.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { PopoverPanel } from "@/popover/PopoverPanel.tsx";


export type InputSelectProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
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
  } = props;

  const [ open, setOpen ] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selectedOption = options?.find(option => option.value === value);

  useEffect(() => {
    if (open) ref.current?.focus({ preventScroll: true });
  }, [ open ])

  const { anchorRef, Popover } = usePopover({
    placement: 'bottom',
    fullWidth: true,
    onOutsideClick: () => setOpen(false),
  })

  return (
    <div
      className={ classNames(
        'flex flex-col',
        className
      ) }>
      { label && (
        <label className={ 'text-gray-900 font-medium mb-1' }>{ label }</label>
      ) }

      <div className={ 'relative flex w-full flex-col' } ref={ anchorRef }>
        <div
          ref={ ref }
          role={ 'button' }
          tabIndex={ 0 }
          className={ `flex flex-row items-center h-12 pl-4 pr-10 border border-gray-200 text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-150 rounded-xl shadow-sm ring-0 ring-gray-900/10 focus:ring-4 focus:outline-none select-none` }
          onKeyDown={ (e) => e.key === ' ' && setOpen(o => !o) }
          onClick={ () => setOpen(!open) }
        >
          { selectedOption && (
            <span>{ selectedOption.label }</span>
          ) }
        </div>
        <IconChevronDown className={ 'h-4 w-4 absolute text-gray-900 top-4 right-4' }/>
        <Popover open={ open }>
          <PopoverPanel className={'!p-0'}>
            <div className={ 'flex flex-col p-1 gap-1' }>
              { options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <InputSelectOption
                    key={ String(option.value) }
                    onClick={ () => {
                      if (!option.disabled && !!onChange) {
                        onChange(option.value)
                        setOpen(false);
                      }
                    } }
                    selected={ isSelected }
                    disabled={ option.disabled }
                  >
                    { option.label }
                  </InputSelectOption>
                )
              }) }
            </div>
          </PopoverPanel>
        </Popover>
      </div>
      { description && (
        <div className={ 'text-gray-500 text-sm font-medium mt-2' }>{ description }</div>
      ) }
    </div>
  );
};