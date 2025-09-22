import { Table } from "@/table/Table.tsx";
import { ButtonIconSquare } from "@/components/button-icon-square/ButtonIconSquare.tsx";
import { IconMailFilled, IconSearch, IconSettings } from "@tabler/icons-react";
import { Input } from "@/components/inputs/Input.tsx";
import { Badge } from "@/components/Badge.tsx";
import { useState } from "react";
import { usePopover } from "@/popover/use-popover.tsx";
import { PopoverPanel } from "@/popover/PopoverPanel.tsx";
import { InputSelect } from "@/components/inputs/InputSelect.tsx";
import { PopoverButton } from "@/popover/PopoverButton.tsx";

type SampleRowType = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  status: 'active' | 'inactive';
}

const sampleData: SampleRowType[] = [
  { id: 1, email: 'matthiaskrijgsman@gmail.com', firstname: 'Matthias', lastname: 'Krijgsman', status: 'active' },
  { id: 2, email: 'dennis@snijder.io', firstname: 'Dennis', lastname: 'Snijder', status: 'inactive' },
  { id: 3, email: 'arcokrijgsman@gmail.com', firstname: 'Arco', lastname: 'Krijgsman', status: 'active' },
];

const sampleColumns = [
  { id: 'id', header: 'ID', renderCell: (row: SampleRowType) => row.id },
  {
    id: 'email', header: 'Email', renderCell: (row: SampleRowType) => {
      return <Badge Icon={ IconMailFilled } onClick={ () => {
      } }>{ row.email }</Badge>
    }
  },
  { id: 'firstname', header: 'First Name', renderCell: (row: SampleRowType) => row.firstname },
  { id: 'lastname', header: 'Last Name', renderCell: (row: SampleRowType) => row.lastname },
  {
    id: 'status', header: 'Status', renderCell: (row: SampleRowType) => <BadgePopover/>
  },
];


export const Test = () => {
  return (
    <div className={ 'flex flex-col gap-6' }>
      <div className={ 'flex flex-row items-center justify-start gap-3' }>
        <Input Icon={ IconSearch } placeholder={ 'Search...' }/>
        <ButtonIconSquare Icon={ IconSettings }/>
      </div>
      <Table
        columns={ sampleColumns }
        rows={ sampleData }
      />
      <InputSelect options={ [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 }
      ] } value={ null } onChange={ () => {
      } }/>
    </div>
  );
};

const BadgePopover = () => {
  const [ open, setOpen ] = useState(false);
  const { Popover, anchorRef } = usePopover({
    fullWidth: true,
    onOutsideClick: () => setOpen(false),
    minWidth: 150
  })

  return (<>
    <Badge onClick={ () => setOpen(true) } ref={ anchorRef }>Test</Badge>

    <Popover open={ open }>
      <PopoverPanel>
        <PopoverButton>Option 1</PopoverButton>
        <PopoverButton>Option 2</PopoverButton>
        <PopoverButton>Option 3</PopoverButton>
      </PopoverPanel>
    </Popover>
  </>)
}