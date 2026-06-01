import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronDown, IconSearch, IconSearchOff, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/Badge.tsx";
import { type BadgeColorKey } from "@/components/BadgeColors.tsx";
import { InputSelectOption } from "@/components/inputs/InputSelectOption.tsx";
import { InputSelectGroupHeader } from "@/components/inputs/InputSelectGroupHeader.tsx";
import { InputSelectDivider } from "@/components/inputs/InputSelectDivider.tsx";
import { useSelectPopover } from "@/popover/use-select-popover.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";
import { useOverflowFit } from "@/hooks/use-overflow-fit.ts";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { isSelectOption, type Option, type SelectItem } from "@/components/inputs/select-item.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizeMinHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightWithTrayClasses,
  sizePaddingRightWithTrayTwoClasses,
} from "@/control-size/control-size.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputSelectMultipleProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options: SelectItem<T>[];
  onSearch?: (search: string) => SelectItem<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  maxHeight?: number;
  error?: string | React.ReactNode;
  size?: Size;
  singleLine?: boolean;
  color?: BadgeColorKey;
  disabled?: boolean;
  clearable?: boolean;
}

export const InputSelectMultiple = <T, >(props: InputSelectMultipleProps<T>) => {

  const {
    className,
    label,
    description,
    options,
    onChange,
    onSearch,
    value,
    placeholder,
    maxHeight = 300,
    error,
    size = 'md',
    singleLine = false,
    color = 'blue',
    disabled = false,
    clearable = true,
  } = props;

  const [ open, setOpen ] = useState(false);
  const [ filteredOptions, setFilteredOptions ] = useState<SelectItem<T>[]>(options);
  const [ search, setSearch ] = useState('');
  const [ activeIndex, setActiveIndex ] = useState<number | null>(null);

  const ref = React.useRef<HTMLDivElement>(null);
  const inputSearchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const trayRef = React.useRef<HTMLDivElement>(null);

  const selectedOptions = useMemo(
    () => value
      .map(v => options.find((item): item is Option<T> => isSelectOption(item) && item.value === v))
      .filter((item): item is Option<T> => item !== undefined),
    [ value, options ],
  );

  const defaultSearch = (q: string): SelectItem<T>[] => {
    if (q === '') return options;
    const lower = q.toLowerCase();
    return options.filter(item => {
      if (!isSelectOption(item)) return true;
      if (typeof item.label === 'string') {
        return item.label.toLowerCase().includes(lower);
      }
      return true;
    });
  };

  const visibleOptions = useMemo(
    () => search !== '' ? filteredOptions : options,
    [ search, filteredOptions, options ],
  );

  const disabledIndices = useMemo(
    () => visibleOptions
      .map((item, i) => (!isSelectOption(item) || item.disabled) ? i : -1)
      .filter(i => i !== -1),
    [ visibleOptions ],
  );

  useDismiss(open, () => setOpen(false));

  useEffect(() => {
    const fn = onSearch ?? defaultSearch;
    setFilteredOptions(fn(search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ search, options, onSearch ]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputSearchRef.current?.focus(), 100);
      const firstSelectable = options.findIndex(item => isSelectOption(item) && !item.disabled);
      setActiveIndex(firstSelectable >= 0 ? firstSelectable : null);
    } else {
      setActiveIndex(null);
      setSearch('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open ]);

  useEffect(() => {
    if (!open) return;
    const firstSelectable = visibleOptions.findIndex(item => isSelectOption(item) && !item.disabled);
    setActiveIndex(firstSelectable >= 0 ? firstSelectable : null);
  }, [ search, open, visibleOptions ]);

  const visibleCount = useOverflowFit({
    enabled: singleLine,
    triggerRef: ref,
    measureRef,
    trayRef,
    itemCount: selectedOptions.length,
    deps: [ selectedOptions, error ],
  });

  const { anchorRef, Popover, getReferenceProps, getItemProps } = useSelectPopover({
    placement: 'bottom',
    fullWidth: true,
    minWidth: 200,
    onOutsideClick: () => setOpen(false),
    open,
    onOpenChange: setOpen,
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    disabledIndices,
  });

  const toggleValue = (v: T) => {
    if (value.includes(v)) {
      onChange(value.filter(item => item !== v));
    } else {
      onChange([ ...value, v ]);
    }
  };

  const handleSelect = (idx: number) => {
    const item = visibleOptions[idx];
    if (item && isSelectOption(item) && !item.disabled) {
      toggleValue(item.value);
    }
  };

  const hasSelectableVisible = visibleOptions.some(item => isSelectOption(item));
  const hasSelection = value.length > 0;

  const displayedCount = singleLine ? visibleCount : selectedOptions.length;
  const visibleBadges = selectedOptions.slice(0, displayedCount);
  const hiddenCount = selectedOptions.length - displayedCount;

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
                } else if (e.key === 'Backspace' && !open && hasSelection) {
                  e.preventDefault();
                  onChange(value.slice(0, -1));
                }
              },
            }) }
            className={ classNames(
              'flex flex-row items-center gap-1 border select-trigger transition-all duration-150 rounded-xl shadow-sm ring-0 focus:ring-4 focus:outline-none select-none',
              singleLine && classNames('flex-nowrap overflow-hidden', sizeHeightClasses[size]),
              !singleLine && classNames('flex-wrap py-1.5', sizeMinHeightClasses[size]),
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              clearable && hasSelection ? sizePaddingRightWithTrayTwoClasses[size] : sizePaddingRightWithTrayClasses[size],
              disabled ? 'select-trigger-disabled' : error && 'select-trigger-error',
              !disabled && open && 'ring-4',
            ) }
          >
            { hasSelection && visibleBadges.map((opt) => (
              <Badge
                key={ String(opt.value) }
                color={ color }
                className={ classNames(
                  singleLine && displayedCount > 1 && 'shrink-0',
                  (!singleLine || displayedCount === 1) && 'max-w-full min-w-0',
                ) }
              >
                { opt.label }
              </Badge>
            )) }
            { hasSelection && hiddenCount > 0 && (
              <span className={ 'shrink-0 text-sm font-medium select-placeholder px-1' }>
                +{ hiddenCount } more
              </span>
            ) }
            { !hasSelection && placeholder && (
              <span className={ 'select-placeholder' }>{ placeholder }</span>
            ) }
          </div>
          { singleLine && (
            <div
              ref={ measureRef }
              aria-hidden
              className={ 'absolute top-0 left-0 invisible pointer-events-none flex flex-row flex-nowrap items-center gap-1 w-max' }
            >
              { selectedOptions.map((opt) => (
                <Badge key={ String(opt.value) } color={ color }>
                  { opt.label }
                </Badge>
              )) }
              { selectedOptions.length > 0 && (
                <span className={ 'text-sm font-medium px-1' }>
                  +{ selectedOptions.length } more
                </span>
              ) }
            </div>
          ) }
          <InputIconButtonTray ref={ trayRef }>
            { !disabled && error && (
              <InputErrorIcon/>
            ) }
            { clearable && hasSelection && !disabled && (
              <InputIconButton Icon={ IconX } onClick={ () => onChange([]) }/>
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
                  className={ 'appearance-none border-none w-full bg-transparent rounded- pl-10 transition-all duration-150 focus:outline-none ring-0 placeholder:text-[var(--color-input-placeholder)]' }
                  onChange={ (e) => setSearch(e.target.value) }
                  onKeyDown={ (e) => {
                    if (e.key === 'Enter' && activeIndex != null) {
                      e.preventDefault();
                      handleSelect(activeIndex);
                    } else if (e.key === 'Backspace' && search === '' && hasSelection) {
                      e.preventDefault();
                      onChange(value.slice(0, -1));
                    }
                  } }
                />
                <IconSearch className={ 'absolute select-search-icon left-4 top-4 h-4 w-4' }/>
              </div>
              <div className={ 'flex flex-col gap-1 p-2' }>
                { search !== '' && !hasSelectableVisible && (
                  <div className={ 'flex flex-col items-center justify-center py-6' }>
                    <IconSearchOff className={ 'h-6 w-6 text-[var(--color-input-text)]' }/>
                  </div>
                ) }
                { visibleOptions.map((item, i) => {
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
                  const isSelected = value.includes(item.value);
                  return (
                    <InputSelectOption
                      key={ String(item.value) }
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
                  );
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
