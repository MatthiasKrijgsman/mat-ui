import { useState } from "react";
import { Button, Modal } from "../../src";

export const ModalDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="white" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onDismiss={() => setOpen(false)} enableDismissOnOutsideClick enableDismissOnEscKey enableDismissButton>
        <div className={'flex flex-col gap-4'}>
          <div className={'text-[1.41rem] font-bold text-gray-900'}>Modal title</div>
          <div className={'text-gray-500'}>This is a modal dialog. Click the X button, press Escape, or click outside to dismiss.</div>
          <div className={'flex flex-row gap-3 justify-end'}>
            <Button className={'flex-1'} variant="white" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className={'flex-1'} variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};