import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconSearch, IconSearchOff, IconX } from "@tabler/icons-react";
import { InputSelectOption } from "@/components/inputs/InputSelectOption.tsx";
import { InputSelectGroupHeader } from "@/components/inputs/InputSelectGroupHeader.tsx";
import { InputSelectDivider } from "@/components/inputs/InputSelectDivider.tsx";
import { useSelectPopover } from "@/popover/use-select-popover.tsx";
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
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { isSelectOption, selectValueEquals, type Option, type SelectItem } from "@/components/inputs/select-item.ts";
export type { Option } from "@/components/inputs/select-item.ts";
import { type InputVariant, selectTriggerVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightWithTrayClasses,
  sizePaddingRightWithTrayTwoClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputSelectSearchableAsyncProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  fetchOptionsByQuery: (search: string) => Promise<SelectItem<T>[]>;
  fetchOptionByValue: (value: T) => Promise<Option<T>>;
  onSearchDebounceMs?: number;
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  maxHeight?: number;
  error?: string | React.ReactNode;
  size?: Size;
  variant?: InputVariant;
  disabled?: boolean;
  clearable?: boolean;
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
    error,
    size = 'md',
    variant = 'default',
    disabled = false,
    clearable = false,
  } = props;

  const [ open, setOpen ] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const [ search, setSearch ] = useState('');
  const [ options, setOptions ] = useState<SelectItem<T>[]>([]);
  const [ selectedOption, setSelectedOption ] = useState<Option<T> | null>(null);
  const inputSearchRef = React.useRef<HTMLInputElement>(null);
  const [ isFetching, setIsFetching ] = useState(false);
  const [ isFetchingSelectedOption, setIsFetchingSelectedOption ] = useState(false);
  const [ activeIndex, setActiveIndex ] = useState<number | null>(null);
  const listRef = React.useRef<Array<HTMLElement | null>>([]);

  const disabledIndices = useMemo(
    () => options
      .map((item, i) => (!isSelectOption(item) || item.disabled) ? i : -1)
      .filter(i => i !== -1),
    [options],
  );

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

    const selectedFromOptions = options?.find((item): item is Option<T> => isSelectOption(item) && selectValueEquals(item.value, value));

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
    if (open) {
      setTimeout(() => inputSearchRef.current?.focus(), 100);
    } else {
      setActiveIndex(null);
      setSearch('');
    }
  }, [ open ])

  useEffect(() => {
    if (!open) return;
    const firstSelectable = options.findIndex(item => isSelectOption(item) && !item.disabled);
    setActiveIndex(firstSelectable >= 0 ? firstSelectable : null);
  }, [ options, open ]);

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

  const hasSelectableVisible = options.some(item => isSelectOption(item));

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
                } else if (e.key === 'Enter' && !open) {
                  e.preventDefault();
                  setOpen(true);
                }
              },
            }) }
            className={ classNames(
              'flex flex-row items-center border-[length:var(--border-width-input)] select-trigger transition-all duration-[var(--control-transition-duration)] rounded-[var(--border-radius-input)] ring-0 focus:ring-[length:var(--control-ring-width)] focus:outline-none select-none font-[number:var(--font-weight-input-text)] font-[family-name:var(--font-family-base)]',
              selectTriggerVariantClasses[variant],
              sizeHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              clearable && value ? sizePaddingRightWithTrayTwoClasses[size] : sizePaddingRightWithTrayClasses[size],
              disabled ? 'select-trigger-disabled' : error && 'select-trigger-error',
              !disabled && open && 'ring-[length:var(--control-ring-width)]',
            ) }
          >
            { !isFetchingSelectedOption && selectedOption && (
              <span className={ 'flex-1 min-w-0 break-all line-clamp-1 text-left' }>{ selectedOption.label }</span>
            ) }
            { !isFetchingSelectedOption && !selectedOption && placeholder && (
              <span className={ 'flex-1 min-w-0 break-all line-clamp-1 text-left select-placeholder' }>{ placeholder }</span>
            ) }
            { isFetchingSelectedOption && (
              <Spinner className={ 'h-4 w-4 text-[var(--color-input-text)]' }/>
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
            <DropdownPanel className={ 'gap-0 !p-0' } style={ { maxHeight: maxHeight } }>
              <div className={ 'sticky top-0 border-b select-search-bar py-1 backdrop-blur-sm' }>
                <input
                  ref={ inputSearchRef }
                  type={ 'text' }
                  placeholder={ 'Search' }
                  value={ search }
                  className={ 'appearance-none border-none w-full bg-transparent rounded- pl-10 transition-all duration-[var(--control-transition-duration)] focus:outline-none ring-0 placeholder:text-[var(--color-input-placeholder)]' }
                  onChange={ (e) => setSearch(e.target.value) }
                  onKeyDown={ (e) => {
                    if (e.key === 'Enter' && activeIndex != null) {
                      e.preventDefault();
                      handleSelect(activeIndex);
                    }
                  } }
                />
                <IconSearch className={ 'absolute select-search-icon left-4 top-4 h-4 w-4' }/>
              </div>
              <div className={ 'flex flex-col gap-1 p-2' }>
                { !isFetching && !hasSelectableVisible && (
                  <div className={ 'flex flex-col items-center justify-center py-6' }>
                    <IconSearchOff className={ 'h-6 w-6 text-[var(--color-input-text)]' }/>
                  </div>
                ) }
                { isFetching && (
                  <div className={ 'flex flex-col items-center justify-center py-6' }>
                    <Spinner className={ 'h-6 w-6 text-[var(--color-input-text)]' }/>
                  </div>
                ) }
                { !isFetching && options.map((item, i) => {
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
