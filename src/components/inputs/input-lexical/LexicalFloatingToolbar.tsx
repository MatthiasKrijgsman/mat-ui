import { useEffect, useRef, useState } from "react";
import type { VirtualElement } from "@floating-ui/react";
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
  /** Building blocks for an optional second row, rendered below a divider. */
  renderSecondRow?: LexicalToolbarRender;
  /** When false, overflowing items wrap onto divider-separated rows instead
   * of collapsing into the "⋮" dropdown. */
  collapsible?: boolean;
  /** Controlled visibility. When set, the bar is pinned (focus/blur is
   * ignored) — popovers opened from the bar can take focus without closing
   * it. Omit for the default show-on-focus behaviour. */
  open?: boolean;
  matchAnchorWidth?: boolean;
  /** Anchor the bar to the line of the live DOM selection (caret / selected
   * text): vertically it rides the cursor's line, horizontally it stays
   * centered on the editor root. While focus is in the toolbar itself, the
   * last in-editor selection keeps anchoring the bar. Implies
   * `matchAnchorWidth: false` and `placement: "top"`. */
  anchorToSelection?: boolean;
};

export const LexicalFloatingToolbar = (props: LexicalFloatingToolbarProps) => {
  const {
    render,
    renderSecondRow,
    collapsible,
    open: controlledOpen,
    matchAnchorWidth,
    anchorToSelection = false,
  } = props;
  const [ editor ] = useLexicalComposerContext();
  const state = useLexicalToolbarState();
  const [ anchor, setAnchor ] = useState<HTMLElement | null>(null);
  const [ selectionAnchor, setSelectionAnchor ] = useState<VirtualElement | null>(null);
  const lastRangeRef = useRef<Range | null>(null);
  const [ focusOpen, setFocusOpen ] = useState(false);
  const controlled = controlledOpen !== undefined;

  useEffect(() => {
    // registerRootListener fires immediately with the current root, so this
    // also covers the initial reference.
    return editor.registerRootListener((root) => setAnchor(root ?? null));
  }, [ editor ]);

  useEffect(() => {
    if (!anchorToSelection) return;

    const rectOf = (range: Range): DOMRect => {
      const rects = range.getClientRects();
      const rect = rects.length > 0 ? rects[0] : range.getBoundingClientRect();
      if (rect.height > 0) return rect;
      // A collapsed caret in an empty block reports a zero rect in some
      // engines — the nearest element is the best stand-in.
      const node = range.startContainer;
      const element = node instanceof Element ? node : node.parentElement;
      return element ? element.getBoundingClientRect() : rect;
    };

    const readSelection = () => {
      const root = editor.getRootElement();
      const domSelection = root?.ownerDocument.getSelection();
      if (!root || !domSelection || domSelection.rangeCount === 0) return;
      const range = domSelection.getRangeAt(0);
      // Selection outside the editor (a toolbar field took focus): keep the
      // last in-editor range so the bar doesn't jump away.
      if (!root.contains(range.commonAncestorContainer)) return;
      lastRangeRef.current = range.cloneRange();
      // Fresh object per change so the shell re-anchors (repositions);
      // getBoundingClientRect reads the live range so scroll/layout-driven
      // autoUpdate re-measures correctly between selection changes. The rect
      // is a hybrid: vertical from the selection's line (the bar rides the
      // cursor), horizontal from the editor root (the bar stays centered on
      // the field instead of chasing the caret sideways).
      setSelectionAnchor({
        contextElement: root,
        getBoundingClientRect: () => {
          const rootRect = (editor.getRootElement() ?? root).getBoundingClientRect();
          const current = lastRangeRef.current;
          if (!current) return rootRect;
          const lineRect = rectOf(current);
          return new DOMRect(rootRect.x, lineRect.y, rootRect.width, lineRect.height);
        },
      });
    };

    document.addEventListener("selectionchange", readSelection);
    readSelection();
    return () => {
      document.removeEventListener("selectionchange", readSelection);
      lastRangeRef.current = null;
      setSelectionAnchor(null);
    };
  }, [ editor, anchorToSelection ]);

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
      anchor={ anchorToSelection ? (selectionAnchor ?? anchor) : anchor }
      open={ controlled ? controlledOpen : focusOpen }
      placement={ anchorToSelection ? "top" : "top-start" }
      matchAnchorWidth={ anchorToSelection ? false : matchAnchorWidth }
      state={ state }
      tone={ "dark" }
      collapsible={ collapsible }
      secondRow={ renderSecondRow?.({ editor, state, tone: "dark" }) }
    >
      { render ? render({ editor, state, tone: "dark" }) : lexicalDefaultToolbarItems() }
    </FloatingToolbarShell>
  );
};
