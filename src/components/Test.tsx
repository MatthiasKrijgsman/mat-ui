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
  { id: 1, email: 'sarah.jennings@example.com', firstname: 'Sarah', lastname: 'Jennings', status: 'active' },
  { id: 2, email: 'liam.patel@outlook.com', firstname: 'Liam', lastname: 'Patel', status: 'inactive' },
  { id: 3, email: 'emily.wong@gmail.com', firstname: 'Emily', lastname: 'Wong', status: 'active' },
  { id: 4, email: 'noah.thompson@yahoo.com', firstname: 'Noah', lastname: 'Thompson', status: 'active' },
  { id: 5, email: 'isabella.martin@protonmail.com', firstname: 'Isabella', lastname: 'Martin', status: 'active' },
  { id: 6, email: 'ethan.ross@company.io', firstname: 'Ethan', lastname: 'Ross', status: 'inactive' },
  { id: 7, email: 'olivia.nguyen@example.org', firstname: 'Olivia', lastname: 'Nguyen', status: 'active' },
  { id: 8, email: 'lucas.henderson@gmail.com', firstname: 'Lucas', lastname: 'Henderson', status: 'inactive' },
  { id: 9, email: 'mia.johnson@workmail.com', firstname: 'Mia', lastname: 'Johnson', status: 'active' },
  { id: 10, email: 'jackson.rivera@outlook.com', firstname: 'Jackson', lastname: 'Rivera', status: 'active' },
  { id: 11, email: 'ava.sanders@example.com', firstname: 'Ava', lastname: 'Sanders', status: 'active' },
  { id: 12, email: 'logan.bennett@company.io', firstname: 'Logan', lastname: 'Bennett', status: 'inactive' },
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
        className={'h-[300px] w-[300px]'}
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