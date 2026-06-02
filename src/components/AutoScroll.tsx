import * as React from "react";
import { animate } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";

export type AutoScrollProps = {
  duration?: number;
  ease?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  horizontal?: boolean;
  /** Pause auto-scrolling when the user scrolls away from the end; resume when they scroll back. */
  pauseOnScroll?: boolean;
  /** Distance (px) from the end still treated as "pinned" to the end. Defaults to 32. */
  threshold?: number;
  /** Called when the pinned-to-end state changes — e.g. to toggle a "scroll to bottom" affordance. */
  onPinnedChange?: (pinned: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const AutoScroll = (props: AutoScrollProps) => {
  const {
    duration = 0.3,
    ease = "easeInOut",
    horizontal = false,
    pauseOnScroll = false,
    threshold = 1,
    onPinnedChange,
    children,
    className,
    ...rest
  } = props;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);

  // Whether the view is currently stuck to the end. Source of truth; a ref so the
  // ResizeObserver / scroll handlers always read the latest value without re-running.
  const pinnedRef = React.useRef(true);
  // True while we are driving the scroll ourselves, so our own motion is not mistaken
  // for the user scrolling away from the end.
  const programmaticRef = React.useRef(false);

  // Keep the latest callback without re-running the effect when an inline fn changes identity.
  const onPinnedChangeRef = React.useRef(onPinnedChange);
  onPinnedChangeRef.current = onPinnedChange;

  React.useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let firstObservation = true;

    const getMax = () => horizontal
      ? container.scrollWidth - container.clientWidth
      : container.scrollHeight - container.clientHeight;
    const getCurrent = () => horizontal ? container.scrollLeft : container.scrollTop;
    const setScroll = (value: number) => {
      if (horizontal) {
        container.scrollLeft = value;
      } else {
        container.scrollTop = value;
      }
    };

    const setPinned = (next: boolean) => {
      if (pinnedRef.current === next) return;
      pinnedRef.current = next;
      onPinnedChangeRef.current?.(next);
    };

    const scrollToEnd = () => {
      if (pauseOnScroll && !pinnedRef.current) return;

      const target = getMax();
      const current = getCurrent();

      if (target <= 0 || Math.abs(target - current) < 1) return;

      if (firstObservation) {
        firstObservation = false;
        programmaticRef.current = true;
        setScroll(target);
        requestAnimationFrame(() => { programmaticRef.current = false; });
        return;
      }

      animationRef.current?.stop();
      programmaticRef.current = true;
      animationRef.current = animate(current, target, {
        duration,
        ease,
        onUpdate: setScroll,
        onComplete: () => {
          requestAnimationFrame(() => { programmaticRef.current = false; });
        },
      });
    };

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(content);

    // User-scroll tracking — opt-in via `pauseOnScroll`.
    const handleScroll = () => {
      // Ignore scroll events caused by our own animation, otherwise the transient
      // mid-animation position would read as "scrolled away" and pause us.
      if (programmaticRef.current) return;
      setPinned(getMax() - getCurrent() <= threshold);
    };
    const handleUserInput = () => {
      // A genuine user gesture: stop fighting them and let scroll position decide.
      animationRef.current?.stop();
      programmaticRef.current = false;
    };

    if (pauseOnScroll) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      container.addEventListener("wheel", handleUserInput, { passive: true });
      container.addEventListener("touchstart", handleUserInput, { passive: true });
    }

    return () => {
      observer.disconnect();
      animationRef.current?.stop();
      if (pauseOnScroll) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleUserInput);
        container.removeEventListener("touchstart", handleUserInput);
      }
    };
  }, [ duration, ease, horizontal, pauseOnScroll, threshold ]);

  return (
    <div
      ref={ containerRef }
      className={ classNames(
        'min-h-0 min-w-0',
        horizontal ? 'overflow-x-auto' : 'overflow-y-auto',
        className
      ) }
      { ...rest }
    >
      <div ref={ contentRef }>
        { children }
      </div>
    </div>
  );
};
