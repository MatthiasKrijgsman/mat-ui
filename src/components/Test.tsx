import { Table } from "@/table/Table.tsx";
import { ButtonIconSquare } from "@/components/button-icon-square/ButtonIconSquare.tsx";
import { IconMailFilled, IconPlus, IconSearch, IconSettings, IconTrash } from "@tabler/icons-react";
import { Input } from "@/components/inputs/Input.tsx";
import { Badge } from "@/components/Badge.tsx";
import { InputSelect } from "@/components/inputs/InputSelect.tsx";
import { DropdownButton } from "@/components/dropdown-menu/DropdownButton.tsx";
import { Button } from "@/components/button/Button.tsx";
import { DropdownMenu } from "@/components/dropdown-menu/DropdownMenu.tsx";
import { ScrollbarTest } from "@/components/ScrollbarTest.tsx";

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
    id: 'status', header: 'Status', renderCell: () => <BadgePopover/>
  },
];


export const Test = () => {
  return (
    <div className={ 'flex flex-col gap-6' }>
      <div className={ 'flex flex-row items-center justify-start gap-3' }>
        <Input Icon={ IconSearch } placeholder={ 'Search...' }/>
        <ButtonIconSquare Icon={ IconSettings }/>
        <Button Icon={ IconPlus }>New</Button>
        <DropdownMenu
          trigger={ <ButtonIconSquare Icon={ IconSettings }/> }
        >
          <DropdownButton dismissOnClick={ false } Icon={ IconPlus }>Add new</DropdownButton>
          <DropdownButton Icon={ IconTrash }>Remove</DropdownButton>
        </DropdownMenu>
      </div>

      <InputSelect options={ [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 }
      ] } value={ null } onChange={ () => {
      } }/>

      <Table
        columns={ sampleColumns }
        rows={ sampleData }
      />

      <ScrollbarTest/>
    </div>
  );
};

const BadgePopover = () => {
  return (<>

    <DropdownMenu
      placement={ 'bottom-end' }
      className={ 'inline-block' }
      trigger={
        <Badge onClick={ () => {
        } }>Test</Badge>
      }
    >
      <DropdownButton>Option 1</DropdownButton>
      <DropdownButton>Option 2</DropdownButton>
      <DropdownButton>Option 3</DropdownButton>
    </DropdownMenu>
  </>)
}