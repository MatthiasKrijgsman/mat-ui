import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TableColumnHead } from "@/table/TableColumnHead.tsx";
import { classNames } from "@/util/classnames.util.ts";

export type TableSortDirection = 'asc' | 'desc';

export type TableSortState = {
  columnId: string;
  direction: TableSortDirection;
}

export type TableColumnDef<T> = {
  id: string;
  header: React.ReactNode;
  renderCell: (row: T, rowIndex: number) => React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  /** When true, the column header is clickable and participates in sorting. */
  sortable?: boolean;
}

export type TableProps<T> = {
  columns: TableColumnDef<T>[];
  rows: T[];
  /** Stable identifier for each row. Used as the React key. */
  getRowId: (row: T, rowIndex: number) => string | number;
  /** Fires when a row is clicked. Setting this also makes rows look interactive (pointer cursor). */
  onRowClick?: (row: T, rowIndex: number) => void;
  /** Active sort. Controlled — the consumer is responsible for sorting `rows`. */
  sort?: TableSortState | null;
  /** Fires when the user clicks a sortable column. Cycles null → asc → desc → null. */
  onSortChange?: (sort: TableSortState | null) => void;
  className?: string;
  rowHeight?: number;
  headerHeight?: number;
}

const DEFAULT_COLUMN_WIDTH = 200;
const DEFAULT_MIN_COLUMN_WIDTH = 60;

const buildInitialWidths = <T,>(columns: TableColumnDef<T>[]): Record<string, number> => {
  const widths: Record<string, number> = {};
  for (const col of columns) {
    widths[col.id] = col.defaultWidth ?? DEFAULT_COLUMN_WIDTH;
  }
  return widths;
};

export const Table = <T, >(props: TableProps<T>) => {
  const {
    columns,
    rows,
    getRowId,
    onRowClick,
    sort,
    onSortChange,
    className,
    rowHeight = 44,
    headerHeight = 44,
  } = props;

  // Lazy init — runs once on the server and once on hydration with the same
  // input, so the rendered HTML matches.
  const [widths, setWidths] = useState<Record<string, number>>(() => buildInitialWidths(columns));

  // If a column is added/removed/renamed, sync the widths map. Resized widths
  // are preserved for columns that still exist by id.
  useEffect(() => {
    setWidths(prev => {
      const next: Record<string, number> = {};
      let changed = Object.keys(prev).length !== columns.length;
      for (const col of columns) {
        if (col.id in prev) {
          next[col.id] = prev[col.id];
        } else {
          next[col.id] = col.defaultWidth ?? DEFAULT_COLUMN_WIDTH;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [columns]);

  const handleResize = useCallback((columnId: string, dx: number, minWidth: number) => {
    setWidths(prev => {
      const current = prev[columnId] ?? DEFAULT_COLUMN_WIDTH;
      const next = Math.max(minWidth, current + dx);
      if (next === current) return prev;
      return { ...prev, [columnId]: next };
    });
  }, []);

  const handleSortClick = useCallback((columnId: string) => {
    if (!onSortChange) return;
    if (!sort || sort.columnId !== columnId) {
      onSortChange({ columnId, direction: 'asc' });
      return;
    }
    if (sort.direction === 'asc') {
      onSortChange({ columnId, direction: 'desc' });
      return;
    }
    onSortChange(null);
  }, [sort, onSortChange]);

  const totalWidth = columns.reduce(
    (sum, c) => sum + (widths[c.id] ?? c.defaultWidth ?? DEFAULT_COLUMN_WIDTH),
    0,
  );

  const headerScrollRef = useRef<HTMLDivElement>(null);

  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className={ classNames('flex flex-col h-full w-full', className) }>
      {/* Header strip — overflow-hidden, scroll-synced with body via JS so
          users only scroll one container. */}
      <div
        ref={ headerScrollRef }
        className={ 'overflow-hidden shrink-0' }
        style={ { height: headerHeight } }
      >
        <div
          className={ 'flex flex-row table-header font-medium' }
          style={ { width: totalWidth, minWidth: '100%' } }
        >
          { columns.map((col) => (
            <TableColumnHead
              key={ col.id }
              column={ col }
              width={ widths[col.id] ?? col.defaultWidth ?? DEFAULT_COLUMN_WIDTH }
              height={ headerHeight }
              onResize={ (dx) => handleResize(col.id, dx, col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH) }
              sortDirection={ sort?.columnId === col.id ? sort.direction : null }
              onSortClick={ () => handleSortClick(col.id) }
            />
          )) }
        </div>
      </div>
      {/* Body — the only scrolling container. */}
      <div
        className={ 'flex-1 overflow-auto' }
        onScroll={ handleBodyScroll }
      >
        <div
          className={ 'flex flex-col' }
          style={ { width: totalWidth, minWidth: '100%' } }
        >
          { rows.map((row, rowIndex) => (
            <div
              key={ getRowId(row, rowIndex) }
              className={ classNames(
                'flex flex-row table-body-row transition-colors duration-100',
                onRowClick && 'cursor-pointer',
              ) }
              onClick={ onRowClick ? () => onRowClick(row, rowIndex) : undefined }
            >
              { columns.map((col) => (
                <div
                  key={ col.id }
                  className={ 'shrink-0 content-center px-4 relative' }
                  style={ {
                    width: widths[col.id] ?? col.defaultWidth ?? DEFAULT_COLUMN_WIDTH,
                    height: rowHeight,
                  } }
                >
                  <div className={'break-all line-clamp-1'}>
                    { col.renderCell(row, rowIndex) }
                  </div>
                </div>
              )) }
            </div>
          )) }
        </div>
      </div>
    </div>
  );
};
