import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconCheck } from "@tabler/icons-react";

export interface InputSelectOptionProps {
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
        'option-base px-4 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none flex flex-row gap-3 items-center',
        (selected && !disabled) && 'option-selected',
        disabled && 'option-disabled cursor-not-allowed hover:bg-transparent active:bg-transparent',
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
