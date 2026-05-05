import { createContext, useContext } from "react";
import type { ControlSize } from "@/control-size/control-size.util.ts";

export const ControlSizeContext = createContext<ControlSize>('md');

export const useControlSize = (): ControlSize => useContext(ControlSizeContext);
