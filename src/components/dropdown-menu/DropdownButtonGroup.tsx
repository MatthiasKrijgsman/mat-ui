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
      { label && <div className={ 'mb-2 text-sm dropdown-group-label font-semibold px-3' }>{ label }</div> }
      { children }
    </div>
  );
};