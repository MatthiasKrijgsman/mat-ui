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
    <label className={ 'input-label font-medium mb-1' }>{ children }</label>
  );
};