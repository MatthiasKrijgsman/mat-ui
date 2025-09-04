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
    <div className={ 'text-gray-500 text-sm font-medium mt-2' }>{ children }</div>
  );
};