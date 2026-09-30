export type DateSegmentType = 'day' | 'month' | 'year' | 'hour' | 'minute';

export type DateSegment = {
  type: DateSegmentType;
  length: number;
  /** Literal text between this segment and the next ('' after the last). */
  literal: string;
};

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DateLabels = {
  previous: string;
  next: string;
  today: string;
  changeView: string;
  openCalendar: string;
  hours: string;
  minutes: string;
};

export const defaultDateLabels: DateLabels = {
  previous: 'Previous',
  next: 'Next',
  today: 'Today',
  changeView: 'Change view',
  openCalendar: 'Open calendar',
  hours: 'Hours',
  minutes: 'Minutes',
};

/* ── Date math ─────────────────────────────────────────────────────── */

/* `new Date(y, m, d)` maps years 0–99 onto 1900–1999; setFullYear does not. */
export const makeDate = (year: number, month: number, day: number, hours = 0, minutes = 0): Date => {
  const date = new Date(0);
  date.setFullYear(year, month, day);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const isValidDate = (date: Date | null | undefined): date is Date => !!date && !Number.isNaN(date.getTime());

export const daysInMonth = (year: number, month: number): number => makeDate(year, month + 1, 0).getDate();

export const startOfDay = (date: Date): Date => makeDate(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

/* Keeps the day of month where it exists, otherwise the month's last day (31 Jan + 1 → 28/29 Feb). */
export const addMonths = (date: Date, amount: number): Date => {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + amount);
  next.setDate(Math.min(day, daysInMonth(next.getFullYear(), next.getMonth())));
  return next;
};

export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Months since year 0 — orders and compares calendar pages. */
export const monthIndex = (date: Date): number => date.getFullYear() * 12 + date.getMonth();

/** True when the whole day lies before `min` or after `max` (compared per day, ignoring time). */
export const isDayOutOfRange = (day: Date, min?: Date, max?: Date): boolean => {
  const time = startOfDay(day).getTime();
  return (!!min && time < startOfDay(min).getTime()) || (!!max && time > startOfDay(max).getTime());
};

export const clampDate = (date: Date, min?: Date, max?: Date): Date => {
  if (min && date.getTime() < min.getTime()) return new Date(min);
  if (max && date.getTime() > max.getTime()) return new Date(max);
  return date;
};

const pad = (value: number, length: number): string => String(value).padStart(length, '0');

/** Local wall time as `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm` — what a native date input would submit. */
export const toISOLocal = (date: Date, withTime: boolean): string => {
  const day = `${ pad(date.getFullYear(), 4) }-${ pad(date.getMonth() + 1, 2) }-${ pad(date.getDate(), 2) }`;
  return withTime ? `${ day }T${ pad(date.getHours(), 2) }:${ pad(date.getMinutes(), 2) }` : day;
};

/* ── Format ────────────────────────────────────────────────────────── */

const TOKEN_TYPES: Record<string, DateSegmentType> = { dd: 'day', MM: 'month', yyyy: 'year', HH: 'hour', mm: 'minute' };

/**
 * Splits a format such as `dd-MM-yyyy HH:mm` into its segments. Tokens: `dd`,
 * `MM`, `yyyy`, `HH` (24-hour) and `mm`; anything between them is a literal.
 */
export const parseDateFormat = (format: string): DateSegment[] => {
  const segments: DateSegment[] = [];
  const pattern = /(dd|MM|yyyy|HH|mm)([^dMyHm]*)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(format)) !== null) {
    segments.push({ type: TOKEN_TYPES[match[1]], length: match[1].length, literal: match[2] });
  }
  if (segments.length === 0) {
    throw new Error(`Invalid date format "${ format }" — use the tokens dd, MM, yyyy, HH and mm.`);
  }
  segments[segments.length - 1].literal = '';
  return segments;
};

const segmentValue = (type: DateSegmentType, date: Date): number => {
  switch (type) {
    case 'day': return date.getDate();
    case 'month': return date.getMonth() + 1;
    case 'year': return date.getFullYear();
    case 'hour': return date.getHours();
    case 'minute': return date.getMinutes();
  }
};

export const formatDateText = (segments: DateSegment[], date: Date): string =>
  segments.map((segment) => pad(segmentValue(segment.type, date), segment.length) + segment.literal).join('');

/* ── Masked text ───────────────────────────────────────────────────── */

type Cursor = { index: number; offset: number };

const isDigit = (char: string | undefined): boolean => char !== undefined && char >= '0' && char <= '9';

const SEPARATOR = /[\s\-/.:,T]/;

/* The highest digit a two-digit segment can start with; anything above can
 * only be a single-digit value, so it is zero-padded at once ("4" → "04"). */
