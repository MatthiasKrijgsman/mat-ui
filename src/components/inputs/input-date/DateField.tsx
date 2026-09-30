import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { mergeRefs } from "react-merge-refs";
import { IconCalendar, IconCalendarTime } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { Calendar } from "@/components/inputs/input-date/Calendar.tsx";
import { TimeColumns } from "@/components/inputs/input-date/TimeColumns.tsx";
import { usePopover } from "@/popover/use-popover.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { type InputVariant, inputVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightWithTrayClasses,
  sizePaddingRightWithTrayTwoClasses,
} from "@/control-size/control-size.util.ts";
import {
  clampDate,
  completeDateText,
  type DateLabels,
  dateSegmentAt,
  defaultDateLabels,
  editDateText,
  formatDateText,
  isDayOutOfRange,
  isValidDate,
  parseDateFormat,
  parseDateText,
  startOfDay,
  stepDateSegment,
  toISOLocal,
  type WeekStart,
} from "@/util/date.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type DateFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max'> & {
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  size?: Size;
  variant?: InputVariant;
  /** The date, in local time. Null while the field is empty or not yet a complete, valid date. */
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  /**
   * How the date is typed and shown, from the tokens `dd`, `MM`, `yyyy`, `HH`
   * (24-hour) and `mm` with any separators between them — e.g. `MM/dd/yyyy`.
   */
  format?: string;
  min?: Date;
  max?: Date;
  /** BCP 47 locale for the calendar's month and weekday names; defaults to the browser's. */
  locale?: string;
  /** First day of the week, 0 (Sunday) – 6. Defaults to 1 (Monday). */
  weekStartsOn?: WeekStart;
  labels?: Partial<DateLabels>;
  /** Adds the hour and minute columns to the picker. */
  withTime?: boolean;
  /** Minutes between the options of the minute column. Typing is not restricted by it. */
  minuteStep?: number;
  ref?: React.Ref<HTMLInputElement>;
}


