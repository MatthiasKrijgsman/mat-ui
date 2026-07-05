import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from "@tabler/icons-react";
import { LexicalToolbarButton } from "@/components/inputs/input-lexical/LexicalToolbarButton.tsx";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export const LexicalAlignButtons = () => {
  const [ editor ] = useLexicalComposerContext();
  const { state, tone } = useLexicalToolbar();

  return (
    <>
      <LexicalToolbarButton
        Icon={ IconAlignLeft }
        tone={ tone }
        active={ state.align === "left" }
        aria-label={ "Align left" }
        onClick={ () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left") }
      />
      <LexicalToolbarButton
        Icon={ IconAlignCenter }
        tone={ tone }
        active={ state.align === "center" }
        aria-label={ "Align center" }
        onClick={ () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center") }
      />
      <LexicalToolbarButton
        Icon={ IconAlignRight }
        tone={ tone }
        active={ state.align === "right" }
        aria-label={ "Align right" }
        onClick={ () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right") }
      />
    </>
  );
};
