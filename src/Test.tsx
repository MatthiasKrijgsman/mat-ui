import { InputSelectSearchable } from "@/InputSelectSearchable.tsx";
import { useState } from "react";

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
  { label: 'Option 6', value: 'option6' },
  { label: 'Option 7', value: 'option7' },
  { label: 'Option 8', value: 'option8' },
  { label: 'Option 9', value: 'option9' },
  { label: 'Option 10', value: 'option10' },
]

export const Test = () => {
  const [ selected, setSelected ] = useState<string | null>(null);
  return (
    <InputSelectSearchable
      onSearch={(search, options) => {
        return options.filter(option => option.value.toLowerCase().includes(search.toLowerCase()));
      }}
      placeholder={'- Select -'}
      options={ options }
      value={ selected }
      onChange={ option => setSelected(option) }
      maxHeight={ 400 }
    />
  );
};