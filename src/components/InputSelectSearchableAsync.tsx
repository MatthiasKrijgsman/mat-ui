import * as React from "react";
import { useEffect, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconSearch, IconSearchOff, IconX } from "@tabler/icons-react";
import { InputSelectOption } from "@/components/InputSelectOption.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { PopoverPanel } from "@/popover/PopoverPanel.tsx";
import { Spinner } from "@/spinner/Spinner.tsx";
import { useDebounce } from "@/hooks/use-debounce.ts";
import { InputIconButtonTray } from "@/components/InputIconButtonTray.tsx";
import { InputIconButton } from "@/components/InputIconButton.tsx";
import { InputDescription } from "@/components/InputDescription.tsx";
import { InputLabel } from "@/components/InputLabel.tsx";
import { InputErrorIcon } from "@/components/InputErrorIcon.tsx";
import { InputError } from "@/components/InputError.tsx";


export type InputSelectSearchableAsyncProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  fetchOptionsByQuery: (search: string) => Promise<Option<T>[]>;
  fetchOptionByValue: (value: T) => Promise<Option<T>>;
  onSearchDebounceMs?: number;
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

export const InputSelectSearchableAsync = <T, >(props: InputSelectSearchableAsyncProps<T>) => {

  const {
    className,
    label,
    description,
    onChange,
    fetchOptionsByQuery,
    fetchOptionByValue,
    onSearchDebounceMs = 300,
    value,
    placeholder,
    maxHeight = 300,
    error
  } = props;

  const [ open, setOpen ] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const [ search, setSearch ] = useState('');
  const [ options, setOptions ] = useState<Option<T>[]>([]);
  const [ selectedOption, setSelectedOption ] = useState<Option<T> | null>(null);
  const inputSearchRef = React.useRef<HTMLInputElement>(null);
  const [ isFetching, setIsFetching ] = useState(false);
  const [ isFetchingSelectedOption, setIsFetchingSelectedOption ] = useState(false);

  const debouncedQuery = useDebounce(search, onSearchDebounceMs); // wait 500ms

  useEffect(() => {
    const handleFetchOptionsByQuery = async () => {
      setIsFetching(true);
      const results = await fetchOptionsByQuery(debouncedQuery);
      setOptions(results);
      setIsFetching(false);
    };

    handleFetchOptionsByQuery();
  }, [debouncedQuery, fetchOptionsByQuery]);

  useEffect(() => {
    if (value === null || value === undefined) {
      setSelectedOption(null);
      return;
    }

    const selectedFromOptions = options?.find(option => option.value === value);

    if (!selectedFromOptions) {
      const handleFetchOptionByValue = async () => {
        setIsFetchingSelectedOption(true);
        const result = await fetchOptionByValue(value);
        setSelectedOption(result);
        setIsFetchingSelectedOption(false);
      }
      handleFetchOptionByValue();
    } else {
      setSelectedOption(selectedFromOptions);
    }
  }, [fetchOptionByValue, options, value]);

  useEffect(() => {
    if (open) inputSearchRef.current?.focus();
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
            'flex flex-row items-center h-12 pl-4 pr-10 border border-gray-200 text-gray-900 placeholder:text-gray-400 bg-white transition-all duration-150 rounded-xl shadow-sm ring-0 ring-gray-900/10 focus:ring-4 focus:outline-none select-none',
            error && 'border-red-600 ring-red-600/20 !pr-10',
            open && 'ring-4',
          ) }
          onKeyDown={ (e) => e.key === ' ' && setOpen(o => !o) }
          onClick={ () => setOpen(!open) }
        >
          { !isFetchingSelectedOption && selectedOption && (
            <span>{ selectedOption.label }</span>
          ) }
          { !isFetchingSelectedOption && !selectedOption && placeholder && (
            <span>{ placeholder }</span>
          ) }
          { isFetchingSelectedOption && (
            <Spinner className={ 'h-4 w-4  text-gray-600' }/>
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
              { !isFetching && options.length === 0 && (
                <div className={ 'flex flex-col items-center justify-center py-6' }>
                  <IconSearchOff className={ 'h-6 w-6 text-gray-900' }/>
                </div>
              ) }
              { isFetching && (
                <div className={ 'flex flex-col items-center justify-center py-6' }>
                  <Spinner className={ 'h-6 w-6  text-gray-900' }/>
                </div>
              ) }
              { !isFetching && (<>
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
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};