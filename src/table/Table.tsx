import * as React from "react";
import { TableColumnHead } from "@/table/TableColumnHead.tsx";

export type TableColumnDef<T> = {
  id: string;
  header: string;
  renderCell: (row: T) => React.ReactNode;
}

export type TableProps<T> = {
  columns: TableColumnDef<T>[];
  rows: T[];
}

export const Table = <T, >(props: TableProps<T>) => {
  const {
    columns,
    rows
  } = props;

  return (
    <div
      className={ 'flex flex-col relative min-h-[300px] overflow-hidden rounded-xl border border-gray-200 shadow-sm' }
    >

      <div
        className={ 'absolute left-0 right-0 border-b border-b-gray-200 z-10 bg-gray-50' }
        style={ { height: 44 + 1 } }
      />

      {/* Head container */ }
      <div className={ 'font-medium text-gray-800 absolute flex flex-row z-10' }>
        { columns.map((column) => (
          <TableColumnHead
            key={ column.id }
            column={ column }
          />
        )) }
      </div>

      <div
        className={ 'absolute left-0 right-0 bottom-0' }
        style={ { top: 44 } }
      >
        {/* Row container */ }
        <div className={ 'flex flex-col absolute' }>
          { rows.map((row) => (
            <div
              key={ JSON.stringify(row) }
              className={ 'flex flex-row border-b border-b-gray-200 hover:bg-gray-50 bg-white transition-all duration-100' }
            >
              { columns.map((column) => (
                <div key={ column.id } className={ 'content-center px-4' } style={ { width: 250, height: 44 } }>
                  { column.renderCell(row) }
                </div>
              )) }
            </div>
          )) }
        </div>
      </div>
    </div>
  );
};