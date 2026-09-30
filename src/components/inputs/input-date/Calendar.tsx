import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import {
  addDays,
  addMonths,
  clampDate,
  type DateLabels,
  daysInMonth,
  defaultDateLabels,
  isDayOutOfRange,
  isSameDay,
  makeDate,
  monthIndex,
  startOfDay,
  type WeekStart,
} from "@/util/date.util.ts";


export type CalendarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  value?: Date | null;
  /** Called with the picked day; the time of day of `value` is carried over. */
  onChange?: (value: Date) => void;
  min?: Date;
  max?: Date;
  /** BCP 47 locale for month and weekday names; defaults to the browser's. */
  locale?: string;
  /** First day of the week, 0 (Sunday) – 6. Defaults to 1 (Monday). */
  weekStartsOn?: WeekStart;
  labels?: Partial<DateLabels>;
  showToday?: boolean;
  /** Move keyboard focus to the active day on mount. */
  autoFocus?: boolean;
}

type View = 'days' | 'months' | 'years';

/* How the next page enters: sliding sideways (another month/year) or zooming
 * (another view; direction 1 zooms out to the coarser view). */
type PageMotion = { kind: 'slide' | 'zoom'; direction: number };

const YEARS_PER_PAGE = 12;

const pageVariants = {
  enter: (m: PageMotion) => m.kind === 'zoom' ? { opacity: 0, scale: 1 + m.direction * 0.08 } : { opacity: 0, x: m.direction * 24 },
  center: { opacity: 1, scale: 1, x: 0 },
  exit: (m: PageMotion) => m.kind === 'zoom' ? { opacity: 0, scale: 1 - m.direction * 0.08 } : { opacity: 0, x: m.direction * -24 },
};

const cell = 'calendar-cell mat:inline-flex mat:items-center mat:justify-center mat:p-0 mat:select-none mat:cursor-pointer mat:border-[length:var(--border-width-input)] mat:border-transparent mat:rounded-[var(--border-radius-calendar-cell)] mat:font-[family-name:var(--font-family-base)] mat:ring-0 mat:focus:outline-none mat:focus-visible:ring-[length:var(--control-ring-width)] mat:transition-all mat:duration-[var(--control-transition-duration-fast)] mat:disabled:cursor-default';
const cellText = 'mat:text-[length:var(--font-size-calendar-cell)] mat:font-[number:var(--font-weight-calendar-cell)] mat:tabular-nums';
const cellSquare = 'mat:h-[var(--calendar-cell-size)] mat:w-[var(--calendar-cell-size)]';
const titleText = 'mat:text-[length:var(--font-size-calendar-title)] mat:font-[number:var(--font-weight-calendar-title)]';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);


