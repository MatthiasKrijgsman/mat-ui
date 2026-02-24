import * as React from "react";
import { useEffect, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconSearch, IconSearchOff, IconX } from "@tabler/icons-react";
import { InputSelectOption } from "@/components/inputs/InputSelectOption.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { Spinner } from "@/spinner/Spinner.tsx";
import { useDebounce } from "@/hooks/use-debounce.ts";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";


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
  useDismiss(open, () => setOpen(false));

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
    if (open) setTimeout(() => inputSearchRef.current?.focus(), 100);
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
          { !isFetchingSelectedOption && selectedOption && (
            <span>{ selectedOption.label }</span>
          ) }
          { !isFetchingSelectedOption && !selectedOption && placeholder && (
            <span className={'select-placeholder'}>{ placeholder }</span>
          ) }
          { isFetchingSelectedOption && (
            <Spinner className={ 'h-4 w-4 text-[var(--color-input-text)]' }/>
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
          <DropdownPanel className={ 'gap-0 !p-0' } style={ { maxHeight: maxHeight } }>
            <div className={ 'sticky top-0 border-b select-search-bar py-1 backdrop-blur-sm' }>
              <input
                ref={ inputSearchRef }
                type={ 'text' }
                placeholder={ 'Search' }
                value={ search }
                className={ 'appearance-none border-none w-full bg-transparent rounded- pl-10 transition-all duration-150 focus:outline-none ring-0 placeholder:text-[var(--color-input-placeholder)]' }
                onChange={ (e) => setSearch(e.target.value) }
              />
              <IconSearch className={ 'absolute select-search-icon left-4 top-4 h-4 w-4' }/>
            </div>
            <div className={ 'flex flex-col gap-1 p-2' }>
              { !isFetching && options.length === 0 && (
                <div className={ 'flex flex-col items-center justify-center py-6' }>
                  <IconSearchOff className={ 'h-6 w-6 text-[var(--color-input-text)]' }/>
                </div>
              ) }
              { isFetching && (
                <div className={ 'flex flex-col items-center justify-center py-6' }>
                  <Spinner className={ 'h-6 w-6 text-[var(--color-input-text)]' }/>
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
          </DropdownPanel>
        </Popover>
      </div>
      <InputDescription>{ description }</InputDescription>
      <InputError>{ error }</InputError>
    </div>
  );
};