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
    <div className={ classNames('mat:flex mat:flex-col dropdown-button-group', className) }>
      { label && <div className={ 'mat:mb-2 mat:text-[length:var(--font-size-label)] dropdown-group-label mat:font-[number:var(--font-weight-group-header)] mat:px-3' }>{ label }</div> }
      { children }
    </div>
  );
};