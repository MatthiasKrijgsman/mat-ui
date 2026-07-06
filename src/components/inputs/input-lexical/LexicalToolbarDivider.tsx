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
        vertical ? "h-px w-full my-1" : "w-px h-5 my-auto mx-1",
        "shrink-0",
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
        "h-px w-full my-1 shrink-0",
        toneClasses[tone],
        className,
      ) }
    />
  );
};
