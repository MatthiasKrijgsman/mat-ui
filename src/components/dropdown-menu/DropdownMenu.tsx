import * as React from "react";
import { useState } from "react";
import { usePopover } from "@/popover/use-popover.tsx";
import { FloatingTree, type Placement, useFloatingParentNodeId } from "@floating-ui/react";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";
import { DropdownDismissContext } from "@/components/dropdown-menu/use-dropdown-dismiss.ts";
import { DropdownNavigator } from "@/components/dropdown-menu/DropdownNavigator.tsx";

export type DropdownMenuProps = {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  placement?: Placement
  minWidth?: number;
  className?: string;
}


const DropdownMenuInner = (props: DropdownMenuProps) => {
  const { trigger, children, placement = 'bottom-end', minWidth = 200, className } = props;
  const [ show, setShow ] = useState<boolean>(false);

  const { Popover, anchorRef } = usePopover({
    placement: placement,
    open: show,
    onOpenChange: setShow,
    minWidth: minWidth,
  })

  return (
    <>
      <div ref={ anchorRef } className={ className } onClick={ () => setShow(!show) }>
        { trigger }
      </div>

      <Popover open={ show }>
        <DropdownPanel className={ '!p-0' }>
          <DropdownDismissContext.Provider value={ () => setShow(false) }>
            <DropdownNavigator open={ show }>
              { children }
            </DropdownNavigator>
          </DropdownDismissContext.Provider>
        </DropdownPanel>
      </Popover>
    </>
  );
};

export const DropdownMenu = (props: DropdownMenuProps) => {
  // Establish a FloatingTree at the root so nested submenu popovers can
  // communicate (outside-press/dismiss ignore descendant floating elements).
  // If this menu is itself nested inside another menu's tree, reuse that tree.
  const parentNodeId = useFloatingParentNodeId();

  if (parentNodeId === null) {
    return (
      <FloatingTree>
        <DropdownMenuInner { ...props }/>
      </FloatingTree>
    );
  }

  return <DropdownMenuInner { ...props }/>;
};