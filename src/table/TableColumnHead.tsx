import type { TableColumnDef, TableSortDirection } from "@/table/Table.tsx";
import { useDragX } from "@/hooks/use-drag-x.ts";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";

export type TableColumnHeadProps<T> = {
  column: TableColumnDef<T>;
  width: number;
  height: number;
  onResize: (dx: number) => void;
  /** Direction the column is currently sorted, or null when it is not the active sort. */
  sortDirection: TableSortDirection | null;
  onSortClick: () => void;
}

export const TableColumnHead = <T, >(props: TableColumnHeadProps<T>) => {
  const {
    column,
    width,
    height,
    onResize,
    sortDirection,
    onSortClick,
  } = props;

  const sortable = !!column.sortable;

  const { bind } = useDragX({
    onDelta: (dx) => onResize(dx),
  });

  return (
    <div
      style={ { width, height } }
      className={ 'flex flex-row items-stretch select-none shrink-0' }
    >
      <div
        className={ classNames(
          'flex-1 min-w-0 px-4 table-header-cell transition-colors duration-100 flex flex-row items-center gap-2',
          sortable && 'cursor-pointer',
        ) }
        onClick={ sortable ? onSortClick : undefined }
      >
        <span className={ 'truncate' }>{ column.header }</span>
        { sortable && sortDirection === 'asc' && (
          <IconChevronUp className={ 'h-4 w-4 shrink-0' }/>
        ) }
        { sortable && sortDirection === 'desc' && (
          <IconChevronDown className={ 'h-4 w-4 shrink-0' }/>
        ) }
      </div>
      <div
        { ...bind }
        className={ 'cursor-ew-resize group py-4 table-resize-handle w-[8px]' }
      >
        <div
          className={ 'w-0.5 h-full mx-auto table-resize-divider table-resize-divider-hover pointer-events-none' }/>
      </div>
    </div>
  );
};
