import { ButtonIconSquare } from "@/ButtonIconSquare.tsx";
import { IconEye } from "@tabler/icons-react";
import { Button } from "@/Button.tsx";
import { TabButtons } from "@/TabButtons.tsx";

export const Test = () => {

  return (
    <div className={ 'flex flex-row gap-3' }>
      <ButtonIconSquare
        Icon={ IconEye }
      />
      <Button>
        Test
      </Button>
      <TabButtons
        tabs={ [
          { label: 'Tab 1', active: true, onClick: () => console.log('Tab 1 clicked') },
          { label: 'Tab 2', href: 'https://google.com' },
          { label: 'Tab 3', onClick: () => console.log('Tab 3 clicked') },
          { label: 'Tab 4', onClick: () => console.log('Tab 4 clicked') },
        ] }
      />
    </div>
  );
};