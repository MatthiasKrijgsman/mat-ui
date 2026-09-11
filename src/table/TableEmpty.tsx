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
    <div className={ classNames('mat:flex mat:flex-col mat:items-center mat:gap-3 mat:text-center', className) }>
      { Icon && (
        <div className={ 'mat:flex mat:h-14 mat:w-14 mat:items-center mat:justify-center mat:rounded-[var(--border-radius-panel)] mat:bg-[var(--color-table-header-bg)]' }>
          <Icon className={ 'mat:h-6 mat:w-6 mat:text-[var(--color-input-icon)]' }/>
        </div>
      ) }
      { (title || description) && (
        <div className={ 'mat:flex mat:flex-col mat:gap-1' }>
          { title && (
            <div className={ 'mat:font-[number:var(--font-weight-table-header)] mat:text-[var(--color-input-text)]' }>{ title }</div>
          ) }
          { description && (
            <div className={ 'mat:text-sm mat:text-[var(--color-input-description-text)]' }>{ description }</div>
          ) }
        </div>
      ) }
      { children }
    </div>
  );
};
