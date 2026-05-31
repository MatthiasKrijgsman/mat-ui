import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from "@tabler/icons-react";
import type { LexicalToolbarTone } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export type LexicalToolbarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: TablerIcon;
  active?: boolean;
  tone?: LexicalToolbarTone;
};

const toneClasses: Record<LexicalToolbarTone, string> = {
  light: "lexical-tb-btn-light",
  dark: "lexical-tb-btn-dark",
};

export const LexicalToolbarButton = React.forwardRef<HTMLButtonElement, LexicalToolbarButtonProps>(
  (props, ref) => {
    const { Icon, active = false, tone = "light", className, onMouseDown, ...rest } = props;

    // Keep the editor selection intact when a toolbar control is pressed.
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onMouseDown?.(event);
    };

    return (
      <button
        ref={ ref }
        type={ "button" }
        onMouseDown={ handleMouseDown }
        className={ classNames(
          "lexical-tb-btn h-8 w-8",
          toneClasses[tone],
          active && "lexical-tb-btn-active",
          className,
        ) }
        { ...rest }
      >
        <Icon className={ "h-[18px] w-[18px]" }/>
      </button>
    );
  },
);
