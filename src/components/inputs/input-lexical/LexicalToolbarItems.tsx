import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconDots } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { DropdownMenu } from "@/components/dropdown-menu/DropdownMenu.tsx";
import {
  LexicalToolbarContext,
  useLexicalToolbar,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";

export type LexicalToolbarItemsProps = {
  children: React.ReactNode;
};

const GAP = 4; // gap-1 = 0.25rem
const MORE_WIDTH = 36; // 32px button + gap reserved for the overflow trigger

/* Flatten one or more levels of fragments so each building block becomes an
 * individually measurable unit (a wrapping component/fragment would otherwise
 * collapse the whole toolbar as a single item). */
const flattenItems = (nodes: React.ReactNode): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  React.Children.forEach(nodes, (child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      out.push(...flattenItems((child.props as { children?: React.ReactNode }).children));
    } else {
      out.push(child);
    }
  });
  return out;
};

/* Lays out toolbar building blocks in a single row and, when they no longer
 * fit, collapses the trailing items into a "⋮" vertical dropdown. A hidden
 * mirror row provides stable intrinsic widths so growth/shrink decisions stay
 * consistent. */
export const LexicalToolbarItems = (props: LexicalToolbarItemsProps) => {
  const { children } = props;
  const { state, tone } = useLexicalToolbar();
  const items = flattenItems(children);

  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [ visibleCount, setVisibleCount ] = useState(items.length);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    const mirror = mirrorRef.current;
    if (!container || !mirror) return;

    const available = container.clientWidth;
    const widths = Array.from(mirror.children).map((node) => (node as HTMLElement).offsetWidth);
    const total = widths.reduce((sum, w, i) => sum + w + (i > 0 ? GAP : 0), 0);

    if (total <= available) {
      setVisibleCount(widths.length);
      return;
    }

    let used = 0;
    let count = 0;
    for (let i = 0; i < widths.length; i++) {
      const add = widths[i] + (i > 0 ? GAP : 0);
      if (used + add + MORE_WIDTH > available) break;
      used += add;
      count++;
    }
    setVisibleCount(count);
  }, []);

  useLayoutEffect(() => {
    recompute();
  });

  useEffect(() => {
    const container = containerRef.current;
    const mirror = mirrorRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => recompute());
    observer.observe(container);
    if (mirror) observer.observe(mirror);
    return () => observer.disconnect();
  }, [ recompute ]);

  const visible = items.slice(0, visibleCount);
  const overflow = items.slice(visibleCount);

  return (
    <div
      ref={ containerRef }
      className={ "relative flex flex-row items-center gap-1 min-w-0 flex-1" }
    >
      <div
        ref={ mirrorRef }
        aria-hidden={ true }
        className={ "pointer-events-none invisible absolute left-0 top-0 flex flex-row items-center gap-1 w-max" }
      >
        { items.map((item, index) => (
          <div key={ index } className={ "flex flex-row items-center" }>
            { item }
          </div>
        )) }
      </div>

      { visible.map((item, index) => (
        <React.Fragment key={ index }>{ item }</React.Fragment>
      )) }

      { overflow.length > 0 && (
        <DropdownMenu
          placement={ "bottom-end" }
          minWidth={ 0 }
          panelClassName={ "dark" }
          trigger={
            <button
              type={ "button" }
              aria-label={ "More" }
              onMouseDown={ (event) => event.preventDefault() }
              className={ classNames(
                "lexical-tb-btn h-8 w-8 shrink-0",
                tone === "dark" ? "lexical-tb-btn-dark" : "lexical-tb-btn-light",
              ) }
            >
              <IconDots className={ "h-[18px] w-[18px]" }/>
            </button>
          }
        >
          <LexicalToolbarContext.Provider value={ { state, tone: "dark", orientation: "vertical" } }>
            <div
              className={ "flex flex-col items-stretch gap-1" }
              onMouseDown={ (event) => event.preventDefault() }
            >
              { overflow.map((item, index) => (
                <React.Fragment key={ index }>{ item }</React.Fragment>
              )) }
            </div>
          </LexicalToolbarContext.Provider>
        </DropdownMenu>
      ) }
    </div>
  );
};
