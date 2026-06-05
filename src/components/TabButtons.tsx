import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from "@tabler/icons-react";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import {
  sizeFontClasses,
  sizeGapClasses,
  sizeHeightClasses,
  sizeIconClasses,
  sizePaddingXClasses,
} from "@/control-size/control-size.util.ts";

export type Size = 'sm' | 'md' | 'lg';

export type TabButton = {
  label: string | React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  Icon?: TablerIcon;
  count?: React.ReactNode;
}

export type TabButtonsProps = {
  className?: string;
  tabs: TabButton[];
  size?: Size;
}

export const TabButtons = (props: TabButtonsProps) => {
  const {
    className,
    tabs,
    size = 'md',
  } = props;
  //TODO Implement scroll to active tab if overflow
  return (
    <ControlSizeContext.Provider value={ size }>
      <div className={ classNames(
        'tab-container p-1 rounded-[var(--border-radius-tab)] inline-flex flex-row space-x-1 overflow-x-auto mat-ui-hide-scrollbars',
        sizeHeightClasses[size],
        className
      ) }>
        { tabs.map((tab, i) => {
          const tabClasses = classNames(
            'shrink-0 h-full inline-flex flex-row items-center font-[number:var(--font-weight-tab)] font-[family-name:var(--font-family-base)] rounded-[var(--border-radius-tab)] cursor-pointer border border-transparent ring-0 tab-button transition-all duration-[var(--control-transition-duration)] select-none focus:outline-none focus:ring-0',
            sizePaddingXClasses[size],
            sizeFontClasses[size],
            sizeGapClasses[size],
            tab.active && 'tab-button-active shadow-[var(--shadow-control)]'
          )
          const content = (
            <>
              { tab.Icon && (
                <tab.Icon className={ classNames(sizeIconClasses[size], 'shrink-0 -ml-1') } />
              ) }
              { tab.label }
              { tab.count != null && (
                <span className={ classNames(
                  'shrink-0 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full font-[number:var(--font-weight-tab-count)] font-[family-name:var(--font-family-base)] text-[length:var(--font-size-tab-count)]',
                  tab.active ? 'tab-button-count-active' : 'tab-button-count'
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
