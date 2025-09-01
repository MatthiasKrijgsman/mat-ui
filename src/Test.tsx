import { useState } from "react";
import { ButtonIconSquare } from "@/ButtonIconSquare.tsx";
import { IconChevronDown } from "@tabler/icons-react";
import { usePopover } from "@/popover/use-popover.tsx";
import { PopoverPanel } from "@/popover/PopoverPanel.tsx";

export const Test = () => {
  const [ open, setOpen ] = useState(false);

  const { anchorRef, Popover } = usePopover({
    placement: 'bottom-start',
    onOutsideClick: () => setOpen(false),
    minWidth: 150
  });

  return (<>
    <ButtonIconSquare
      Icon={ IconChevronDown }
      onClick={ () => setOpen(!open) }
      ref={ anchorRef }
    />
    <Popover open={ open }>
      <PopoverPanel>
        Yay
      </PopoverPanel>
    </Popover>
  </>);
};