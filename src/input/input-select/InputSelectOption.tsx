import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconCheck } from "@tabler/icons-react";

interface InputSelectOptionProps {
  children: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const InputSelectOption = (props: InputSelectOptionProps) => {
  const {
    children,
    onClick,
    selected,
    disabled = false,
  } = props;

  return (
    <div
      onClick={ () => !disabled && onClick && onClick() }
      className={classNames(
        'hover:bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none flex flex-row gap-3 items-center',
        (selected && !disabled) && 'bg-blue-50 hover:bg-blue-100 active:bg-blue-100',
        disabled && 'text-gray-400 cursor-not-allowed hover:bg-transparent active:bg-transparent',
      )}
    >
      <div className={'flex-1'}>{ children }</div>
      { (selected && !disabled) && (
        <div className={'shrink-0'}>
          <IconCheck className={'h-5 w-5'} />
        </div>
      ) }
    </div>
  );
};