const FIRST_DIGIT_MAX: Record<DateSegmentType, number> = { day: 3, month: 1, year: 9, hour: 2, minute: 5 };

/**
 * Reads masked text back into per-segment digits, plus the segment cursor for
 * every caret position. The text is always our own output, so the literals
 * are where the format says they are.
 */
const readDateText = (segments: DateSegment[], text: string) => {
  const values = segments.map(() => '');
  const cursors: Cursor[] = [];
  let pos = 0;
  for (let index = 0; index < segments.length; index++) {
    while (pos < text.length && values[index].length < segments[index].length && isDigit(text[pos])) {
      cursors[pos] = { index, offset: values[index].length };
      values[index] += text[pos++];
    }
    cursors[pos] = { index, offset: values[index].length };
    const { literal } = segments[index];
    if (index === segments.length - 1 || pos >= text.length || !text.startsWith(literal, pos)) break;
    // Inside or right after the literal is the start of the next segment
    for (let i = 1; i <= literal.length; i++) cursors[pos + i] = { index: index + 1, offset: 0 };
    pos += literal.length;
  }
  const cursorAt = (position: number): Cursor => ({ ...cursors[Math.max(0, Math.min(position, cursors.length - 1))] });
  return { values, cursors, cursorAt };
};

const completeSegment = (segment: DateSegment, value: string): string => {
  if (segment.length === 2 && value.length === 1) {
    // "0" is a whole hour or minute, but never a whole day or month
    const zeroIsValid = segment.type === 'hour' || segment.type === 'minute';
    return value === '0' && !zeroIsValid ? value : '0' + value;
  }
  if (segment.type === 'year' && value.length === 2) {
    // Two-digit years land in the century that keeps them within 20 years ahead of today
    const currentYear = new Date().getFullYear();
    const year = currentYear - (currentYear % 100) + Number(value);
    return String(year > currentYear + 20 ? year - 100 : year);
  }
  return value;
};

const typeChar = (segments: DateSegment[], values: string[], cursor: Cursor, char: string) => {
  const lastIndex = segments.length - 1;

  if (!isDigit(char)) {
    // A separator moves on to the next segment, completing the one being typed ("3-" → "03-")
    if (!SEPARATOR.test(char) || cursor.offset === 0 || cursor.index === lastIndex) return;
    const completed = completeSegment(segments[cursor.index], values[cursor.index]);
    if (completed.length < segments[cursor.index].length) return;
    values[cursor.index] = completed;
    cursor.index++;
    cursor.offset = 0;
    return;
  }

  if (cursor.offset >= segments[cursor.index].length) {
    if (cursor.index === lastIndex) return;
    cursor.index++;
    cursor.offset = 0;
  }

  const segment = segments[cursor.index];
  const value = values[cursor.index];
  if (cursor.offset === 0 && segment.length === 2 && Number(char) > FIRST_DIGIT_MAX[segment.type]) {
    values[cursor.index] = '0' + char;
    cursor.offset = 2;
  } else if (value.length >= segment.length) {
    // A full segment is overwritten in place rather than pushing digits into its neighbours
    values[cursor.index] = value.slice(0, cursor.offset) + char + value.slice(cursor.offset + 1);
    cursor.offset++;
  } else {
    values[cursor.index] = value.slice(0, cursor.offset) + char + value.slice(cursor.offset);
    cursor.offset++;
  }

  // Filled: hop over the literal so typing flows straight through
  if (cursor.offset >= segment.length && values[cursor.index].length >= segment.length && cursor.index < lastIndex) {
    cursor.index++;
    cursor.offset = 0;
  }
};

const buildDateText = (segments: DateSegment[], values: string[], cursor: Cursor): { text: string; caret: number } => {
  let last = values.length - 1;
  while (last >= 0 && values[last] === '') last--;
  if (last < 0) return { text: '', caret: 0 };

  // Show the literal the cursor has already moved past ("03-"), but never a run of empty segments
  const shown = Math.min(Math.max(last, cursor.index), last + 1, segments.length - 1);
  let text = '';
  let caret = -1;
  for (let i = 0; i <= shown; i++) {
    if (i === cursor.index) caret = text.length + Math.min(cursor.offset, values[i].length);
    text += values[i];
    if (i < shown) text += segments[i].literal;
  }
  return { text, caret: caret === -1 ? text.length : caret };
};

