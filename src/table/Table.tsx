import * as React from "react";
import { TableColumnHead } from "@/table/TableColumnHead.tsx";

export type TableColumnDef<T> = {
  id: string;
  header: string;
  renderCell: (row: T) => React.ReactNode;
  defaultWidth?: number;
}

export type TableProps<T> = {
  columns: TableColumnDef<T>[];
  rows: T[];
  className?: string;
}

export const Table = <T, >(props: TableProps<T>) => {
  const {
    columns,
    rows,
    className
  } = props;

  const headerRef = React.useRef<HTMLDivElement>(null);

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headerRef.current) {
      headerRef.current.scrollTo({ left: e.currentTarget.scrollLeft })
    }
  }

  return (
    <div className={ className }>
      <div className={ 'relative h-[45px] w-full overflow-hidden' } ref={ headerRef }>
        <div className={ 'absolute' }>
          {/* Head container */ }
          <div className={ 'font-medium text-gray-800 flex flex-row border-b border-b-gray-200' }>
            { columns.map((column) => (
              <TableColumnHead
                key={ column.id }
                column={ column }
              />
            )) }
          </div>
        </div>
      </div>
      <div className={ 'relative overflow-scroll min-w-full min-h-full' } onScroll={ handleOnScroll }>
        <div className={ 'absolute' }>
          {/* Row container */ }
          <div className={ 'flex flex-col' }>
            { rows.map((row) => (
              <div
                key={ JSON.stringify(row) }
                className={ 'flex flex-row border-b border-b-gray-200 hover:bg-gray-50 bg-white transition-all duration-100' }
              >
                { columns.map((column) => (
                  <div key={ column.id } className={ 'flex-1 content-center px-4' }
                       style={ { height: 44, width: 250 } }>
                    { column.renderCell(row) }
                  </div>
                )) }
              </div>
            )) }
          </div>

        </div>
      </div>
    </div>
  );
};