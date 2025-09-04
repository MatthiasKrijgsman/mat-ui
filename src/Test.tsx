import { useState } from "react";
import { InputSelect } from "@/InputSelect.tsx";
import { InputSelectSearchable } from "@/InputSelectSearchable.tsx";
import { InputSelectSearchableAsync } from "@/InputSelectSearchableAsync.tsx";
import { InputSelectNative } from "@/InputSelectNative.tsx";

type Option<T> = {
  label: string;
  value: T;
}

const options: Option<string>[] = [
  { label: 'Matthias Krijgsman', value: 'matthias-krijgsman' },
  { label: 'Dennis Snijder', value: 'dennis-snijder' },
  { label: 'Arco Krijgsman', value: 'arco-krijgsman' },
  { label: 'Gerwin Krijgsman', value: 'gerwin-krijgsman' },
  { label: 'Jonathan Krijgsman', value: 'jonathan-krijgsman' },
  { label: 'Theo Krijgsman', value: 'theo-krijgsman' },
  { label: 'Danny Mostert', value: 'danny-mostert' },
  { label: 'Joeri Hackmann', value: 'joeri-hackmann' },
  { label: 'Martijn Lammers', value: 'martijn-lammers' },
]

const handleOnSearch = (search: string) => {
  return options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()));
}

const handleFetchOptionsByQuery = async (query: string) => {
  return new Promise<Option<string>[]>(resolve => {
    setTimeout(() => {
      resolve(options.filter(option => option.label.toLowerCase().includes(query.toLowerCase())));
    }, 1000);
  });
}

const handleFetchOptionByValue = async (value: string) => {
  return new Promise<Option<string>>(resolve => {
    setTimeout(() => {
      const option = options.find(option => option.value === value) || null;
      resolve(option);
    }, 1000);
  });
}

export const Test = () => {

  const [ option1, setOption1 ] = useState<string>('');
  const [ option2, setOption2 ] = useState<string | null>(null);
  const [ option3, setOption3 ] = useState<string | null>('matthias-krijgsman');

  return (
    <div className={ 'flex flex-col gap-4' }>
      <InputSelectNative
        options={ options }
        value={ option1 }
        onChange={ o => setOption1(o.target.value) }
        label={ 'InputSelect' }
      />
      <InputSelectSearchable
        options={ options }
        value={ option2 }
        onChange={ o => setOption2(o) }
        label={ 'InputSelect Search' }
        onSearch={ handleOnSearch }
      />
      <InputSelectSearchableAsync
        value={ option3 }
        onChange={ o => setOption3(o) }
        label={ 'InputSelect Search (Async)' }
        fetchOptionsByQuery={ handleFetchOptionsByQuery }
        fetchOptionByValue={ handleFetchOptionByValue }
      />
    </div>
  );
};