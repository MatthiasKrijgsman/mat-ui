import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  type LexicalEditor,
} from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode, ListNode } from "@lexical/list";
import { $isLinkNode } from "@lexical/link";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";

export type LexicalBlockType = "paragraph" | "h1" | "h2" | "h3" | "h4";
export type LexicalAlign = "left" | "center" | "right" | "justify";

export type LexicalToolbarState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isLink: boolean;
  isUnorderedList: boolean;
  isOrderedList: boolean;
  blockType: LexicalBlockType;
  align: LexicalAlign;
  canUndo: boolean;
  canRedo: boolean;
};

export const DEFAULT_LEXICAL_TOOLBAR_STATE: LexicalToolbarState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isLink: false,
  isUnorderedList: false,
  isOrderedList: false,
  blockType: "paragraph",
  align: "left",
  canUndo: false,
  canRedo: false,
};

export type LexicalToolbarTone = "light" | "dark";
export type LexicalToolbarOrientation = "horizontal" | "vertical";

export type LexicalToolbarContextValue = {
  state: LexicalToolbarState;
  tone: LexicalToolbarTone;
  orientation?: LexicalToolbarOrientation;
};

export const LexicalToolbarContext = createContext<LexicalToolbarContextValue>({
  state: DEFAULT_LEXICAL_TOOLBAR_STATE,
  tone: "light",
  orientation: "horizontal",
});

/* Consumed by toolbar building blocks to read active state + tone. */
export const useLexicalToolbar = (): LexicalToolbarContextValue =>
  useContext(LexicalToolbarContext);

/* Subscribes to the editor and derives the active formatting state on every
 * update. Used by the toolbar wrappers to drive button highlighting. */
export const useLexicalToolbarState = (): LexicalToolbarState => {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<LexicalToolbarState>(DEFAULT_LEXICAL_TOOLBAR_STATE);

  useEffect(() => {
    const readSelection = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }

        const anchorNode = selection.anchor.getNode();
        const listNode = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const listType = listNode && $isListNode(listNode) ? listNode.getListType() : null;

        const topElement =
          anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

        let blockType: LexicalBlockType = "paragraph";
        if (!listType && $isHeadingNode(topElement)) {
          blockType = topElement.getTag() as LexicalBlockType;
        }

        let align: LexicalAlign = "left";
        if ($isElementNode(topElement)) {
          const formatType = topElement.getFormatType();
          if (formatType === "center" || formatType === "justify") align = formatType;
          else if (formatType === "right" || formatType === "end") align = "right";
        }

        // Read every node value here, inside the editor.read() context. Passing
        // these accessors into the setState updater would run them later (during
        // React render) outside the read, throwing Lexical error #195.
        const isBold = selection.hasFormat("bold");
        const isItalic = selection.hasFormat("italic");
        const isUnderline = selection.hasFormat("underline");
        const isLink = $isLinkNode(anchorNode.getParent()) || $isLinkNode(anchorNode);

        setState((prev) => ({
          ...prev,
          isBold,
          isItalic,
          isUnderline,
          isLink,
          isUnorderedList: listType === "bullet",
          isOrderedList: listType === "number",
          blockType,
          align,
        }));
      });
    };

    return mergeRegister(
      editor.registerUpdateListener(() => readSelection()),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          setState((prev) => ({ ...prev, canUndo: payload }));
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          setState((prev) => ({ ...prev, canRedo: payload }));
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return state;
};

export type LexicalToolbarRenderContext = {
  editor: LexicalEditor;
  state: LexicalToolbarState;
  tone: LexicalToolbarTone;
};

export type LexicalToolbarRender = (ctx: LexicalToolbarRenderContext) => React.ReactNode;
