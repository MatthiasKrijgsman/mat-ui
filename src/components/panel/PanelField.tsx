import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";


export type PanelFieldOrientation = 'vertical' | 'horizontal';

export type PanelFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string | React.ReactNode;
  children?: React.ReactNode;
  orientation?: PanelFieldOrientation;
}

const labelClasses: string = 'input-description text-sm font-medium';

export const PanelField = (props: PanelFieldProps) => {

  const {
    className,
    label,
    children,
    orientation = 'vertical',
    ...rest
  } = props;

  if (orientation === 'horizontal') {
    return (
      <div
        className={ classNames(
          'flex flex-row items-center gap-3 px-3 py-2',
          className
        ) }
        { ...rest }
      >
        <div className={ classNames(labelClasses, 'w-1/2 line-clamp-1 break-all') }>{ label }</div>
        <div className={ 'w-1/2 line-clamp-1 break-all' }>{ children }</div>
      </div>
    );
  }

  return (
    <div
      className={ classNames(
        'flex flex-col gap-1 px-3 py-2',
        className
      ) }
      { ...rest }
    >
      { label && <div className={ labelClasses }>{ label }</div> }
      <div>{ children }</div>
    </div>
  );
};
