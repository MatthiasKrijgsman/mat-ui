import { classNames } from "@/util/classnames.util.ts";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import type { TabButton } from "@/components/TabButtons.tsx";
import {
  sizeFontClasses,
  sizeGapClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizePaddingXClasses,
} from "@/control-size/control-size.util.ts";

export type Size = 'sm' | 'md' | 'lg';

export type TabsProps = {
  className?: string;
  tabs: TabButton[];
  size?: Size;
}

export const Tabs = (props: TabsProps) => {
  const {
    className,
    tabs,
    size = 'md',
  } = props;
  return (
    <ControlSizeContext.Provider value={ size }>
      <div className={ classNames(
        'tabs-container w-full flex flex-row border-b-[length:var(--border-width-input)] overflow-x-auto mat-ui-hide-scrollbars',
        className
      ) }>
        { tabs.map((tab, i) => {
          const tabClasses = classNames(
            'tabs-tab shrink-0 -mb-[var(--border-width-input)] inline-flex flex-row items-center font-[number:var(--font-weight-tabs)] font-[family-name:var(--font-family-base)] cursor-pointer border-b-[length:var(--border-width-tabs-indicator)] ring-0 transition-colors duration-[var(--control-transition-duration)] select-none focus:outline-none focus:ring-0',
            sizeHeightClasses[size],
            sizePaddingXClasses[size],
            sizeFontClasses[size],
            sizeGapClasses[size],
            tab.active ? 'tabs-tab-active' : 'border-transparent'
          )
          const content = (
            <>
              { tab.Icon && (
                <tab.Icon className={ classNames(sizeIconClasses[size], 'shrink-0') } />
              ) }
              { tab.label }
              { tab.count != null && (
                <span className={ classNames(
                  'shrink-0 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full font-[number:var(--font-weight-tab-count)] font-[family-name:var(--font-family-base)] text-[length:var(--font-size-tab-count)]',
                  tab.active ? 'tabs-tab-count-active' : 'tabs-tab-count'
                ) }>
                  { tab.count }
                </span>
              ) }
            </>
          )
          if (tab.href) {
            return (
              <a
                key={ i }
                href={ tab.href }
                className={ tabClasses }
              >
                { content }
              </a>
            )
          }
          return (
            <button
              key={ i }
              className={ tabClasses }
              onClick={ tab.onClick }
            >
              { content }
            </button>
          )
        }) }
      </div>
    </ControlSizeContext.Provider>
  );
};
