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
    <table>
      <thead>
      <tr className={ 'text-left' }>
        { columns.map((column) => (
          <th key={ column.id }>{ column.header }</th>
        )) }
      </tr>
      </thead>

      <tbody>
      { rows.map((row, rowIndex) => (
        <tr key={ rowIndex }>
          { columns.map((column) => (
            <td key={ column.id }>{ column.renderCell(row) }</td>
          )) }
        </tr>
      )) }
      </tbody>
    </table>
  );
};