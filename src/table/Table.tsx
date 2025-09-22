import * as React from "react";

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
    <div className={ 'border border-gray-200 rounded-xl shadow-sm overflow-hidden' }>
      <table className={ 'table-fixed' }>
        <colgroup>
          { columns.map((column) => (
            <col
              key={ column.id }
              width={ 250 }
            />
          )) }
        </colgroup>
        <thead>
        <tr className={ 'divide-gray-200 divide-x text-left bg-gray-50 text-gray-400 border-b border-b-gray-200' }>
          { columns.map((column) => (
            <th key={ column.id } className={ 'font-medium h-[3rem] relative hover:bg-gray-100 cursor-pointer active:bg-gray-200 transition-colors duration-150' }>
              <div className={ 'absolute inset-0' }>
                <div className={ 'flex items-center h-full w-full px-4' }>
                  { column.header }
                </div>
              </div>
            </th>
          )) }
        </tr>
        </thead>

        <tbody className={ 'divide-y divide-gray-200' }>
        { rows.map((row, rowIndex) => (
          <tr key={ rowIndex } className={ 'divide-gray-200 divide-x' }>
            { columns.map((column) => (
              <td key={ column.id } className={ 'h-[3rem] relative' }>
                <div className={ 'absolute inset-0 ' }>
                  <div className={ 'flex items-center h-full w-full px-4' }>
                    { column.renderCell(row) }
                  </div>
                </div>
              </td>
            )) }
          </tr>
        )) }
        </tbody>
      </table>
    </div>
  );
};