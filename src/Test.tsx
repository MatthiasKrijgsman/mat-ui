import { useState } from "react";
import { ButtonIconSquare } from "@/ButtonIconSquare.tsx";
import { IconChevronDown } from "@tabler/icons-react";
import { usePopover } from "@/hooks/use-popover.tsx";

export const Test = () => {
  const [ open, setOpen ] = useState(false);

  const { anchorRef, PopoverBase } = usePopover({
    placement: 'bottom-start',
    onOutsideClick: () => setOpen(false),
  });

  return (<>
    <ButtonIconSquare
      Icon={ IconChevronDown }
      onClick={ () => setOpen(!open) }
      ref={ anchorRef }
    />
    <PopoverBase open={ open }>
      <div className={'bg-black text-white text-lg p-6 w-full'}>Yay</div>
    </PopoverBase>
  </>);
};