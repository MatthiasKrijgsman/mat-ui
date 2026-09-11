import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $createParagraphNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { DropdownMenu } from "@/components/dropdown-menu/DropdownMenu.tsx";
import { DropdownButton } from "@/components/dropdown-menu/DropdownButton.tsx";
import {
  type LexicalBlockType,
  useLexicalToolbar,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

const OPTIONS: { value: LexicalBlockType; label: string }[] = [
  { value: "paragraph", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
];

export const LexicalBlockTypeSelect = () => {
  const [ editor ] = useLexicalComposerContext();
  const { state, tone } = useLexicalToolbar();

  const applyBlockType = (blockType: LexicalBlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      if (blockType === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(blockType));
      }
    });
  };

  const current = OPTIONS.find((option) => option.value === state.blockType) ?? OPTIONS[0];

  return (
    <DropdownMenu
      placement={ "bottom-start" }
      minWidth={ 180 }
      trigger={
        <button
          type={ "button" }
          onMouseDown={ (event) => event.preventDefault() }
          className={ classNames(
            "lexical-tb-btn mat:h-8 mat:px-2 mat:gap-1 mat:text-sm mat:font-[number:var(--font-weight-input-option-label)]",
            tone === "dark" ? "lexical-tb-btn-dark" : "lexical-tb-btn-light",
          ) }
        >
          <span className={ "mat:break-all mat:line-clamp-1" }>{ current.label }</span>
          <IconChevronDown className={ "mat:h-4 mat:w-4 mat:shrink-0" }/>
        </button>
      }
    >
      { OPTIONS.map((option) => (
        <DropdownButton
          key={ option.value }
          Icon={ option.value === state.blockType ? IconCheck : undefined }
          onClick={ () => applyBlockType(option.value) }
          className={ option.value === state.blockType ? undefined : "mat:pl-11" }
        >
          { option.label }
        </DropdownButton>
      )) }
    </DropdownMenu>
  );
};
