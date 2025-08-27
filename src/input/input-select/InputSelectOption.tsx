import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

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
        'hover:bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none',
        (selected && !disabled) && 'bg-blue-100 hover:bg-blue-100 active:bg-blue-100',
        disabled && 'text-gray-400 cursor-not-allowed hover:bg-transparent active:bg-transparent',
      )}
    >
      { children }
    </div>
  );
};