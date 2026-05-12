import * as React from "react";
import { animate } from "motion/react";
import { classNames } from "@/util/classnames.util.ts";

export type AutoScrollProps = {
  duration?: number;
  ease?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  horizontal?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const AutoScroll = (props: AutoScrollProps) => {
  const {
    duration = 0.3,
    ease = "easeInOut",
    horizontal = false,
    children,
    className,
    ...rest
  } = props;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let firstObservation = true;

    const scrollToEnd = () => {
      const target = horizontal
        ? container.scrollWidth - container.clientWidth
        : container.scrollHeight - container.clientHeight;
      const current = horizontal ? container.scrollLeft : container.scrollTop;

      if (target <= 0 || Math.abs(target - current) < 1) return;

      if (firstObservation) {
        firstObservation = false;
        if (horizontal) {
          container.scrollLeft = target;
        } else {
          container.scrollTop = target;
        }
        return;
      }

      animationRef.current?.stop();
      animationRef.current = animate(current, target, {
        duration,
        ease,
        onUpdate: (value) => {
          if (horizontal) {
            container.scrollLeft = value;
          } else {
            container.scrollTop = value;
          }
        },
      });
    };

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(content);

    return () => {
      observer.disconnect();
      animationRef.current?.stop();
    };
  }, [ duration, ease, horizontal ]);

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
