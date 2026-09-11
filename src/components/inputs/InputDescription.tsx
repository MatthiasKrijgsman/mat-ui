import * as React from "react";

export type InputDescriptionProps = {
  children?: React.ReactNode;
}

export const InputDescription = (props: InputDescriptionProps) => {
  const {
    children
  } = props;

  if (!children) {
    return null;
  }

  return (
    <div className={ 'input-description mat:text-[length:var(--font-size-description)] mat:font-[number:var(--font-weight-input-description)] mat:mt-2' }>{ children }</div>
  );
};