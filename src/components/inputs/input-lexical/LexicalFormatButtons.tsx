import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react";
import { LexicalToolbarButton } from "@/components/inputs/input-lexical/LexicalToolbarButton.tsx";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export const LexicalFormatButtons = () => {
  const [ editor ] = useLexicalComposerContext();
  const { state, tone } = useLexicalToolbar();

  return (
    <>
      <LexicalToolbarButton
        Icon={ IconBold }
        tone={ tone }
        active={ state.isBold }
        aria-label={ "Bold" }
        onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold") }
      />
      <LexicalToolbarButton
        Icon={ IconItalic }
        tone={ tone }
        active={ state.isItalic }
        aria-label={ "Italic" }
        onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic") }
      />
      <LexicalToolbarButton
        Icon={ IconUnderline }
        tone={ tone }
        active={ state.isUnderline }
        aria-label={ "Underline" }
        onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline") }
      />
    </>
  );
};
