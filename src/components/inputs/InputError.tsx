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
    <div className={ 'input-error-text mat:text-[length:var(--font-size-error)] mat:font-[number:var(--font-weight-input-error)] mat:mt-2' }>{ children }</div>
  );
};