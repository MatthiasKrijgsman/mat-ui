import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

export type DropdownButtonGroupProps = {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const DropdownButtonGroup = (props: DropdownButtonGroupProps) => {
  const { label, children, className } = props;
  return (
    <div className={ classNames('flex flex-col dropdown-button-group', className) }>
      { label && <div className={ 'mb-2 text-sm text-gray-500 font-semibold px-1' }>{ label }</div> }
      { children }
    </div>
  );
};