/* The masked text field + calendar popover behind InputDate and InputDateTime. */
export const DateField = (props: DateFieldProps) => {

  const {
    className,
    label,
    description,
    error,
    size = 'md',
    variant = 'default',
    value,
    defaultValue,
    onChange,
    format = 'dd-MM-yyyy',
    min,
    max,
    locale,
    weekStartsOn,
    labels: labelsProp,
    withTime = false,
    minuteStep,
    placeholder,
    name,
    disabled,
    readOnly,
    onClick,
    onKeyDown,
    ref,
    ...rest
  } = props;

  const labels = { ...defaultDateLabels, ...labelsProp };
  const segments = useMemo(() => parseDateFormat(format), [format]);

  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const rawValue = value !== undefined ? value : internalValue;
  const current = isValidDate(rawValue) ? rawValue : null;
  const currentText = current ? formatDateText(segments, current) : '';

  // `text` is what the user is typing; it is only replaced when the value changes from outside
  const [text, setText] = useState(currentText);
  const [syncedText, setSyncedText] = useState(currentText);
  if (currentText !== syncedText) {
    setSyncedText(currentText);
    setText(currentText);
  }

  const [open, setOpen] = useState(false);
  const [focusCalendar, setFocusCalendar] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { anchorRef, Popover } = usePopover({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
  });

  useDismiss(open, () => {
    // Escape from inside the calendar hands focus back to the field
    if (panelRef.current?.contains(document.activeElement)) inputRef.current?.focus();
    setOpen(false);
  });

  const inRange = (date: Date) => withTime
    ? (!min || date.getTime() >= min.getTime()) && (!max || date.getTime() <= max.getTime())
    : !isDayOutOfRange(date, min, max);

  const parse = (masked: string): Date | null => {
    const date = parseDateText(segments, masked);
    return date && inRange(date) ? date : null;
  };

  const commit = (next: Date | null) => {
    const nextText = next ? formatDateText(segments, next) : '';
    setSyncedText(nextText);
    if (value === undefined) setInternalValue(next);
    if (nextText !== currentText) onChange?.(next);
  };

  /* Writes the text and caret to the DOM right away, so the caret survives React re-applying the value. */
  const show = (nextText: string, selectionStart: number, selectionEnd: number = selectionStart) => {
    setText(nextText);
    const input = inputRef.current;
    if (!input) return;
    input.value = nextText;
    if (document.activeElement === input) input.setSelectionRange(selectionStart, selectionEnd);
  };

  const openPicker = (withFocus: boolean) => {
    if (disabled || readOnly) return;
    setFocusCalendar(withFocus);
    setOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const forwardDelete = (event.nativeEvent as InputEvent).inputType === 'deleteContentForward';
    const result = editDateText(segments, text, input.value, input.selectionStart ?? input.value.length, forwardDelete);
    show(result.text, result.caret);
    commit(parse(result.text));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || readOnly) return;

    if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      if (open) panelRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
      else openPicker(true);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // Step the segment under the caret, like a native date input
      event.preventDefault();
      const segment = dateSegmentAt(segments, text, event.currentTarget.selectionStart ?? 0);
      const direction = event.key === 'ArrowUp' ? 1 : -1;
      const next = current ? stepDateSegment(current, segment.type, direction) : clampDate(withTime ? new Date() : startOfDay(new Date()), min, max);
      if (!inRange(next)) return;
      const nextText = formatDateText(segments, next);
      const range = dateSegmentAt(segments, nextText, segment.start);
      show(nextText, range.start, range.end);
      commit(next);
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  /* Leaving the field settles whatever was typed: completed when it can be, cleared when it cannot. */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.relatedTarget as Node | null;
    if (target && (rootRef.current?.contains(target) || panelRef.current?.contains(target))) return;
    setOpen(false);
    const completed = completeDateText(segments, text);
    const next = completed !== null ? parse(completed) : null;
    setText(next ? formatDateText(segments, next) : '');
    commit(next);
  };

  const handlePick = (picked: Date, close: boolean) => {
    const next = withTime ? clampDate(picked, min, max) : picked;
    setText(formatDateText(segments, next));
    commit(next);
    if (close) {
      setOpen(false);
      inputRef.current?.focus();
    }
  };

  const CalendarIcon = withTime ? IconCalendarTime : IconCalendar;

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        ref={ rootRef }
        onBlur={ handleBlur }
        className={ classNames(
          'mat:flex mat:flex-col',
          className
        ) }>
        <InputLabel htmlFor={ rest.id }>{ label }</InputLabel>
        <div className={ 'mat:flex mat:flex-col mat:relative' } ref={ anchorRef }>
          <input
            ref={ mergeRefs([ inputRef, ref ]) }
            type={ 'text' }
            inputMode={ 'numeric' }
            autoComplete={ 'off' }
            placeholder={ placeholder ?? format.toLowerCase() }
            disabled={ disabled }
            readOnly={ readOnly }
            className={ classNames(
              'mat:border-[length:var(--border-width-input)] input-base mat:transition-all mat:duration-[var(--control-transition-duration)] mat:rounded-[var(--border-radius-input)] mat:ring-0 mat:focus:ring-[length:var(--control-ring-width)] mat:focus:outline-none mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-numeric)] mat:tabular-nums',
              inputVariantClasses[variant],
              sizeHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              error ? sizePaddingRightWithTrayTwoClasses[size] : sizePaddingRightWithTrayClasses[size],
              error && 'input-error',
            ) }
            value={ text }
            onChange={ handleChange }
            onKeyDown={ handleKeyDown }
            onClick={ (event) => {
              onClick?.(event);
              openPicker(false);
            } }
            { ...rest }
          />
          { name && (
            <input type={ 'hidden' } name={ name } value={ current ? toISOLocal(current, withTime) : '' }/>
          ) }
          {/* Pressing the tray must not take focus out of the field */ }
          <InputIconButtonTray>
            { error && (
              <InputErrorIcon/>
            ) }
            <div
              role={ 'button' }
              aria-label={ labels.openCalendar }
              aria-expanded={ open }
              onMouseDown={ (event) => event.preventDefault() }
            >
              <InputIconButton
                Icon={ CalendarIcon }
                onClick={ () => {
                  if (open) {
                    setOpen(false);
                  } else {
                    inputRef.current?.focus();
                    openPicker(false);
                  }
                } }
              />
            </div>
          </InputIconButtonTray>
          <Popover open={ open }>
            <DropdownPanel
              ref={ panelRef }
              padding={ 'sm' }
              // Clicks in the picker keep the caret in the field, so picking and typing mix freely
              onMouseDown={ (event) => event.preventDefault() }
            >
              <div className={ 'mat:flex mat:flex-row' }>
                <Calendar
                  value={ current }
                  onChange={ (picked) => handlePick(picked, !withTime) }
                  min={ min }
                  max={ max }
                  locale={ locale }
                  weekStartsOn={ weekStartsOn }
                  labels={ labels }
                  autoFocus={ focusCalendar }
                />
                { withTime && (
                  <TimeColumns
                    value={ current }
                    onChange={ (picked) => handlePick(picked, false) }
                    min={ min }
                    max={ max }
                    minuteStep={ minuteStep }
                    labels={ labels }
                  />
                ) }
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
