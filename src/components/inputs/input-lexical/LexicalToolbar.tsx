import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { classNames } from "@/util/classnames.util.ts";
import {
  LexicalToolbarContext,
  type LexicalToolbarRender,
  useLexicalToolbarState,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";
import { LexicalBlockTypeSelect } from "@/components/inputs/input-lexical/LexicalBlockTypeSelect.tsx";
import { LexicalFormatButtons } from "@/components/inputs/input-lexical/LexicalFormatButtons.tsx";
import { LexicalListButtons } from "@/components/inputs/input-lexical/LexicalListButtons.tsx";
import { LexicalLinkButton } from "@/components/inputs/input-lexical/LexicalLinkButton.tsx";
import { LexicalHistoryButtons } from "@/components/inputs/input-lexical/LexicalHistoryButtons.tsx";
import { LexicalToolbarDivider } from "@/components/inputs/input-lexical/LexicalToolbarDivider.tsx";
import { LexicalToolbarItems } from "@/components/inputs/input-lexical/LexicalToolbarItems.tsx";

/* The default set of toolbar building blocks as a flat fragment. Passed
 * straight into LexicalToolbarItems so each block stays individually
 * measurable for the overflow-collapse logic. */
// eslint-disable-next-line react-refresh/only-export-components
export const lexicalDefaultToolbarItems = () => (
  <>
    <LexicalBlockTypeSelect/>
    <LexicalToolbarDivider/>
    <LexicalFormatButtons/>
    <LexicalToolbarDivider/>
    <LexicalListButtons/>
    <LexicalLinkButton/>
    <LexicalToolbarDivider/>
    <LexicalHistoryButtons/>
  </>
);

export const LexicalDefaultToolbarContent = () => lexicalDefaultToolbarItems();

export type LexicalToolbarProps = {
  render?: LexicalToolbarRender;
  /** When false, overflowing items wrap onto divider-separated rows instead
   * of collapsing into the "⋮" dropdown. */
  collapsible?: boolean;
  className?: string;
};

export const LexicalToolbar = (props: LexicalToolbarProps) => {
  const { render, collapsible, className } = props;
  const [ editor ] = useLexicalComposerContext();
  const state = useLexicalToolbarState();

  return (
    <LexicalToolbarContext.Provider value={ { state, tone: "light" } }>
      <div
        className={ classNames(
          "lexical-toolbar flex flex-row items-center p-1.5",
          className,
        ) }
      >
        <LexicalToolbarItems collapsible={ collapsible }>
          { render ? render({ editor, state, tone: "light" }) : lexicalDefaultToolbarItems() }
        </LexicalToolbarItems>
      </div>
    </LexicalToolbarContext.Provider>
  );
};
