import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { DropdownMenu } from "@/components/dropdown-menu/DropdownMenu.tsx";
import { DropdownButton } from "@/components/dropdown-menu/DropdownButton.tsx";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export type LexicalToolbarSelectOption<T> = {
  value: T;
  label: string;
};

export type LexicalToolbarSelectProps<T> = {
  options: LexicalToolbarSelectOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  /** Trigger label when value is null (also the clear item's label). */
  placeholder?: string;
  /** Adds a leading item that emits null (e.g. "inherit"). */
  clearable?: boolean;
  minWidth?: number;
  title?: string;
};

/* Generic value-driven select for the toolbar — no Lexical wiring; the
 * caller decides what the value means (font family, size preset, …). */
export const LexicalToolbarSelect = <T, >(props: LexicalToolbarSelectProps<T>) => {
  const { options, value, onChange, placeholder = "Default", clearable = false, minWidth = 180, title } = props;
  const { tone } = useLexicalToolbar();

  const current = value !== null ? options.find((option) => option.value === value) : undefined;

  return (
    <DropdownMenu
      placement={ "bottom-start" }
      minWidth={ minWidth }
      trigger={
        <button
          type={ "button" }
          title={ title }
          onMouseDown={ (event) => event.preventDefault() }
          className={ classNames(
            "lexical-tb-btn h-8 px-2 gap-1 text-sm font-[number:var(--font-weight-input-option-label)]",
            tone === "dark" ? "lexical-tb-btn-dark" : "lexical-tb-btn-light",
          ) }
        >
          <span className={ "break-all line-clamp-1" }>{ current ? current.label : placeholder }</span>
          <IconChevronDown className={ "h-4 w-4 shrink-0" }/>
        </button>
      }
    >
      { clearable && (
        <DropdownButton
          Icon={ value === null ? IconCheck : undefined }
          onClick={ () => onChange(null) }
          className={ value === null ? undefined : "pl-11" }
        >
          { placeholder }
        </DropdownButton>
      ) }
      { options.map((option, index) => (
        <DropdownButton
          key={ index }
          Icon={ option.value === value ? IconCheck : undefined }
          onClick={ () => onChange(option.value) }
          className={ option.value === value ? undefined : "pl-11" }
        >
          { option.label }
        </DropdownButton>
      )) }
    </DropdownMenu>
  );
};
