import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { IconLink } from "@tabler/icons-react";
import { LexicalToolbarButton } from "@/components/inputs/input-lexical/LexicalToolbarButton.tsx";
import { useLexicalToolbar } from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export const LexicalLinkButton = () => {
  const [ editor ] = useLexicalComposerContext();
  const { state, tone } = useLexicalToolbar();

  const toggleLink = () => {
    if (state.isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }
    const url = window.prompt("Enter URL");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  return (
    <LexicalToolbarButton
      Icon={ IconLink }
      tone={ tone }
      active={ state.isLink }
      aria-label={ "Link" }
      onClick={ toggleLink }
    />
  );
};
