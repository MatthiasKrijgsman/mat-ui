import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";


export type PanelFieldOrientation = 'vertical' | 'horizontal';

export type PanelFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string | React.ReactNode;
  children?: React.ReactNode;
  orientation?: PanelFieldOrientation;
}

const labelClasses: string = 'input-description mat:text-[length:var(--font-size-description)] mat:font-[number:var(--font-weight-panel-field)]';

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
          'mat:flex mat:flex-row mat:items-center mat:gap-3 mat:px-3 mat:py-2',
          className
        ) }
        { ...rest }
      >
        <div className={ classNames(labelClasses, 'mat:w-1/2 mat:line-clamp-1 mat:break-all') }>{ label }</div>
        <div className={ 'mat:w-1/2 mat:line-clamp-1 mat:break-all' }>{ children }</div>
      </div>
    );
  }

  return (
    <div
      className={ classNames(
        'mat:flex mat:flex-col mat:gap-1 mat:px-3 mat:py-2',
        className
      ) }
      { ...rest }
    >
      { label && <div className={ labelClasses }>{ label }</div> }
      <div>{ children }</div>
    </div>
  );
};
