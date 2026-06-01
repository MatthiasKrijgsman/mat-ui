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

/**
 * Compares two option values for selection/membership purposes.
 *
 * Primitives (string, number, boolean, …) are compared by strict equality, so
 * behaviour is identical to `===` for the common case. Object-valued options
 * fall back to a structural (JSON) comparison, so a value rehydrated from
 * persisted state — a fresh object instance that is structurally equal — still
 * matches its option instead of silently falling back to the placeholder.
 *
 * Note: the structural comparison is order-sensitive on object keys.
 */
export const selectValueEquals = <T, >(a: T | null | undefined, b: T | null | undefined): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  return JSON.stringify(a) === JSON.stringify(b);
};