const ISO_PATTERN = /^\s*(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/**
 * Applies an edit the browser made to the masked text — `next` with its caret,
 * relative to the previous masked `text` — and returns the new masked text and
 * caret. Segments keep their place: deleting digits never shifts the ones
 * after them, and the literals cannot be removed.
 */
export const editDateText = (
  segments: DateSegment[],
  text: string,
  next: string,
  caret: number,
  forwardDelete: boolean = false,
): { text: string; caret: number } => {
  // What changed: `text[start, end)` was replaced by `inserted`, which ends at the caret
  let suffix = 0;
  while (suffix < next.length - caret && suffix < text.length && text[text.length - 1 - suffix] === next[next.length - 1 - suffix]) suffix++;
  let start = 0;
  const startLimit = Math.min(caret, text.length - suffix, next.length - suffix);
  while (start < startLimit && text[start] === next[start]) start++;
  let end = text.length - suffix;
  const inserted = next.slice(start, next.length - suffix);

  const { cursors, cursorAt } = readDateText(segments, text);
  let cursor = cursorAt(start);

  // Deleting just a literal takes the digit beyond it instead
  if (inserted === '' && end > start && !/\d/.test(text.slice(start, end))) {
    if (forwardDelete) {
      while (end < text.length && !isDigit(text[end])) end++;
      cursor = cursorAt(end);
      if (end < text.length) end++;
    } else {
      while (start > 0 && !isDigit(text[start - 1])) start--;
      if (start > 0) start--;
      cursor = cursorAt(start);
    }
  }

  let values = segments.map(() => '');
  for (let pos = 0; pos < text.length; pos++) {
    if ((pos < start || pos >= end) && isDigit(text[pos]) && cursors[pos]) values[cursors[pos].index] += text[pos];
  }

  const iso = ISO_PATTERN.exec(inserted);
  if (iso) {
    // A pasted ISO date fills the segments whatever order the format shows them in
    const parts: Record<DateSegmentType, string> = { year: iso[1], month: iso[2], day: iso[3], hour: iso[4] ?? '', minute: iso[5] ?? '' };
    values = segments.map((segment) => parts[segment.type]);
    cursor = { index: segments.length - 1, offset: segments[segments.length - 1].length };
  } else {
    for (const char of inserted) typeChar(segments, values, cursor, char);
  }

  return buildDateText(segments, values, cursor);
};

/** The segment under a caret position, with its range in the text. */
export const dateSegmentAt = (segments: DateSegment[], text: string, caret: number): { type: DateSegmentType; start: number; end: number } => {
  const { values, cursorAt } = readDateText(segments, text);
  const { index } = cursorAt(caret);
  let start = 0;
  for (let i = 0; i < index; i++) start += values[i].length + segments[i].literal.length;
  return { type: segments[index].type, start, end: start + values[index].length };
};

/** Parses masked text; null unless every segment is filled in and forms a real date. */
export const parseDateText = (segments: DateSegment[], text: string): Date | null => {
  const { values } = readDateText(segments, text);
  if (values.some((value, index) => value.length !== segments[index].length)) return null;

  const now = new Date();
  const parts: Record<DateSegmentType, number> = { year: now.getFullYear(), month: 1, day: 1, hour: 0, minute: 0 };
  segments.forEach((segment, index) => {
    parts[segment.type] = Number(values[index]);
  });

  const { year, month, day, hour, minute } = parts;
  if (year < 1 || month < 1 || month > 12 || hour > 23 || minute > 59) return null;
  if (day < 1 || day > daysInMonth(year, month - 1)) return null;
  return makeDate(year, month - 1, day, hour, minute);
};

/**
 * Finishes text the user left half-typed: pads single digits ("3-11-2025"),
 * expands a two-digit year, and defaults a missing time to 00:00. Returns
 * null when it still is not a complete date.
 */
export const completeDateText = (segments: DateSegment[], text: string): string | null => {
  const values = readDateText(segments, text).values.map((value, index) => completeSegment(segments[index], value));
  const isTime = (segment: DateSegment) => segment.type === 'hour' || segment.type === 'minute';
  const dateComplete = segments.every((segment, index) => isTime(segment) || values[index].length === segment.length);
  const timeEmpty = segments.every((segment, index) => !isTime(segment) || values[index] === '');
  if (dateComplete && timeEmpty) {
    segments.forEach((segment, index) => {
      if (isTime(segment)) values[index] = '00';
    });
  }
  if (values.some((value, index) => value.length !== segments[index].length)) return null;
  return segments.map((segment, index) => values[index] + segment.literal).join('');
};

/** Steps one segment of a date, e.g. the month by +1, the way arrow keys do in a native date input. */
export const stepDateSegment = (date: Date, type: DateSegmentType, amount: number): Date => {
  switch (type) {
    case 'day': return addDays(date, amount);
    case 'month': return addMonths(date, amount);
    case 'year': return addMonths(date, amount * 12);
    case 'hour': {
      const next = new Date(date);
      next.setHours(next.getHours() + amount);
      return next;
    }
    case 'minute': {
      const next = new Date(date);
      next.setMinutes(next.getMinutes() + amount);
      return next;
    }
  }
};
