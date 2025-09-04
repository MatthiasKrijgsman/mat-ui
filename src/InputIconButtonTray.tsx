import * as React from "react";

export type InputIconButtonTrayProps = {
  children?: React.ReactNode;
}

export const InputIconButtonTray = (props: InputIconButtonTrayProps) => {
  const {
    children
  } = props;
  return (
    <div className={ 'absolute top-1/2 -translate-y-1/2 right-3.5 flex flex-row items-center gap-1' }>
      { children }
    </div>
  );
};