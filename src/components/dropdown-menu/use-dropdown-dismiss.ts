import { createContext, useContext } from "react";

export type DropdownDismissContextType = () => void;

export const DropdownDismissContext = createContext<DropdownDismissContextType | undefined>(undefined);

export const useDropdownDismiss = () => {
  const dropdownDismissContext = useContext(DropdownDismissContext)
  return {
    dismiss: dropdownDismissContext || (() => {})
  }
}