import * as React from "react";
import { useEffect, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { InputSelectOption } from "@/components/inputs/InputSelectOption.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";


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
    error
  } = props;

  const [ open, setOpen ] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selectedOption = options?.find(option => option.value === value);
  useDismiss(open, () => setOpen(false));

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
      <InputLabel>{ label }</InputLabel>

      <div className={ 'relative flex w-full flex-col' } ref={ anchorRef }>
        <div
          ref={ ref }
          role={ 'button' }
          tabIndex={ 0 }
          className={ classNames(
            'flex flex-row items-center h-12 pl-4 pr-10 border select-trigger transition-all duration-150 rounded-xl shadow-sm ring-0 focus:ring-4 focus:outline-none select-none',
            error && 'select-trigger-error !pr-10',
            open && 'ring-4',
          ) }
          onKeyDown={ (e) => e.key === ' ' && setOpen(o => !o) }
          onClick={ () => setOpen(!open) }
        >
          { selectedOption && (
            <span>{ selectedOption.label }</span>
          ) }
          { !selectedOption && placeholder && (
            <span className={'select-placeholder'}>{ placeholder }</span>
          ) }
        </div>
        <InputIconButtonTray>
          { error && (
            <InputErrorIcon/>
          ) }
          { !!value && (
            <InputIconButton Icon={IconX} onClick={() => onChange(null)} />
          ) }
          <InputIconButton Icon={IconChevronDown} />
        </InputIconButtonTray>
        <Popover open={ open }>
          <DropdownPanel className={ '!p-0' } style={ { maxHeight: maxHeight } }>
            <div className={ 'flex flex-col p-2 gap-1' }>
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
          </DropdownPanel>
        </Popover>
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};