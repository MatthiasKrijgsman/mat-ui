import { classNames } from "@/util/classnames.util.ts";
import {
  type LexicalToolbarTone,
  useLexicalToolbar,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export type LexicalToolbarDividerProps = {
  tone?: LexicalToolbarTone;
  className?: string;
};

const toneClasses: Record<LexicalToolbarTone, string> = {
  light: "lexical-tb-divider-light",
  dark: "lexical-tb-divider-dark",
};

export const LexicalToolbarDivider = (props: LexicalToolbarDividerProps) => {
  const { tone: toneOverride, className } = props;
  const { tone: contextTone, orientation } = useLexicalToolbar();
  const tone = toneOverride ?? contextTone;
  const vertical = orientation === "vertical";
  return (
    <div
      className={ classNames(
        vertical ? "mat:h-px mat:w-full mat:my-1" : "mat:w-px mat:h-5 mat:my-auto mat:mx-1",
        "mat:shrink-0",
        toneClasses[tone],
        className,
      ) }
    />
  );
};

export type LexicalToolbarRowDividerProps = LexicalToolbarDividerProps;

/* Horizontal rule between stacked toolbar rows (second row, non-collapsible
 * wrapping) — always full-width regardless of the context orientation. */
export const LexicalToolbarRowDivider = (props: LexicalToolbarRowDividerProps) => {
  const { tone: toneOverride, className } = props;
  const { tone: contextTone } = useLexicalToolbar();
  const tone = toneOverride ?? contextTone;
  return (
    <div
      className={ classNames(
        "mat:h-px mat:w-full mat:my-1 mat:shrink-0",
        toneClasses[tone],
        className,
      ) }
    />
  );
};
