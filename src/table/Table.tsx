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
    <>
      {/* Head container */ }
      <div className={ 'font-medium text-gray-800 flex flex-row' }>
        { columns.map((column) => (
          <TableColumnHead
            key={ column.id }
            column={ column }
          />
        )) }
      </div>

      {/* Row container */ }
      <div className={ 'flex flex-col' }>
        { rows.map((row) => (
          <div
            key={ JSON.stringify(row) }
            className={ 'flex flex-row border-b border-b-gray-200 hover:bg-gray-50 bg-white transition-all duration-100' }
          >
            { columns.map((column) => (
              <div key={ column.id } className={ 'flex-1 content-center px-4' } style={ { height: 44 } }>
                { column.renderCell(row) }
              </div>
            )) }
          </div>
        )) }
      </div>
    </>
  );
};