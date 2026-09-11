import * as React from "react";

export type InputLabelProps = {
  children?: React.ReactNode;
}

export const InputLabel = (props: InputLabelProps) => {
  const {
    children
  } = props;

  if (!children) {
    return null;
  }

  return (
    <label className={ 'input-label mat:font-[number:var(--font-weight-input-label)] mat:mb-1' }>{ children }</label>
  );
};