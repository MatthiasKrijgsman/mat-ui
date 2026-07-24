import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from "@tabler/icons-react";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { sizeGapClasses, sizeIconClasses } from "@/control-size/control-size.util.ts";

export type Size = 'sm' | 'md' | 'lg';

/* Tab-specific size maps — the tokens default to the shared control scale
 * (see tokens.css), so tabs match buttons/inputs until a host overrides them. */
const tabHeightClasses: Record<Size, string> = {
  sm: 'h-[var(--control-size-sm-tab-height)]',
  md: 'h-[var(--control-size-md-tab-height)]',
  lg: 'h-[var(--control-size-lg-tab-height)]',
};
const tabPaddingXClasses: Record<Size, string> = {
  sm: 'px-[var(--control-size-sm-tab-px)]',
  md: 'px-[var(--control-size-md-tab-px)]',
  lg: 'px-[var(--control-size-lg-tab-px)]',
};
const tabFontClasses: Record<Size, string> = {
  sm: 'text-[length:var(--control-size-sm-tab-font-size)]',
  md: 'text-[length:var(--control-size-md-tab-font-size)]',
  lg: 'text-[length:var(--control-size-lg-tab-font-size)]',
};

export type TabButton = {
  /** Omit for an icon-only tab (pass `Icon` instead). */
  label?: string | React.ReactNode;
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
  /** Stretch the container and give every tab the same width. */
  fullWidth?: boolean;
}

export const TabButtons = (props: TabButtonsProps) => {
  const {
    className,
    tabs,
    size = 'md',
    fullWidth = false,
  } = props;
  //TODO Implement scroll to active tab if overflow
  return (
    <ControlSizeContext.Provider value={ size }>
      <div className={ classNames(
        'tab-container p-[var(--tab-container-padding)] rounded-[var(--border-radius-tab)] flex-row gap-[var(--tab-container-gap)]',
        fullWidth ? 'flex w-full' : 'inline-flex overflow-x-auto mat-ui-hide-scrollbars',
        tabHeightClasses[size],
        className
      ) }>
        { tabs.map((tab, i) => {
          const iconOnly = !!tab.Icon && tab.label == null;
          const tabClasses = classNames(
            'h-full inline-flex flex-row items-center font-[number:var(--font-weight-tab)] font-[family-name:var(--font-family-base)] rounded-[var(--border-radius-tab-inner)] cursor-pointer border border-transparent ring-0 tab-button transition-all duration-[var(--control-transition-duration)] select-none focus:outline-none focus:ring-0',
            fullWidth ? 'flex-1 basis-0 min-w-0 justify-center' : 'shrink-0',
            iconOnly && 'justify-center',
            tabPaddingXClasses[size],
            tabFontClasses[size],
            sizeGapClasses[size],
            tab.active && 'tab-button-active shadow-[var(--shadow-control)]'
          )
          const content = (
            <>
              { tab.Icon && (
                <tab.Icon className={ classNames(sizeIconClasses[size], 'shrink-0', !iconOnly && '-ml-1') } />
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
