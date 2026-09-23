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
        'tabs-container mat:w-full mat:flex mat:flex-row mat:border-b-[length:var(--border-width-input)] mat:overflow-x-auto mat-ui-hide-scrollbars',
        className
      ) }>
        { tabs.map((tab, i) => {
          const tabClasses = classNames(
            'tabs-tab mat:shrink-0 mat:-mb-[var(--border-width-input)] mat:inline-flex mat:flex-row mat:items-center mat:font-[number:var(--font-weight-tabs)] mat:font-[family-name:var(--font-family-base)] mat:cursor-pointer mat:border-b-[length:var(--border-width-tabs-indicator)] mat:ring-0 mat:transition-colors mat:duration-[var(--control-transition-duration)] mat:select-none mat:focus:outline-none mat:focus:ring-0',
            sizeHeightClasses[size],
            sizePaddingXClasses[size],
            sizeFontClasses[size],
            sizeGapClasses[size],
            tab.active ? 'tabs-tab-active' : 'mat:border-transparent'
          )
          const content = (
            <>
              { tab.Icon && (
                <tab.Icon className={ classNames(sizeIconClasses[size], 'mat:shrink-0') } />
              ) }
              { tab.label }
              { tab.count != null && (
                <span className={ classNames(
                  'mat:shrink-0 mat:inline-flex mat:items-center mat:justify-center mat:h-5 mat:min-w-5 mat:px-1.5 mat:rounded-full mat:font-[number:var(--font-weight-tab-count)] mat:font-[family-name:var(--font-family-base)] mat:text-[length:var(--font-size-tab-count)]',
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
