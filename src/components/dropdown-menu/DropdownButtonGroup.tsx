import * as React from "react";

export type DropdownButtonGroupProps = {
  label?: string;
  children: React.ReactNode;
}

export const DropdownButtonGroup = (props: DropdownButtonGroupProps) => {
  const { label, children } = props;
  return (
    <div className={'flex flex-col dropdown-button-group'}>
      { label && <div className={'mb-2 text-sm text-gray-500 font-semibold px-1'}>{ label }</div> }
      { children }
    </div>
  );
};