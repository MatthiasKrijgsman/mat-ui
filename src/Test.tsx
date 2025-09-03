import { Panel } from "@/Panel.tsx";
import { InputSelectSearchableAsync } from "@/InputSelectSearchableAsync.tsx";
import { useState } from "react";

const options = [
  { label: 'Matthias Krijgsman', value: 'matthias' },
  { label: 'Dennis Snijder', value: 'dennis' },
  { label: 'Arco Krijgsman', value: 'arco' },
]


const fetchOptions = async (search: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return options.filter((option) => option.label.toLowerCase().indexOf(search.toLowerCase()) > -1);
}

export const Test = () => {

  const [ value, setValue ] = useState();

  return (
    <Panel className={ 'h-[500px]' }>
      <InputSelectSearchableAsync
        options={ options }
        onSearch={ fetchOptions}
        value={ value }
        onChange={ (option) => setValue(option) }/>
    </Panel>
  );
};