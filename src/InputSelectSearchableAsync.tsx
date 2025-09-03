import * as React from "react";
import { useEffect, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconSearch, IconSearchOff } from "@tabler/icons-react";
import { InputSelectOption } from "@/InputSelectOption.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { PopoverPanel } from "@/popover/PopoverPanel.tsx";
import { Spinner } from "@/spinner/Spinner.tsx";


export type InputSelectSearchableAsyncProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options: Option<T>[];
  onSearch: (search: string) => Promise<Option<T>[]>;
  onSearchDebounceMs?: number;
  value: T;
  onChange: (value: T) => void;
  placeholder?: string; // TODO Add placeholder to other select
  maxHeight?: number;
}

export type Option<T> = {
  label: string | React.ReactNode;
  value: T;
  disabled?: boolean;
}

//TODO Add remove value button
//TODO remove options and trigger onSearch for initial options
//TODO Add way to fetch selected values if not in options
export const InputSelectSearchableAsync = <T, >(props: InputSelectSearchableAsyncProps<T>) => {

  const {
    className,
    label,
    description,
    options,
    onChange,
    onSearch,
    onSearchDebounceMs = 200,
    value,
    placeholder,
    maxHeight
  } = props;

  const [ open, setOpen ] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const [ search, setSearch ] = useState('');
  const [ filteredOptions, setFilteredOptions ] = useState<Option<T>[]>(options);
  const selectedOption = options?.find(option => option.value === value);
  const inputSearchRef = React.useRef<HTMLInputElement>(null);
  const [ isFetching, setIsFetching ] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsFetching(true);
      onSearch(search).then((opts) => {
        setFilteredOptions(opts);
        setIsFetching(false);
      });
    }, onSearchDebounceMs)
    return () => clearTimeout(delayDebounceFn)
  }, [search, options, onSearch, onSearchDebounceMs]);

  useEffect(() => {
    if (open) {
      inputSearchRef.current?.focus();
    }
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
          className={ classNames(
            'flex flex-row items-center h-12 pl-4 pr-10 border border-gray-200 text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-150 rounded-xl shadow-sm ring-0 ring-gray-900/10 focus:ring-4 focus:outline-none select-none',
            open && 'ring-4'
          ) }
          onKeyDown={ (e) => e.key === ' ' && setOpen(o => !o) }
          onClick={ () => setOpen(!open) }
        >
          { selectedOption && (
            <span>{ selectedOption.label }</span>
          ) }
          { !selectedOption && placeholder && (
            <span>{ placeholder }</span>
          ) }
        </div>
        <IconChevronDown className={ 'h-4 w-4 absolute text-gray-900 top-4 right-4' }/>
        <Popover open={ open }>
          <PopoverPanel className={ 'gap-0 !p-0' } style={ { maxHeight: maxHeight } }>
            <div className={ 'sticky top-0 border-b border-b-gray-200 py-1 bg-white/50 backdrop-blur-sm' }>
              <input
                ref={ inputSearchRef }
                type={ 'text' }
                placeholder={ 'Search' }
                value={ search }
                className={ 'appearance-none border-none w-full bg-transparent rounded- pl-10 transition-all duration-150 focus:outline-none ring-0 placeholder:text-gray-400' }
                onChange={ (e) => setSearch(e.target.value) }
              />
              <IconSearch className={ 'absolute text-gray-500 left-4 top-4 h-4 w-4' }/>
            </div>
            <div className={ 'flex flex-col gap-1 p-2' }>
              { search !== '' && (
                <>
                  { !isFetching && filteredOptions.length === 0 && (
                    <div className={ 'flex flex-col items-center justify-center py-6' }>
                      <IconSearchOff className={ 'h-6 w-6 text-gray-900' }/>
                    </div>
                  ) }
                  { isFetching && (
                    <div className={ 'flex flex-col items-center justify-center py-6' }>
                      <Spinner className={'h-6 w-6  text-gray-900'} />
                    </div>
                  ) }
                  { !isFetching && filteredOptions.map((option) => {
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
                </>
              ) }

              { search === '' && (<>
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
              </>) }
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