export const Calendar = (props: CalendarProps) => {

  const {
    value = null,
    onChange,
    min,
    max,
    locale,
    weekStartsOn = 1,
    labels: labelsProp,
    showToday = true,
    autoFocus = false,
    className,
    ...rest
  } = props;

  const labels = { ...defaultDateLabels, ...labelsProp };
  const today = startOfDay(new Date());

  // The day that holds keyboard focus; its month is the page on show
  const [focused, setFocused] = useState<Date>(() => startOfDay(value ?? clampDate(new Date(), min, max)));
  const [view, setView] = useState<View>('days');
  const [pageMotion, setPageMotion] = useState<PageMotion>({ kind: 'slide', direction: 1 });

  const activeRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef(autoFocus);

  const moveTo = (next: Date) => {
    const diff = monthIndex(next) - monthIndex(focused);
    if (diff !== 0) setPageMotion({ kind: 'slide', direction: Math.sign(diff) });
    setFocused(next);
  };

  const changeView = (next: View, direction: number) => {
    setPageMotion({ kind: 'zoom', direction });
    setView(next);
  };

  // Follow the value when it changes from outside (typed into the field)
  const valueKey = value ? startOfDay(value).getTime() : null;
  const [syncedKey, setSyncedKey] = useState(valueKey);
  if (valueKey !== syncedKey) {
    setSyncedKey(valueKey);
    if (value) {
      moveTo(startOfDay(value));
      if (view !== 'days') changeView('days', -1);
    }
  }

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    activeRef.current?.focus({ preventScroll: true });
  });

  const formatters = useMemo(() => ({
    title: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    month: new Intl.DateTimeFormat(locale, { month: 'short' }),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    day: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
  }), [locale]);

  const year = focused.getFullYear();
  const month = focused.getMonth();
  const yearPageStart = year - (year % YEARS_PER_PAGE);

  const isDisabled = (day: Date) => isDayOutOfRange(day, min, max);

  /* ── paging ── */

  // A page spans `pageMonths` months starting at `pageStart` (in months since year 0)
  const pageMonths = view === 'days' ? 1 : view === 'months' ? 12 : 12 * YEARS_PER_PAGE;
  const pageStart = view === 'days' ? monthIndex(focused) : view === 'months' ? year * 12 : yearPageStart * 12;

  const canPage = (direction: number) => {
    const start = pageStart + direction * pageMonths;
    return !(min && start + pageMonths - 1 < monthIndex(min)) && !(max && start > monthIndex(max));
  };

  const handlePage = (direction: number) => {
    if (canPage(direction)) moveTo(addMonths(focused, direction * pageMonths));
  };

  const handleTitleClick = () => {
    if (view === 'days') changeView('months', 1);
    else if (view === 'months') changeView('years', 1);
    else changeView('days', -1);
  };

  const title = view === 'days'
    ? capitalize(formatters.title.format(focused))
    : view === 'months' ? String(year) : `${ yearPageStart } – ${ yearPageStart + YEARS_PER_PAGE - 1 }`;

  /* ── days ── */

  const handleSelectDay = (day: Date) => {
    if (isDisabled(day)) return;
    moveTo(day);
    if (view !== 'days') changeView('days', -1);
    onChange?.(makeDate(day.getFullYear(), day.getMonth(), day.getDate(), value?.getHours() ?? 0, value?.getMinutes() ?? 0));
  };

  const handleDaysKeyDown = (event: React.KeyboardEvent) => {
    let next: Date;
    switch (event.key) {
      case 'ArrowLeft': next = addDays(focused, -1); break;
      case 'ArrowRight': next = addDays(focused, 1); break;
      case 'ArrowUp': next = addDays(focused, -7); break;
      case 'ArrowDown': next = addDays(focused, 7); break;
      case 'Home': next = addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)); break;
      case 'End': next = addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)); break;
      case 'PageUp': next = addMonths(focused, event.shiftKey ? -12 : -1); break;
      case 'PageDown': next = addMonths(focused, event.shiftKey ? 12 : 1); break;
      default: return;
    }
    event.preventDefault();
    if (isDisabled(next)) return;
    pendingFocus.current = true;
    moveTo(next);
  };

  const renderDays = () => {
    const monthStart = makeDate(year, month, 1);
    const gridStart = addDays(monthStart, -((monthStart.getDay() - weekStartsOn + 7) % 7));
    // Always six weeks, so the panel keeps its height from month to month
    const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
    return (
      <div className={ 'mat:grid mat:grid-cols-7' } onKeyDown={ handleDaysKeyDown }>
        { days.slice(0, 7).map((day) => (
          <div
            key={ day.getDay() }
            className={ classNames('calendar-weekday mat:flex mat:items-center mat:justify-center mat:select-none mat:text-[length:var(--font-size-calendar-weekday)] mat:font-[number:var(--font-weight-calendar-cell)]', cellSquare) }
          >
            { capitalize(formatters.weekday.format(day)).slice(0, 2) }
          </div>
        )) }
        { days.map((day) => {
          const active = isSameDay(day, focused);
          const selected = isSameDay(day, value);
          const disabled = isDisabled(day);
          return (
            <button
              key={ day.getTime() }
              ref={ active ? activeRef : undefined }
              type={ 'button' }
              tabIndex={ active ? 0 : -1 }
              disabled={ disabled }
              aria-label={ formatters.day.format(day) }
              aria-pressed={ selected }
              aria-current={ isSameDay(day, today) ? 'date' : undefined }
              onClick={ () => handleSelectDay(day) }
              className={ classNames(
                cell,
                cellText,
                cellSquare,
                day.getMonth() !== month && 'calendar-cell-outside',
                isSameDay(day, today) && 'calendar-cell-today',
                selected && 'calendar-cell-selected',
                disabled && 'calendar-cell-disabled',
              ) }
            >
              { day.getDate() }
            </button>
          );
        }) }
      </div>
    );
  };

  /* ── months & years ── */

  const renderOptions = (options: { key: number; label: string; selected: boolean; disabled: boolean; onClick: () => void }[]) => (
    <div className={ 'mat:grid mat:grid-cols-3 mat:grid-rows-4 mat:gap-1 mat:h-full' }>
      { options.map((option) => (
        <button
          key={ option.key }
          type={ 'button' }
          disabled={ option.disabled }
          aria-pressed={ option.selected }
          onClick={ option.onClick }
          className={ classNames(
            cell,
            cellText,
            option.selected && 'calendar-cell-selected',
            option.disabled && 'calendar-cell-disabled',
          ) }
        >
          { option.label }
        </button>
      )) }
    </div>
  );

  const renderMonths = () => renderOptions(Array.from({ length: 12 }, (_, m) => ({
    key: m,
    label: capitalize(formatters.month.format(makeDate(year, m, 1))),
    selected: !!value && value.getFullYear() === year && value.getMonth() === m,
    disabled: (!!min && year * 12 + m < monthIndex(min)) || (!!max && year * 12 + m > monthIndex(max)),
    onClick: () => {
      setFocused(makeDate(year, m, Math.min(focused.getDate(), daysInMonth(year, m))));
      changeView('days', -1);
    },
  })));

  const renderYears = () => renderOptions(Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
    const y = yearPageStart + i;
    return {
      key: y,
      label: String(y),
      selected: !!value && value.getFullYear() === y,
      disabled: (!!min && y < min.getFullYear()) || (!!max && y > max.getFullYear()),
      onClick: () => {
        setFocused(makeDate(y, month, Math.min(focused.getDate(), daysInMonth(y, month))));
        changeView('months', -1);
      },
    };
  }));

  const navButton = (direction: number, Icon: typeof IconChevronLeft, label: string) => (
    <button
      type={ 'button' }
      aria-label={ label }
      disabled={ !canPage(direction) }
      onClick={ () => handlePage(direction) }
      className={ classNames(cell, cellSquare, 'mat:shrink-0', !canPage(direction) && 'calendar-cell-disabled') }
    >
      <Icon className={ 'mat:h-4 mat:w-4' }/>
    </button>
  );

  return (
    <div className={ classNames('mat:flex mat:flex-col mat:gap-1 mat:font-[family-name:var(--font-family-base)]', className) } { ...rest }>
      <div className={ 'mat:flex mat:flex-row mat:items-center mat:justify-between mat:gap-1' }>
        { navButton(-1, IconChevronLeft, labels.previous) }
        <button
          type={ 'button' }
          aria-label={ `${ title } — ${ labels.changeView }` }
          onClick={ handleTitleClick }
          className={ classNames(cell, titleText, 'mat:h-[var(--calendar-cell-size)] mat:px-3 mat:tabular-nums') }
        >
          { title }
        </button>
        { navButton(1, IconChevronRight, labels.next) }
      </div>
      {/* Clips the sliding pages; the padding (cancelled by the margin) leaves room for the cells' focus ring */ }
      <div className={ 'mat:overflow-hidden mat:p-1 mat:-m-1' }>
        <div className={ 'mat:relative mat:w-[calc(var(--calendar-cell-size)_*_7)] mat:h-[calc(var(--calendar-cell-size)_*_7)]' }>
          <AnimatePresence mode={ 'popLayout' } initial={ false } custom={ pageMotion }>
            <motion.div
              key={ `${ view }-${ pageStart }` }
              className={ 'mat:h-full mat:w-full' }
              custom={ pageMotion }
              variants={ pageVariants }
              initial={ 'enter' }
              animate={ 'center' }
              exit={ 'exit' }
              transition={ { duration: 0.18, ease: "easeInOut" } }
            >
              { view === 'days' ? renderDays() : view === 'months' ? renderMonths() : renderYears() }
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      { showToday && (
        <div className={ 'calendar-divider mat:flex mat:flex-row mat:justify-center mat:border-t-[length:var(--border-width-input)] mat:pt-1' }>
          <button
            type={ 'button' }
            disabled={ isDisabled(today) }
            onClick={ () => handleSelectDay(today) }
            className={ classNames(cell, titleText, 'mat:h-[var(--calendar-cell-size)] mat:px-3', isDisabled(today) && 'calendar-cell-disabled') }
          >
            { labels.today }
          </button>
        </div>
      ) }
    </div>
  );
};
