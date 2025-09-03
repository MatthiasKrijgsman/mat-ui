import { useState } from "react";
import { ButtonIconSquare } from "@/ButtonIconSquare.tsx";
import { IconEye } from "@tabler/icons-react";
import { Modal } from "@/Modal.tsx";

export const Test = () => {

  const [ open, setOpen ] = useState(false);

  return (<>
    <ButtonIconSquare
      Icon={ IconEye }
      onClick={ () => setOpen(true) }
    />
    <Modal
      open={ open }
      onOutsideClick={() => setOpen(false)}
      onClose={() => setOpen(false)}
      className={'gap-3'}
    >
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </Modal>
  </>);
};