import { useState } from "react";
import { ButtonIconSquare } from "@/ButtonIconSquare.tsx";
import { IconChevronDown } from "@tabler/icons-react";
import { usePopover } from "@/hooks/use-popover.tsx";

export const Test = () => {
  const [ open, setOpen ] = useState(false);

  const { anchorRef, renderPopover } = usePopover({
    open,
    placement: 'bottom-start',
  });

  return (<>
    <ButtonIconSquare
      Icon={ IconChevronDown }
      onClick={ () => setOpen(!open) }
      ref={ anchorRef }
    />
    {renderPopover(<div className={'bg-black text-white text-lg p-6'}>Yay</div>)}
  </>);
};