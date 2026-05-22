import * as React from "react";

export type Option<T> = {
  label: string | React.ReactNode;
  value: T;
  disabled?: boolean;
}

export type SelectGroupHeader = {
  kind: 'header';
  label: string | React.ReactNode;
}

export type SelectDivider = {
  kind: 'divider';
}

export type SelectItem<T> = Option<T> | SelectGroupHeader | SelectDivider;

export const isSelectOption = <T, >(item: SelectItem<T>): item is Option<T> => !('kind' in item);
