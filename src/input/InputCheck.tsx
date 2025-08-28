import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";

interface InputCheckProps extends React.HTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

export const InputCheck = (props: InputCheckProps) => {
  const {
    className,
    children,
    ...rest
  } = props;
  return (
    <div>
      <input
        type={ 'checkbox' }
        className={ 'h-6 w-6 rounded-lg' }
        { ...rest }
      />
    </div>
  );
};