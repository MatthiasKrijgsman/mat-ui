'use client'

import React from "react";
import { classNames } from "../../../src/util/classnames.util";

interface ShowcaseSectionProps {
  title: string;
  children?: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
}

export const ShowcaseSection = (props: ShowcaseSectionProps) => {
  const { title, children, layout = 'horizontal' } = props;

  return (
    <div className={ 'flex flex-col gap-3' }>
      <div className={ 'text-sm text-stone-400' }>{ title }</div>
      <div className={ classNames(
        'flex gap-3',
        layout === 'horizontal' && 'flex-row items-center',
        layout === 'vertical' && 'flex-col items-start',
      ) }>
        { children }
      </div>
    </div>
  );
};