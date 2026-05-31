import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import {
  LexicalToolbarContext,
  type LexicalToolbarRender,
  useLexicalToolbarState,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";
import { LexicalToolbarItems } from "@/components/inputs/input-lexical/LexicalToolbarItems.tsx";
import { lexicalDefaultToolbarItems } from "@/components/inputs/input-lexical/LexicalToolbar.tsx";

export type LexicalFloatingToolbarProps = {
  render?: LexicalToolbarRender;
};

export const LexicalFloatingToolbar = (props: LexicalFloatingToolbarProps) => {
  const { render } = props;
  const [ editor ] = useLexicalComposerContext();
  const state = useLexicalToolbarState();
  const [ open, setOpen ] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "top-start",
    strategy: "fixed",
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          // Match the editor row width so the bar starts at the row and shares
          // the same max width (driving the overflow-collapse behaviour).
          elements.floating.style.width = `${ rects.reference.width }px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const root = editor.getRootElement();
    if (root) refs.setReference(root);
    return editor.registerRootListener((nextRoot) => {
      refs.setReference(nextRoot ?? null);
    });
  }, [ editor, refs ]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setOpen(true);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setOpen(false);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [ editor ]);

  return (
    <LexicalToolbarContext.Provider value={ { state, tone: "dark" } }>
      <FloatingPortal>
        <AnimatePresence>
          { open && (
            <div ref={ refs.setFloating } style={ floatingStyles } className={ "z-50" }>
              <motion.div
                className={ "lexical-floating-toolbar flex w-full flex-row items-center p-1 rounded-xl" }
                initial={ { opacity: 0, y: 4 } }
                animate={ { opacity: 1, y: 0 } }
                exit={ { opacity: 0, y: 4 } }
                transition={ { duration: 0.1, ease: "easeInOut" } }
              >
                <LexicalToolbarItems>
                  { render
                    ? render({ editor, state, tone: "dark" })
                    : lexicalDefaultToolbarItems() }
                </LexicalToolbarItems>
              </motion.div>
            </div>
          ) }
        </AnimatePresence>
      </FloatingPortal>
    </LexicalToolbarContext.Provider>
  );
};
