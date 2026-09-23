import * as React from "react";

export type InputLabelProps = {
  children?: React.ReactNode;
  htmlFor?: string;
}

export const InputLabel = (props: InputLabelProps) => {
  const {
    children,
    htmlFor,
  } = props;

  if (!children) {
    return null;
  }

  return (
    <label htmlFor={ htmlFor } className={ 'input-label mat:font-[number:var(--font-weight-input-label)] mat:mb-1' }>{ children }</label>
  );
};