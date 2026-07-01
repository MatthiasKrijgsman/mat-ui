import * as React from "react";
import { useState } from "react";
import { IconChevronRight, type TablerIcon } from "@tabler/icons-react";
import { usePopover } from "@/popover/use-popover.tsx";
import { DropdownButton } from "@/components/dropdown-menu/DropdownButton.tsx";
import { DropdownPanel } from "@/components/dropdown-menu/DropdownPanel.tsx";

export type DropdownSubMenuProps = {
  label: React.ReactNode;
  Icon?: TablerIcon;
  children?: React.ReactNode;
  className?: string;
  minWidth?: number;
}

export const DropdownSubMenu = (props: DropdownSubMenuProps) => {
  const { label, Icon, children, className, minWidth = 200 } = props;
  const [ open, setOpen ] = useState<boolean>(false);

  const { Popover, anchorRef } = usePopover({
    placement: 'right-start',
    open: open,
    onOpenChange: setOpen,
    minWidth: minWidth,
    offset: 4,
  });

  return (
    <>
      <div ref={ anchorRef }>
        <DropdownButton
          dismissOnClick={ false }
          Icon={ Icon }
          onClick={ () => setOpen((prev) => !prev) }
          className={ className }
        >
          <span className={ 'flex-1 text-left' }>{ label }</span>
          <IconChevronRight className={ 'h-5 w-5 shrink-0 -mr-1 opacity-60' }/>
        </DropdownButton>
      </div>

      <Popover open={ open }>
        <DropdownPanel padding={ 'sm' } style={ { marginTop: 0 } }>
          { children }
        </DropdownPanel>
      </Popover>
    </>
  );
};
