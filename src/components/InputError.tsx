import * as React from "react";

export type InputErrorProps = {
  children?: React.ReactNode;
}

export const InputError = (props: InputErrorProps) => {
  const {
    children
  } = props;

  if (!children) {
    return null;
  }

  return (
    <div className={ 'text-red-600 text-sm font-medium mt-2' }>{ children }</div>
  );
};