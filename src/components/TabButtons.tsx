import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import type { TablerIcon } from "@tabler/icons-react";

export type TabButton = {
  label: string | React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  Icon?: TablerIcon;
}

export type TabButtonsProps = {
  className?: string;
  tabs: TabButton[];
}

export const TabButtons = (props: TabButtonsProps) => {
  const {
    className,
    tabs
  } = props;
  //TODO Implement scroll to active tab if overflow
  //TODO Add support for icons
  //TODO Add sizing
  return (
    <div className={ classNames(
      'h-12 bg-gray-100 p-1 rounded-xl inline-flex flex-row space-x-1 overflow-x-auto',
      className
    ) }>
      { tabs.map((tab, i) => {
        const tabClasses = classNames(
          'shrink-0 px-4 h-full inline-flex flex-row items-center font-semibold rounded-xl cursor-pointer border border-transparent ing-0 hover:bg-gray-200 active:bg-gray-300/80 transition-all duration-150 select-none focus:outline-none focus:ring-0',
          tab.active && 'bg-white shadow-sm !border-gray-200'
        )
        if (tab.href) {
          return (
            <a
              key={ i }
              href={ tab.href }
              className={ tabClasses }
            >
              { tab.Icon && (
                <tab.Icon className={'h-5 w-5 shrink-0 mr-2 -ml-1'} />
              ) }
              { tab.label }
            </a>
          )
        }
        return (
          <button
            key={ i }
            className={ tabClasses }
            onClick={ tab.onClick }
          >
            { tab.Icon && (
              <tab.Icon className={'h-5 w-5 shrink-0 mr-2 -ml-1'} />
            ) }
            { tab.label }
          </button>
        )
      }) }
    </div>
  );
};