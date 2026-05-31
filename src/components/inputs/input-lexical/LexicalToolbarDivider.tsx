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
