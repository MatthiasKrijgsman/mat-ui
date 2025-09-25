import * as React from "react";
import { useState } from "react";
import { usePopover } from "@/popover/use-popover.tsx";
import type { Placement } from "@floating-ui/react";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { DropdownDismissContext } from "@/components/dropdown-menu/use-dropdown-dismiss.ts";

export type DropdownMenuProps = {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  placement?: Placement
  minWidth?: number;
}


export const DropdownMenu = (props: DropdownMenuProps) => {
  const { trigger, children, placement = 'bottom-end', minWidth = 200 } = props;
  const [ show, setShow ] = useState<boolean>(false);

  const { Popover, anchorRef } = usePopover({
    placement: placement,
    onOutsideClick: () => setShow(false),
    minWidth: minWidth,
  })

  return (
    <>
      <div ref={ anchorRef } onClick={ () => setShow(!show) }>
        { trigger }
      </div>

      <Popover open={ show }>
        <DropdownPanel padding={ 'sm' }>
          <DropdownDismissContext.Provider value={ () => setShow(false) }>
            { children }
          </DropdownDismissContext.Provider>
        </DropdownPanel>
      </Popover>
    </>
  );
};