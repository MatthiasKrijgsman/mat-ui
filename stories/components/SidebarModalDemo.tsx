import { useState } from "react";
import { Button, SidebarModal, Divider, Input, InputTextArea } from "../../src";

export const SidebarModalDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="white" onClick={() => setOpen(true)}>Open sidebar</Button>
      <SidebarModal open={open} onDismiss={() => setOpen(false)} enableDismissOnOutsideClick enableDismissOnEscKey enableDismissButton>
        <div className={'flex flex-col gap-6'}>
          <div className={'flex flex-col gap-1'}>
            <div className={'text-[1.41rem] font-bold text-gray-900'}>Sidebar Modal</div>
            <div className={'text-gray-500'}>This sidebar slides in from the right. Click the X button, press Escape, or click outside to dismiss.</div>
          </div>
          <Divider />
          <div className={'flex flex-col gap-4'}>
            <Input label="Name" placeholder="Enter name..." />
            <Input label="Email" placeholder="Enter email..." />
            <InputTextArea label="Message" placeholder="Enter message..." />
          </div>
          <Divider />
          <div className={'flex flex-row gap-3 justify-end'}>
            <Button variant="white" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
          </div>
        </div>
      </SidebarModal>
    </>
  );
};
