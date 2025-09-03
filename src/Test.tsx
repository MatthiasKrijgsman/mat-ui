import { ButtonIconSquare } from "@/ButtonIconSquare.tsx";
import { IconEye } from "@tabler/icons-react";
import { Button } from "@/Button.tsx";
import { TabButtons } from "@/TabButtons.tsx";
import { Badge } from "@/Badge.tsx";

export const Test = () => {

  return (
    <div className={ 'flex flex-col gap-3' }>
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
      <div className={ 'space-x-2 space-y-2' }>
        <Badge onClick={ () => {} } color={ 'red' }>Red</Badge>
        <Badge onClick={ () => {} } color={ 'orange' }>Orange</Badge>
        <Badge onClick={ () => {} } color={ 'amber' }>Amber</Badge>
        <Badge onClick={ () => {} } color={ 'yellow' }>Yellow</Badge>
        <Badge onClick={ () => {} } color={ 'lime' }>Lime</Badge>
        <Badge onClick={ () => {} } color={ 'green' }>Green</Badge>
        <Badge onClick={ () => {} } color={ 'emerald' }>Emerald</Badge>
        <Badge onClick={ () => {} } color={ 'teal' }>Teal</Badge>
        <Badge onClick={ () => {} } color={ 'cyan' }>Cyan</Badge>
        <Badge onClick={ () => {} } color={ 'sky' }>Sky</Badge>
        <Badge onClick={ () => {} } color={ 'blue' }>Blue</Badge>
        <Badge onClick={ () => {} } color={ 'indigo' }>Indigo</Badge>
        <Badge onClick={ () => {} } color={ 'violet' }>Violet</Badge>
        <Badge onClick={ () => {} } color={ 'purple' }>Purple</Badge>
        <Badge onClick={ () => {} } color={ 'fuchsia' }>Fuchsia</Badge>
        <Badge onClick={ () => {} } color={ 'pink' }>Pink</Badge>
        <Badge onClick={ () => {} } color={ 'rose' }>Rose</Badge>
        <Badge onClick={ () => {} } color={ 'slate' }>Slate</Badge>
        <Badge onClick={ () => {} } color={ 'gray' }>Gray</Badge>
        <Badge onClick={ () => {} } color={ 'zinc' }>Zinc</Badge>
        <Badge onClick={ () => {} } color={ 'neutral' }>Neutral</Badge>
        <Badge onClick={ () => {} } color={ 'stone' }>Stone</Badge>
        <Badge onClick={ () => {} } color={ 'white' }>White</Badge>
        <Badge onClick={ () => {} } color={ 'black' }>Black</Badge>
      </div>
    </div>
  );
};