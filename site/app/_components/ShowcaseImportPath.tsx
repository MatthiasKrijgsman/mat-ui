'use client'

import React from "react";

interface ShowcaseImportPathProps {
  path: string;
}

export const ShowcaseImportPath = (props: ShowcaseImportPathProps) => {
  const { path } = props;

  return (
    <div className={ 'text-stone-400 font-mono' }>{ path }</div>
  );
};