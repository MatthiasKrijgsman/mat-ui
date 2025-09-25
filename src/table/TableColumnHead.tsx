import type { TableColumnDef } from "@/table/Table.tsx";

export type TableColumnHeadProps<T> = {
  column: TableColumnDef<T>;
}

export const TableColumnHead = <T, >(props: TableColumnHeadProps<T>) => {
  const {
    column
  } = props;

  return (
    <div
      style={ { width: 250, height: 44 } }
      className={'flex flex-row items-stretch select-none'}
    >
      <div
        className={ 'flex-1 content-center px-4 relative cursor-pointer bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-100' }
      >
        { column.header }
      </div>
      <div
        style={ { width: 8} }
        className={ 'cursor-ew-resize group py-4 bg-gray-50' }
      >
        <div className={ 'w-0.5 h-full mx-auto bg-gray-200 group-hover:bg-gray-300 group-active:bg-blue-600' }/>
      </div>
    </div>
  );
};