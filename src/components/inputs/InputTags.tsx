import * as React from "react";
import { useId, useRef, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { Badge } from "@/components/Badge.tsx";
import { InputLabel } from "@/components/inputs/InputLabel.tsx";
import { InputErrorIcon } from "@/components/inputs/InputErrorIcon.tsx";
import { InputIconButtonTray } from "@/components/inputs/InputIconButtonTray.tsx";
import { InputDescription } from "@/components/inputs/InputDescription.tsx";
import { InputError } from "@/components/inputs/InputError.tsx";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { selectTriggerVariantClasses } from "@/components/inputs/input-variant.util.ts";
import {
  sizeFontClasses,
  sizeMinHeightClasses,
  sizePaddingLeftClasses,
  sizePaddingRightClasses,
  sizePaddingRightWithTrayClasses,
} from "@/control-size/control-size.util.ts";
// Types the public props depend on are imported relatively (not through `@/`),
// so the emitted InputTags.d.ts stays resolvable for consumers.
import type { BadgeColorKey } from "../BadgeColors.tsx";
import type { InputVariant } from "./input-variant.util.ts";


export type Size = 'sm' | 'md' | 'lg';

export type InputTagsProps = {
  name?: string;
  id?: string;
  className?: string;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  error?: string | React.ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  size?: Size;
  variant?: InputVariant;
  color?: BadgeColorKey;
  disabled?: boolean;
  /** No more tags are added once `value` holds this many. */
  maxItems?: number;
  /** Extra classes for every chip, e.g. `font-mono` for identifiers. */
  badgeClassName?: string;
  /**
   * What commits the typed text as a tag: `KeyboardEvent.key` values. Single
   * characters (like `,`) also split pasted and typed text. Newlines always
   * split a paste. Defaults to `['Enter', ',']`.
   */
  separators?: string[];
  /** Accessible name of a chip's × button. Defaults to `Remove ${value}`. */
  removeLabel?: (value: string) => string;
}

const DEFAULT_SEPARATORS = [ 'Enter', ',' ];

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Splits raw text on newlines, tabs and the single-character separators. */
const splitTags = (text: string, separators: string[]): string[] => {
  const chars = separators.filter(s => s.length === 1).map(escapeRegExp);
  const pattern = new RegExp(`[\\n\\r\\t${ chars.join('') }]`);
  return text.split(pattern);
};

/**
 * The tags `current` becomes after adding `candidates`: trimmed, empties and
 * exact duplicates (of existing tags or of each other) dropped, capped at
 * `maxItems`.
 */
const mergeTags = (current: string[], candidates: string[], maxItems?: number): string[] => {
  const next = [ ...current ];
  for (const raw of candidates) {
    const tag = raw.trim();
    if (tag === '' || next.includes(tag)) continue;
    if (maxItems !== undefined && next.length >= maxItems) break;
    next.push(tag);
  }
  return next;
};

export const InputTags = (props: InputTagsProps) => {

  const {
    name,
    id,
    className,
    label,
    description,
    error,
    value,
    onChange,
    placeholder,
    size = 'md',
    variant = 'default',
    color = 'blue',
    disabled = false,
    maxItems,
    badgeClassName,
    separators = DEFAULT_SEPARATORS,
    removeLabel = (v: string) => `Remove ${ v }`,
  } = props;

  const [ draft, setDraft ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const autoId = useId();
  const inputId = id ?? autoId;

  const isFull = maxItems !== undefined && value.length >= maxItems;

  /** Adds the candidates; returns whether the text was consumed (added or ignored as empty/duplicate). */
  const commit = (candidates: string[]): boolean => {
    const next = mergeTags(value, candidates, maxItems);
    if (next.length !== value.length) {
      onChange(next);
      return true;
    }
    // Nothing new: consumed when it was only blanks/duplicates, kept when the cap blocked it
    return !isFull || candidates.every(c => c.trim() === '' || value.includes(c.trim()));
  };

  const commitDraft = () => {
    if (draft.trim() === '') {
      if (draft !== '') setDraft('');
      return;
    }
    if (commit([ draft ])) setDraft('');
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (separators.includes(e.key)) {
      // An empty Enter keeps its native meaning (submitting a surrounding form)
      if (e.key === 'Enter' && draft.trim() === '') return;
      e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const parts = splitTags(text, separators);
    if (parts.length === 1) {
      setDraft(text);
      return;
    }
    // A separator arrived without a keydown we could catch (mobile keyboards, autofill):
    // commit everything before the last separator, keep the rest as the draft
    const rest = parts.pop() ?? '';
    commit(parts);
    setDraft(rest);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    const parts = splitTags(pasted, separators);
    if (parts.length === 1) return;
    e.preventDefault();
    if (commit([ draft, ...parts ])) setDraft('');
  };

  const handleFieldMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || e.target === inputRef.current) return;
    // Keep focus in the text input (also when a chip's × is pressed)
    e.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <ControlSizeContext.Provider value={ size }>
      <div
        className={ classNames(
          'mat:flex mat:flex-col',
          className
        ) }>
        <InputLabel htmlFor={ inputId }>{ label }</InputLabel>

        <div className={ 'mat:relative mat:flex mat:w-full mat:flex-col' }>
          <div
            onMouseDown={ handleFieldMouseDown }
            className={ classNames(
              'mat:flex mat:flex-row mat:flex-wrap mat:items-center mat:gap-1 mat:py-1.5 mat:border-[length:var(--border-width-input)] select-trigger mat:transition-all mat:duration-[var(--control-transition-duration)] mat:rounded-[var(--border-radius-input)] mat:ring-0 mat:focus-within:ring-[length:var(--control-ring-width)] mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)]',
              selectTriggerVariantClasses[variant],
              sizeMinHeightClasses[size],
              sizeFontClasses[size],
              sizePaddingLeftClasses[size],
              !disabled && error ? sizePaddingRightWithTrayClasses[size] : sizePaddingRightClasses[size],
              disabled ? 'select-trigger-disabled' : classNames('mat:cursor-text', error && 'select-trigger-error'),
            ) }
          >
            { value.map((tag, i) => (
              <Badge
                key={ `${ i }:${ tag }` }
                color={ color }
                className={ classNames('mat:max-w-full mat:min-w-0', badgeClassName) }
                onRemove={ disabled ? undefined : () => removeAt(i) }
                removeLabel={ removeLabel(tag) }
              >
                { tag }
              </Badge>
            )) }
            <input
              ref={ inputRef }
              id={ inputId }
              type={ 'text' }
              value={ draft }
              disabled={ disabled }
              placeholder={ value.length === 0 ? placeholder : undefined }
              aria-invalid={ error ? true : undefined }
              autoComplete={ 'off' }
              onChange={ handleChange }
              onKeyDown={ handleKeyDown }
              onPaste={ handlePaste }
              onBlur={ commitDraft }
              className={ classNames(
                'mat:flex-1 mat:min-w-20 mat:h-7 mat:p-0 mat:appearance-none mat:border-0 mat:bg-transparent mat:shadow-none mat:ring-0 mat:outline-none mat:focus:ring-0 mat:focus:shadow-none mat:focus:outline-none mat:text-[var(--color-input-text)] mat:placeholder:text-[var(--color-input-placeholder)] mat:font-[number:var(--font-weight-input-text)] mat:font-[family-name:var(--font-family-base)]',
                sizeFontClasses[size],
                disabled && 'mat:cursor-not-allowed',
                isFull && 'mat:min-w-4',
              ) }
            />
          </div>
          { name && value.map((tag, i) => (
            <input key={ `${ i }:${ tag }` } type={ 'hidden' } name={ name } value={ tag }/>
          )) }
          <InputIconButtonTray>
            { !disabled && error && (
              <InputErrorIcon/>
            ) }
          </InputIconButtonTray>
        </div>
        <InputDescription>{ description }</InputDescription>
        <InputError>{ error }</InputError>
      </div>
    </ControlSizeContext.Provider>
  );
};
