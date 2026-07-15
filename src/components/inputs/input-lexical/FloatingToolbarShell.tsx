import * as React from "react";
import { useEffect } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useFloating,
  type VirtualElement,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import {
  DEFAULT_LEXICAL_TOOLBAR_STATE,
  LexicalToolbarContext,
  type LexicalToolbarState,
  type LexicalToolbarTone,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";
import { LexicalToolbarItems } from "@/components/inputs/input-lexical/LexicalToolbarItems.tsx";
import { LexicalToolbarRowDivider } from "@/components/inputs/input-lexical/LexicalToolbarDivider.tsx";

export type FloatingToolbarShellProps = {
  /** Element the bar floats above (top-start). Also accepts a floating-ui
   * virtual element (e.g. a live selection rect) — pair those with
   * `matchAnchorWidth={false}`, a caret rect has no useful width. */
  anchor: HTMLElement | VirtualElement | null;
  open: boolean;
  /** Match the bar width to the anchor width (drives overflow-collapse). */
  matchAnchorWidth?: boolean;
  /** Toolbar context for the building blocks inside. Defaults to an inert
   * state — pass the real editor state when wrapping a Lexical editor. */
  state?: LexicalToolbarState;
  tone?: LexicalToolbarTone;
  /** When false, overflowing items wrap onto divider-separated rows instead
   * of collapsing into the "⋮" dropdown. */
  collapsible?: boolean;
  /** Extra building blocks rendered on a second row, below a divider. */
  secondRow?: React.ReactNode;
  children: React.ReactNode;
};

/* The floating bar chrome without any Lexical wiring: positioning, portal,
 * animation and the overflow-collapsing item row. LexicalFloatingToolbar
 * builds on this; non-Lexical consumers can anchor it to any element.
 *
 * The toolbar context is provided here (from the state/tone props) rather
 * than by the caller: children must stay a flat fragment of building blocks
 * for LexicalToolbarItems' overflow measuring, so a caller-side provider
 * around them would collapse the row into a single unmeasurable item. */
export const FloatingToolbarShell = (props: FloatingToolbarShellProps) => {
  const {
    anchor,
    open,
    matchAnchorWidth = true,
    state = DEFAULT_LEXICAL_TOOLBAR_STATE,
    tone = "dark",
    collapsible = true,
    secondRow,
    children,
  } = props;

  const { refs, floatingStyles } = useFloating({
    placement: "top-start",
    strategy: "fixed",
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableWidth, elements }) {
          // Match the anchor width so the bar starts at the anchor and shares
          // the same max width (driving the overflow-collapse behaviour).
          // Content-sized bars are instead capped at the space floating-ui
          // reports, so the overflow-collapse kicks in at the viewport edge.
          if (matchAnchorWidth) {
            elements.floating.style.width = `${ rects.reference.width }px`;
          } else {
            elements.floating.style.maxWidth = `${ Math.max(0, availableWidth) }px`;
          }
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    refs.setReference(anchor);
  }, [ anchor, refs ]);

  return (
    <LexicalToolbarContext.Provider value={ { state, tone } }>
      <FloatingPortal>
        <AnimatePresence>
          { open && (
            <div ref={ refs.setFloating } style={ floatingStyles } className={ "z-50" }>
              <motion.div
                className={ "lexical-floating-toolbar flex w-full flex-col p-1 rounded-[var(--border-radius-dropdown)]" }
                initial={ { opacity: 0, y: 4 } }
                animate={ { opacity: 1, y: 0 } }
                exit={ { opacity: 0, y: 4 } }
                transition={ { duration: 0.1, ease: "easeInOut" } }
              >
                <LexicalToolbarItems collapsible={ collapsible }>
                  { children }
                </LexicalToolbarItems>
                { secondRow != null && (
                  <>
                    <LexicalToolbarRowDivider/>
                    <LexicalToolbarItems collapsible={ collapsible }>
                      { secondRow }
                    </LexicalToolbarItems>
                  </>
                ) }
              </motion.div>
            </div>
          ) }
        </AnimatePresence>
      </FloatingPortal>
    </LexicalToolbarContext.Provider>
  );
};
