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
      className={ 'mat:flex mat:flex-row mat:items-stretch mat:select-none mat:shrink-0' }
    >
      <div
        className={ classNames(
          'mat:flex-1 mat:min-w-0 mat:px-4 table-header-cell mat:transition-colors mat:duration-[var(--control-transition-duration-fast)] mat:flex mat:flex-row mat:items-center mat:gap-2',
          sortable && 'mat:cursor-pointer',
        ) }
        onClick={ sortable ? onSortClick : undefined }
      >
        <span className={ 'mat:truncate' }>{ column.header }</span>
        { sortable && sortDirection === 'asc' && (
          <IconChevronUp className={ 'mat:h-4 mat:w-4 mat:shrink-0' }/>
        ) }
        { sortable && sortDirection === 'desc' && (
          <IconChevronDown className={ 'mat:h-4 mat:w-4 mat:shrink-0' }/>
        ) }
      </div>
      <div
        { ...bind }
        className={ 'mat:cursor-ew-resize mat:group mat:py-4 table-resize-handle mat:w-[8px]' }
      >
        <div
          className={ 'mat:w-0.5 mat:h-full mat:mx-auto table-resize-divider table-resize-divider-hover mat:pointer-events-none' }/>
      </div>
    </div>
  );
};
