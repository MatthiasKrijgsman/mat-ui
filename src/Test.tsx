import { Input } from "@/Input.tsx";
import { Table } from "@/table/Table.tsx";

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
  { id: 'email', header: 'Email', renderCell: (row: SampleRowType) => row.email },
  { id: 'firstname', header: 'First Name', renderCell: (row: SampleRowType) => row.firstname },
  { id: 'lastname', header: 'Last Name', renderCell: (row: SampleRowType) => row.lastname },
  { id: 'status', header: 'Status', renderCell: (row: SampleRowType) => row.status },
];

export const Test = () => {
  return (
    <div className={ 'flex flex-col gap-12' }>
      <Input type={ 'text' } label={ 'Label' } description={ 'Description' } placeholder={ 'Enter something' }/>
      <Table
        columns={ sampleColumns }
        rows={ sampleData }
      />
    </div>
  );
};