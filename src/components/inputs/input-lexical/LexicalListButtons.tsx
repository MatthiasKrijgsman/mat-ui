import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { IconList, IconListNumbers } from "@tabler/icons-react";
import { LexicalToolbarButton } from "@/components/inputs/input-lexical/LexicalToolbarButton.tsx";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export const LexicalListButtons = () => {
  const [ editor ] = useLexicalComposerContext();
  const { state, tone } = useLexicalToolbar();

  const toggleUnordered = () => {
    editor.dispatchCommand(
      state.isUnorderedList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
      undefined,
    );
  };

  const toggleOrdered = () => {
    editor.dispatchCommand(
      state.isOrderedList ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
      undefined,
    );
  };

  return (
    <>
      <LexicalToolbarButton
        Icon={ IconList }
        tone={ tone }
        active={ state.isUnorderedList }
        aria-label={ "Bullet list" }
        onClick={ toggleUnordered }
      />
      <LexicalToolbarButton
        Icon={ IconListNumbers }
        tone={ tone }
        active={ state.isOrderedList }
        aria-label={ "Numbered list" }
        onClick={ toggleOrdered }
      />
    </>
  );
};
