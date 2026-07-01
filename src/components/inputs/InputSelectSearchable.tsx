import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconSearch, IconSearchOff } from "@tabler/icons-react";
import { InputSelectOption } from "@/components/inputs/InputSelectOption.tsx";
import { InputSelectGroupHeader } from "@/components/inputs/InputSelectGroupHeader.tsx";
import { InputSelectDivider } from "@/components/inputs/InputSelectDivider.tsx";
import { useSelectPopover } from "@/popover/use-select-popover.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { SelectTrigger } from "@/components/inputs/SelectTrigger.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { isSelectOption, selectValueEquals, type Option, type SelectItem } from "@/components/inputs/select-item.ts";
export type { Option } from "@/components/inputs/select-item.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputSelectSearchableProps<T> = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  options: SelectItem<T>[];
  onSearch: (search: string) => SelectItem<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  maxHeight?: number;
  error?: string | React.ReactNode;
  size?: Size;
  disabled?: boolean;
  clearable?: boolean;
}

export const InputSelectSearchable = <T, >(props: InputSelectSearchableProps<T>) => {

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
    disabled = false,
    clearable = false,
  } = props;

  const [ open, setOpen ] = useState(false);
  const [ filteredOptions, setFilteredOptions ] = useState<SelectItem<T>[]>(options);
  const [ search, setSearch ] = useState('');
  const [ activeIndex, setActiveIndex ] = useState<number | null>(null);

  const ref = React.useRef<HTMLDivElement>(null);
  const inputSearchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<Array<HTMLElement | null>>([]);

  const selectedOption = options?.find((item): item is Option<T> => isSelectOption(item) && selectValueEquals(item.value, value));
  const visibleOptions = useMemo(() => search !== '' ? filteredOptions : options, [search, filteredOptions, options]);

  const disabledIndices = useMemo(
    () => visibleOptions
      .map((item, i) => (!isSelectOption(item) || item.disabled) ? i : -1)
      .filter(i => i !== -1),
    [visibleOptions],
  );

  useDismiss(open, () => setOpen(false));

  useEffect(() => {
    setFilteredOptions(onSearch(search));
  }, [ search, options, onSearch ]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputSearchRef.current?.focus(), 100);
      const selectedIdx = options.findIndex(item => isSelectOption(item) && selectValueEquals(item.value, value));
      if (selectedIdx >= 0) {
        setActiveIndex(selectedIdx);
      } else {
        const firstSelectable = options.findIndex(item => isSelectOption(item) && !item.disabled);
        setActiveIndex(firstSelectable >= 0 ? firstSelectable : null);
      }
    } else {
      setActiveIndex(null);
      setSearch('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ open ])

  useEffect(() => {
    if (!open) return;
    const firstSelectable = visibleOptions.findIndex(item => isSelectOption(item) && !item.disabled);
    setActiveIndex(firstSelectable >= 0 ? firstSelectable : null);
  }, [ search, open, visibleOptions ]);

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
    const item = visibleOptions[idx];
    if (item && isSelectOption(item) && !item.disabled) {
      onChange(item.value);
      setOpen(false);
    }
  };

  const hasSelectableVisible = visibleOptions.some(item => isSelectOption(item));

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'flex flex-col',
          className
        ) }>
        <InputLabel>{ label }</InputLabel>

        <div className={ 'relative flex w-full flex-col' } ref={ anchorRef }>
          <SelectTrigger
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
            size={ size }
            open={ open }
            disabled={ disabled }
            error={ !!error }
            clearable={ clearable }
            hasValue={ !!value }
            selectedLabel={ selectedOption?.label }
            placeholder={ placeholder }
            onClear={ () => onChange(null) }
          />
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
