import * as React from "react";
import { useEffect, useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export type LexicalToolbarNumberProps = {
  /** null renders an empty field (mixed/unset selection). */
  value: number | null;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Short label rendered before the field (e.g. an abbreviation). */
  prefix?: string;
  title?: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/* Number precision guard for fractional steps (0.1 + 0.2 …). */
const roundToStep = (n: number, step: number) => {
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(n.toFixed(decimals));
};

/* Generic stepper field for the toolbar — commits on Enter/blur, steps with
 * the arrow keys. Unlike the buttons it intentionally takes focus while the
 * user types; consumers keep the bar open (controlled) during edits. */
export const LexicalToolbarNumber = (props: LexicalToolbarNumberProps) => {
  const { value, onChange, min, max, step = 1, prefix, title } = props;
  const { tone } = useLexicalToolbar();
  const [ draft, setDraft ] = useState<string>(value === null ? "" : String(value));
  const [ focused, setFocused ] = useState(false);

  useEffect(() => {
    // While the user is typing, the field owns the value.
    if (!focused) setDraft(value === null ? "" : String(value));
  }, [ value, focused ]);

  const commit = (raw: string) => {
    const parsed = Number(raw.replace(",", "."));
    if (raw.trim() === "" || Number.isNaN(parsed)) {
      setDraft(value === null ? "" : String(value));
      return;
    }
    const next = roundToStep(clamp(parsed, min, max), step);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const stepBy = (direction: 1 | -1) => {
    const base = draft.trim() === "" ? (value ?? min) : Number(draft.replace(",", "."));
    const next = roundToStep(clamp((Number.isNaN(base) ? min : base) + direction * step, min, max), step);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit(draft);
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      // Revert; stop before any surrounding editor treats Escape as "close".
      event.stopPropagation();
      setDraft(value === null ? "" : String(value));
      event.currentTarget.blur();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      stepBy(event.key === "ArrowUp" ? 1 : -1);
    }
  };

  return (
    <span
      title={ title }
      className={ classNames(
        "lexical-tb-btn h-8 px-1.5 gap-1 text-sm font-[number:var(--font-weight-input-option-label)]",
        tone === "dark" ? "lexical-tb-btn-dark" : "lexical-tb-btn-light",
      ) }
    >
      { prefix && <span className={ "opacity-60 select-none" }>{ prefix }</span> }
      <input
        type={ "text" }
        inputMode={ "decimal" }
        value={ draft }
        size={ 3 }
        onChange={ (event) => setDraft(event.target.value) }
        onFocus={ (event) => {
          setFocused(true);
          event.target.select();
        } }
        onBlur={ (event) => {
          setFocused(false);
          commit(event.target.value);
        } }
        onKeyDown={ handleKeyDown }
        className={ "w-9 bg-transparent text-center outline-none border-none p-0 text-inherit text-sm" }
      />
    </span>
  );
};
