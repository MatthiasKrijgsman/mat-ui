import { type RefObject, useLayoutEffect, useState } from "react";

type UseOverflowFitOptions = {
  enabled: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  measureRef: RefObject<HTMLElement | null>;
  trayRef?: RefObject<HTMLElement | null>;
  itemCount: number;
  deps?: ReadonlyArray<unknown>;
  gap?: number;
};

/* Computes how many of `itemCount` items fit on a single line inside the
 * trigger element, reserving room for a trailing "+N more" indicator.
 *
 * The measure layer must render the items in order, followed by the
 * worst-case "+N more" element as its last child. The hook reads each
 * child's width via offsetWidth and ignores layout outside the measure
 * subtree, so the measure layer can be visibility:hidden.
 */
export function useOverflowFit(options: UseOverflowFitOptions): number {
  const {
    enabled,
    triggerRef,
    measureRef,
    trayRef,
    itemCount,
    deps = [],
    gap = 4,
  } = options;

  const [ visibleCount, setVisibleCount ] = useState(0);

  useLayoutEffect(() => {
    if (!enabled) return;
    const trigger = triggerRef.current;
    const measure = measureRef.current;
    if (!trigger || !measure) return;

    const compute = () => {
      if (itemCount === 0) {
        setVisibleCount(0);
        return;
      }
      if (itemCount === 1) {
        setVisibleCount(1);
        return;
      }

      const cs = window.getComputedStyle(trigger);
      const paddingLeft = parseFloat(cs.paddingLeft || '0');
      const triggerRect = trigger.getBoundingClientRect();
      const contentLeft = triggerRect.left + paddingLeft;

      let contentRight = triggerRect.right - parseFloat(cs.paddingRight || '0');
      const trayEl = trayRef?.current;
      if (trayEl) {
        const trayRect = trayEl.getBoundingClientRect();
        if (trayRect.width > 0) {
          contentRight = Math.min(contentRight, trayRect.left - gap);
        }
      }
      const available = Math.max(0, contentRight - contentLeft);

      const children = Array.from(measure.children) as HTMLElement[];
      if (children.length < itemCount + 1) return;

      let totalAll = 0;
      for (let i = 0; i < itemCount; i++) {
        totalAll += children[i].offsetWidth + (i > 0 ? gap : 0);
      }
      if (totalAll <= available) {
        setVisibleCount(itemCount);
        return;
      }

      const moreWidth = children[itemCount].offsetWidth;
      let used = 0;
      let count = 0;
      for (let i = 0; i < itemCount; i++) {
        const w = children[i].offsetWidth;
        const next = used + w + (i > 0 ? gap : 0);
        if (next + moreWidth + gap > available) break;
        used = next;
        count++;
      }
      setVisibleCount(Math.max(1, count));
    };

    const ro = new ResizeObserver(compute);
    ro.observe(trigger);
    if (trayRef?.current) ro.observe(trayRef.current);
    compute();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ enabled, itemCount, ...deps ]);

  return visibleCount;
}
