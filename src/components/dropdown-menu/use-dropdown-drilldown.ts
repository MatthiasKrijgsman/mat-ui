import { createContext, useContext } from "react";
import type * as React from "react";
import type { TablerIcon } from "@tabler/icons-react";

export type DropdownDrilldownLevel = {
  id: string;
  label: React.ReactNode;
  Icon?: TablerIcon;
  content: React.ReactNode;
}

export type DropdownDrilldownContextType = {
  push: (level: DropdownDrilldownLevel) => void;
  pop: () => void;
  reset: () => void;
  depth: number;
}

export const DropdownDrilldownContext = createContext<DropdownDrilldownContextType | undefined>(undefined);

export const useDropdownDrilldown = () => {
  const context = useContext(DropdownDrilldownContext);
  return context ?? {
    push: () => {},
    pop: () => {},
    reset: () => {},
    depth: 0,
  };
}
