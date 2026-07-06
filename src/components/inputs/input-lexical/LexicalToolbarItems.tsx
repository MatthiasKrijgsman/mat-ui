import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconDots } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";
import { DropdownMenu } from "@/components/dropdown-menu/DropdownMenu.tsx";
import {
  LexicalToolbarContext,
  useLexicalToolbar,
} from "@/components/inputs/input-lexical/use-lexical-toolbar.ts";
import {
  LexicalToolbarDivider,
  LexicalToolbarRowDivider,
} from "@/components/inputs/input-lexical/LexicalToolbarDivider.tsx";

export type LexicalToolbarItemsProps = {
  children: React.ReactNode;
  /** When false, items that no longer fit wrap onto extra rows (separated by
   * a divider) instead of collapsing into the "⋮" overflow dropdown. */
  collapsible?: boolean;
};

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
 * fit, collapses the trailing items into a "⋮" vertical dropdown — or, with
 * `collapsible: false`, wraps them onto extra divider-separated rows. A hidden
 * mirror row provides stable intrinsic widths so growth/shrink decisions stay
 * consistent. */
export const LexicalToolbarItems = (props: LexicalToolbarItemsProps) => {
  const { children, collapsible = true } = props;
  const { state, tone } = useLexicalToolbar();
  const items = flattenItems(children);

  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [ visibleCount, setVisibleCount ] = useState(items.length);
  // Items per wrapped row (non-collapsible mode).
  const [ rowCounts, setRowCounts ] = useState<number[]>([ items.length ]);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    const mirror = mirrorRef.current;
    if (!container || !mirror) return;

    // The zero-height in-flow mirror keeps the container's intrinsic width at
    // the full item row, so this measures "the space we could use" (imposed
    // width, or the full row when the bar is content-sized) — never a feedback
    // loop off the currently visible items, which would latch a content-sized
    // bar collapsed. Fractional widths + 0.5px slack avoid rounding flicker.
    const available = container.getBoundingClientRect().width + 0.5;
    // gap-1 in px — resolved rather than hardcoded so a non-16px root font
    // (rem-based gap) doesn't skew the fit math.
    const GAP = parseFloat(getComputedStyle(mirror).columnGap) || 4;
    const widths = Array.from(mirror.children).map((node) => (node as HTMLElement).getBoundingClientRect().width);
    const total = widths.reduce((sum, w, i) => sum + w + (i > 0 ? GAP : 0), 0);

    if (!collapsible) {
      // Greedily pack items into as many rows as needed.
      const rows: number[] = [];
      let used = 0;
      let count = 0;
      for (const width of widths) {
        const add = width + (count > 0 ? GAP : 0);
        if (count > 0 && used + add > available) {
          rows.push(count);
          used = width;
          count = 1;
        } else {
          used += add;
          count++;
        }
      }
      if (count > 0) rows.push(count);
      setRowCounts((prev) => (
        prev.length === rows.length && prev.every((n, i) => n === rows[i]) ? prev : rows
      ));
      return;
    }

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
  }, [ collapsible ]);

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

  /* In flow (not absolute) so the full item row defines the container's
   * intrinsic width — a content-sized floating bar then sizes to all items
   * (clamped by any imposed width/max-width) instead of to whatever happens
   * to be visible. Zero height + clip keeps it out of the visual layout. */
  const mirror = (
    <div aria-hidden={ true } className={ "pointer-events-none invisible h-0 overflow-hidden" }>
      <div
        ref={ mirrorRef }
        className={ "flex flex-row items-center gap-1 w-max" }
      >
        { items.map((item, index) => (
          // shrink-0: the w-max row box can come out gap-short in some
          // engines' intrinsic sizing — items must not shrink into it, or
          // the measured widths under-report and the bar under-collapses.
          <div key={ index } className={ "flex flex-row items-center shrink-0" }>
            { item }
          </div>
        )) }
      </div>
    </div>
  );

  if (!collapsible) {
    const rows: React.ReactNode[][] = [];
    let start = 0;
    for (const count of rowCounts) {
      if (start >= items.length) break;
      rows.push(items.slice(start, start + count));
      start += count;
    }
    // Items beyond the last measured break (e.g. before the first measure
    // after items were added) go on a trailing row.
    if (start < items.length) rows.push(items.slice(start));

    // A vertical divider stranded at a row edge by the wrapping reads as
    // noise — hide it there (the mirror still measures it, keeping the row
    // math in sync).
    const isDivider = (node: React.ReactNode) =>
      React.isValidElement(node) && node.type === LexicalToolbarDivider;

    return (
      <div
        ref={ containerRef }
        className={ "flex flex-col min-w-0 flex-1" }
      >
        { mirror }
        { rows.map((row, rowIndex) => (
          <React.Fragment key={ rowIndex }>
            { rowIndex > 0 && <LexicalToolbarRowDivider/> }
            <div className={ "flex flex-row items-center gap-1" }>
              { row.map((item, index) => (
                <React.Fragment key={ index }>
                  { (index === 0 || index === row.length - 1) && isDivider(item) ? null : item }
                </React.Fragment>
              )) }
            </div>
          </React.Fragment>
        )) }
      </div>
    );
  }

  const visible = items.slice(0, visibleCount);
  const overflow = items.slice(visibleCount);

  return (
    <div
      ref={ containerRef }
      className={ "flex flex-col min-w-0 flex-1" }
    >
      { mirror }

      <div className={ "flex flex-row items-center gap-1" }>
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
                onMouseDown={ (event) => {
                  // Keep the editor selection intact for button presses — but a
                  // blanket preventDefault would also block native focus, making
                  // the form fields inside (number/select inputs) untypeable.
                  const target = event.target as HTMLElement;
                  if (!target.closest("input, textarea, select")) event.preventDefault();
                } }
              >
                { overflow.map((item, index) => (
                  <React.Fragment key={ index }>{ item }</React.Fragment>
                )) }
              </div>
            </LexicalToolbarContext.Provider>
          </DropdownMenu>
        ) }
      </div>
    </div>
  );
};
