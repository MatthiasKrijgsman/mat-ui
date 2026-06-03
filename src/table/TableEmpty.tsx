import * as React from "react";
import { type TablerIcon } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";


export type TableEmptyProps = {
  Icon?: TablerIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Optional action(s) rendered below the text, e.g. a button. */
  children?: React.ReactNode;
  className?: string;
}

export const TableEmpty = (props: TableEmptyProps) => {
  const { Icon, title, description, children, className } = props;

  return (
    <div className={ classNames('flex flex-col items-center gap-3 text-center', className) }>
      { Icon && (
        <div className={ 'flex h-14 w-14 items-center justify-center rounded-[var(--border-radius-panel)] bg-[var(--color-table-header-bg)]' }>
          <Icon className={ 'h-6 w-6 text-[var(--color-input-icon)]' }/>
        </div>
      ) }
      { (title || description) && (
        <div className={ 'flex flex-col gap-1' }>
          { title && (
            <div className={ 'font-[number:var(--font-weight-table-header)] text-[var(--color-input-text)]' }>{ title }</div>
          ) }
          { description && (
            <div className={ 'text-sm text-[var(--color-input-description-text)]' }>{ description }</div>
          ) }
        </div>
      ) }
      { children }
    </div>
  );
};
