import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";
import { LexicalToolbarButton } from "@/components/inputs/input-lexical/LexicalToolbarButton.tsx";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export const LexicalHistoryButtons = () => {
  const [ editor ] = useLexicalComposerContext();
  const { state, tone } = useLexicalToolbar();

  return (
    <>
      <LexicalToolbarButton
        Icon={ IconArrowBackUp }
        tone={ tone }
        disabled={ !state.canUndo }
        aria-label={ "Undo" }
        onClick={ () => editor.dispatchCommand(UNDO_COMMAND, undefined) }
      />
      <LexicalToolbarButton
        Icon={ IconArrowForwardUp }
        tone={ tone }
        disabled={ !state.canRedo }
        aria-label={ "Redo" }
        onClick={ () => editor.dispatchCommand(REDO_COMMAND, undefined) }
      />
    </>
  );
};
