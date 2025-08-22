import * as React from "react";

export interface ButtonProps {
  children?: React.ReactNode;
}

export const Button = (props: ButtonProps) => {

  const { children } = props;

  return (
    <button className={'font-semibold bg-amber-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-all ring-0 hover:ring-4 active:ring-2 hover:bg-amber-700 active:bg-amber-800 ring-amber-200 duration-150'}>{ children }</button>
  );
};