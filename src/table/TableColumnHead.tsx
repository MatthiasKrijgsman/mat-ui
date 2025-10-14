import type { TableColumnDef } from "@/table/Table.tsx";
import { useDragX } from "@/hooks/use-drag-x.ts";

export type TableColumnHeadProps<T> = {
  column: TableColumnDef<T>;
}

export const TableColumnHead = <T, >(props: TableColumnHeadProps<T>) => {
  const {
    column
  } = props;

  const width = column?.defaultWidth ?? 250;

  const { bind } = useDragX({
    onDelta: (dx) => console.log(dx),
    onDragStart: () => {/* optional */
    },
    onDragEnd: () => {/* optional */
    },
  });

  return (
    <div
      style={ { width: width, height: 44 } }
      className={ 'flex flex-row items-stretch select-none' }
    >
      <div
        className={ 'flex-1 content-center px-4 relative cursor-pointer bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-100' }
      >
        { column.header }
      </div>
      <div
        { ...bind }
        className={ 'cursor-ew-resize group py-4 bg-gray-50 w-[8px]' }
      >
        <div
          className={ 'w-0.5 h-full mx-auto bg-gray-200 group-hover:bg-gray-300 group-active:bg-blue-600 pointer-events-none' }/>
      </div>
    </div>
  );
};