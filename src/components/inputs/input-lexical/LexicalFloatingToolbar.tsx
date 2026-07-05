import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import {
  type LexicalToolbarRender,
  useLexicalToolbarState,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";
import { FloatingToolbarShell } from "@/components/inputs/input-lexical/FloatingToolbarShell.tsx";
import { lexicalDefaultToolbarItems } from "@/components/inputs/input-lexical/LexicalToolbar.tsx";

export type LexicalFloatingToolbarProps = {
  render?: LexicalToolbarRender;
  /** Controlled visibility. When set, the bar is pinned (focus/blur is
   * ignored) — popovers opened from the bar can take focus without closing
   * it. Omit for the default show-on-focus behaviour. */
  open?: boolean;
  matchAnchorWidth?: boolean;
};

export const LexicalFloatingToolbar = (props: LexicalFloatingToolbarProps) => {
  const { render, open: controlledOpen, matchAnchorWidth } = props;
  const [ editor ] = useLexicalComposerContext();
  const state = useLexicalToolbarState();
  const [ anchor, setAnchor ] = useState<HTMLElement | null>(null);
  const [ focusOpen, setFocusOpen ] = useState(false);
  const controlled = controlledOpen !== undefined;

  useEffect(() => {
    // registerRootListener fires immediately with the current root, so this
    // also covers the initial reference.
    return editor.registerRootListener((root) => setAnchor(root ?? null));
  }, [ editor ]);

  useEffect(() => {
    if (controlled) return;
    return mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setFocusOpen(true);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setFocusOpen(false);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [ editor, controlled ]);

  return (
    <FloatingToolbarShell
      anchor={ anchor }
      open={ controlled ? controlledOpen : focusOpen }
      matchAnchorWidth={ matchAnchorWidth }
      state={ state }
      tone={ "dark" }
    >
      { render ? render({ editor, state, tone: "dark" }) : lexicalDefaultToolbarItems() }
    </FloatingToolbarShell>
  );
};
