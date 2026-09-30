import * as React from "react";
import { useLayoutEffect, useRef } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { clampDate, type DateLabels, makeDate } from "@/util/date.util.ts";


export type TimeColumnsProps = {
  value: Date | null;
  onChange: (value: Date) => void;
  min?: Date;
  max?: Date;
  minuteStep?: number;
  labels: DateLabels;
}

type TimeColumnProps = {
  label: string;
  options: number[];
  selected: number | null;
  isDisabled: (option: number) => boolean;
  onSelect: (option: number) => void;
}

const option = 'calendar-cell mat:inline-flex mat:shrink-0 mat:items-center mat:justify-center mat:p-0 mat:w-full mat:h-[var(--calendar-cell-size)] mat:select-none mat:cursor-pointer mat:border-[length:var(--border-width-input)] mat:border-transparent mat:rounded-[var(--border-radius-calendar-cell)] mat:font-[family-name:var(--font-family-base)] mat:text-[length:var(--font-size-calendar-cell)] mat:font-[number:var(--font-weight-calendar-cell)] mat:tabular-nums mat:ring-0 mat:focus:outline-none mat:focus-visible:ring-[length:var(--control-ring-width)] mat:transition-all mat:duration-[var(--control-transition-duration-fast)] mat:disabled:cursor-default';


const TimeColumn = (props: TimeColumnProps) => {
  const { label, options, selected, isDisabled, onSelect } = props;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // Keep the selected option centred: at once on open, gliding when it changes
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (scroller && target) {
      scroller.scrollTo({
        top: target.offsetTop - (scroller.clientHeight - target.offsetHeight) / 2,
        behavior: mounted.current ? 'smooth' : 'auto',
      });
    }
    mounted.current = true;
  }, [selected]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const current = event.target as HTMLElement;
    const next = event.key === 'ArrowDown' ? current.nextElementSibling : current.previousElementSibling;
    (next as HTMLElement | null)?.focus();
  };

  // One tab stop per column: the selected option, or the first when nothing is selected
  const tabStop = selected !== null && options.includes(selected) ? selected : options[0];

  return (
    <div className={ 'mat:relative mat:w-[calc(var(--calendar-cell-size)_+_0.5rem)]' }>
      <div
        ref={ scrollerRef }
        role={ 'group' }
        aria-label={ label }
        onKeyDown={ handleKeyDown }
        className={ 'mat-ui-hide-scrollbars mat:absolute mat:inset-0 mat:flex mat:flex-col mat:gap-0.5 mat:overflow-y-auto mat:p-1' }
      >
        { options.map((value) => (
          <button
            key={ value }
            type={ 'button' }
            tabIndex={ value === tabStop ? 0 : -1 }
            disabled={ isDisabled(value) }
            aria-pressed={ value === selected }
            onClick={ () => onSelect(value) }
            className={ classNames(
              option,
              value === selected && 'calendar-cell-selected',
              isDisabled(value) && 'calendar-cell-disabled',
            ) }
          >
            { String(value).padStart(2, '0') }
          </button>
        )) }
      </div>
    </div>
  );
};


/* The hour and minute columns beside the calendar of InputDateTime. */
export const TimeColumns = (props: TimeColumnsProps) => {
  const { value, onChange, min, max, minuteStep = 5, labels } = props;

  const base = value ?? new Date();
  const hours = value ? value.getHours() : null;
  const minutes = value ? value.getMinutes() : null;
  const at = (h: number, m: number) => makeDate(base.getFullYear(), base.getMonth(), base.getDate(), h, m);

  const hourOptions = Array.from({ length: 24 }, (_, h) => h);
  const step = Math.max(1, Math.floor(minuteStep));
  const minuteOptions = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
  // A typed minute that is off the step still gets an option to show as selected
  if (minutes !== null && !minuteOptions.includes(minutes)) {
    minuteOptions.push(minutes);
    minuteOptions.sort((a, b) => a - b);
  }

  const outOfRange = (from: Date, to: Date) => (!!max && from.getTime() > max.getTime()) || (!!min && to.getTime() < min.getTime());

  return (
    <div className={ 'calendar-divider mat:flex mat:flex-row mat:border-l-[length:var(--border-width-input)] mat:ml-2 mat:pl-1' }>
      <TimeColumn
        label={ labels.hours }
        options={ hourOptions }
        selected={ hours }
        isDisabled={ (h) => outOfRange(at(h, 0), at(h, 59)) }
        onSelect={ (h) => onChange(clampDate(at(h, minutes ?? 0), min, max)) }
      />
      <TimeColumn
        label={ labels.minutes }
        options={ minuteOptions }
        selected={ minutes }
        isDisabled={ (m) => outOfRange(at(hours ?? 0, m), at(hours ?? 0, m)) }
        onSelect={ (m) => onChange(at(hours ?? 0, m)) }
      />
    </div>
  );
};
