import { useState } from "react";
import { classNames } from "@/util/classnames.util.ts";
import { usePopover } from "@/popover/use-popover.tsx";
import { useDismiss } from "@/hooks/use-dismiss.ts";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { ColorPicker } from "@/components/inputs/ColorPicker.tsx";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export type LexicalToolbarColorProps = {
  /** Hex color shown in the swatch and fed to the picker. */
  value: string;
  onChange: (hex: string) => void;
  title?: string;
};

/* Swatch button that opens the HSV picker in a popover. Generic — the caller
 * decides what the color applies to. */
export const LexicalToolbarColor = (props: LexicalToolbarColorProps) => {
  const { value, onChange, title } = props;
  const { tone } = useLexicalToolbar();
  const [ open, setOpen ] = useState(false);

  useDismiss(open, () => setOpen(false));

  const { anchorRef, Popover } = usePopover({
    placement: "bottom-start",
    open,
    onOpenChange: setOpen,
    offset: 8,
  });

  return (
    <span ref={ anchorRef } className={ "inline-flex" }>
      <button
        type={ "button" }
        title={ title }
        onMouseDown={ (event) => event.preventDefault() }
        onClick={ () => setOpen((prev) => !prev) }
        className={ classNames(
          "lexical-tb-btn h-8 w-8",
          tone === "dark" ? "lexical-tb-btn-dark" : "lexical-tb-btn-light",
          open && "lexical-tb-btn-active",
        ) }
      >
        <span
          className={ "h-[18px] w-[18px] rounded-[var(--border-radius-control-inner)] border-[length:var(--border-width-input)] color-swatch" }
          style={ { backgroundColor: value || "white" } }
        />
      </button>
      <Popover open={ open }>
        <DropdownPanel padding={ "md" }>
          <ColorPicker value={ value } onChange={ onChange } hexInput/>
        </DropdownPanel>
      </Popover>
    </span>
  );
};
