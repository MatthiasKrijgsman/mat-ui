export type InputVariant = 'default' | 'flat';

/* Box chrome per variant, shared by every field-like input. `default` keeps
 * the control shadow; `flat` drops it and swaps in the soft fill whose border
 * matches the background (see --color-input-flat-*). */
export const inputVariantClasses: Record<InputVariant, string> = {
  default: 'shadow-[var(--shadow-control)]',
  flat: 'input-flat',
};

export const selectTriggerVariantClasses: Record<InputVariant, string> = {
  default: 'shadow-[var(--shadow-control)]',
  flat: 'select-trigger-flat',
};
