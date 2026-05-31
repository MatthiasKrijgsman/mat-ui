import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
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

export type LexicalToolbarState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isLink: boolean;
  isUnorderedList: boolean;
  isOrderedList: boolean;
  blockType: LexicalBlockType;
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
    const readSelection = (activeEditor: LexicalEditor) => {
      activeEditor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }

        const anchorNode = selection.anchor.getNode();

        const isBold = selection.hasFormat("bold");
        const isItalic = selection.hasFormat("italic");
        const isUnderline = selection.hasFormat("underline");

        const parent = anchorNode.getParent();
        const isLink = $isLinkNode(parent) || $isLinkNode(anchorNode);

        const listNode = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        if (listNode && $isListNode(listNode)) {
          const listType = listNode.getListType();
          setState((prev) => ({
            ...prev,
            isBold,
            isItalic,
            isUnderline,
            isLink,
            isUnorderedList: listType === "bullet",
            isOrderedList: listType === "number",
            blockType: "paragraph",
          }));
          return;
        }

        const element =
          anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
        const blockType: LexicalBlockType = $isHeadingNode(element)
          ? (element.getTag() as LexicalBlockType)
          : "paragraph";

        setState((prev) => ({
          ...prev,
          isBold,
          isItalic,
          isUnderline,
          isLink,
          isUnorderedList: false,
          isOrderedList: false,
          blockType,
        }));
      });
    };

    return mergeRegister(
      editor.registerUpdateListener(() => readSelection(editor)),
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
