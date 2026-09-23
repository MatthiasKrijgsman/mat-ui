import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from "@tabler/icons-react";
import { ControlSizeContext } from "@/control-size/use-control-size.ts";
import { sizeGapClasses, sizeIconClasses } from "@/control-size/control-size.util.ts";

export type Size = 'sm' | 'md' | 'lg';

/* Tab-specific size maps — the tokens default to the shared control scale
 * (see tokens.css), so tabs match buttons/inputs until a host overrides them. */
const tabHeightClasses: Record<Size, string> = {
  sm: 'mat:h-[var(--control-size-sm-tab-height)]',
  md: 'mat:h-[var(--control-size-md-tab-height)]',
  lg: 'mat:h-[var(--control-size-lg-tab-height)]',
};
const tabPaddingXClasses: Record<Size, string> = {
  sm: 'mat:px-[var(--control-size-sm-tab-px)]',
  md: 'mat:px-[var(--control-size-md-tab-px)]',
  lg: 'mat:px-[var(--control-size-lg-tab-px)]',
};
const tabFontClasses: Record<Size, string> = {
  sm: 'mat:text-[length:var(--control-size-sm-tab-font-size)]',
  md: 'mat:text-[length:var(--control-size-md-tab-font-size)]',
  lg: 'mat:text-[length:var(--control-size-lg-tab-font-size)]',
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
        'tab-container mat:p-[var(--tab-container-padding)] mat:rounded-[var(--border-radius-tab)] mat:flex-row mat:gap-[var(--tab-container-gap)]',
        fullWidth ? 'mat:flex mat:w-full' : 'mat:inline-flex mat:overflow-x-auto mat-ui-hide-scrollbars',
        tabHeightClasses[size],
        className
      ) }>
        { tabs.map((tab, i) => {
          const iconOnly = !!tab.Icon && tab.label == null;
          const tabClasses = classNames(
            'mat:h-full mat:inline-flex mat:flex-row mat:items-center mat:font-[number:var(--font-weight-tab)] mat:font-[family-name:var(--font-family-base)] mat:rounded-[var(--border-radius-tab-inner)] mat:cursor-pointer mat:border mat:border-transparent mat:ring-0 tab-button mat:transition-all mat:duration-[var(--control-transition-duration)] mat:select-none mat:focus:outline-none mat:focus:ring-0',
            fullWidth ? 'mat:flex-1 mat:basis-0 mat:min-w-0 mat:justify-center' : 'mat:shrink-0',
            iconOnly && 'mat:justify-center',
            tabPaddingXClasses[size],
            tabFontClasses[size],
            sizeGapClasses[size],
            tab.active && 'tab-button-active mat:shadow-[var(--shadow-control)]'
          )
          const content = (
            <>
              { tab.Icon && (
                <tab.Icon className={ classNames(sizeIconClasses[size], 'mat:shrink-0', !iconOnly && 'mat:-ml-1') } />
              ) }
              { tab.label }
              { tab.count != null && (
                <span className={ classNames(
                  'mat:shrink-0 mat:inline-flex mat:items-center mat:justify-center mat:h-5 mat:min-w-5 mat:px-1.5 mat:rounded-full mat:font-[number:var(--font-weight-tab-count)] mat:font-[family-name:var(--font-family-base)] mat:text-[length:var(--font-size-tab-count)]',
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
