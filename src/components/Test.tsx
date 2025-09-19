import { Input } from "@/components/inputs/Input.tsx";
import { Button } from "@/components/button/Button.tsx";
import { IconMailFilled } from "@tabler/icons-react";
import { InputPassword } from "@/components/inputs/InputPassword.tsx";
import { InputSelectNative } from "@/components/inputs/InputSelectNative.tsx";
import { InputSelect } from "@/components/inputs/InputSelect.tsx";
import { InputSelectSearchable } from "@/components/inputs/InputSelectSearchable.tsx";


export const Test = () => {
  const searchableSelectOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Option 4', value: '4' },
    { label: 'Option 5', value: '5' },
    { label: 'Option 6', value: '6' },
    { label: 'Option 7', value: '7' },
    { label: 'Option 8', value: '8' },
    { label: 'Option 9', value: '9' },
    { label: 'Option 10', value: '10' },
  ];
  return (
    <div className={ 'flex flex-col gap-6' }>
      <div className={ 'flex flex-col gap-6 mx-auto w-[500px]' }>
        <Button variant={ 'primary' } disabled={ false }>Test</Button>
        <Button variant={ 'primary' } disabled={ true }>Test</Button>
        <Button variant={ 'primary' } disabled={ true }>Test</Button>
        <Button variant={ 'primary' } size={ 'sm' } loading={ true }>Test</Button>
        <Button variant={ 'primary' } loading={ true }>Test</Button>
      </div>
      <div className={ 'flex flex-col gap-6 mx-auto w-[500px]' }>
        <Input Icon={ IconMailFilled } type={ 'text' } label={ 'Label' } placeholder={ 'Enter something' }/>
        <Input type={ 'text' } label={ 'Label' } placeholder={ 'Enter something' }/>
        <InputPassword label={ 'Password' }/>
        <InputSelectNative label={ 'Select' } options={ [
          { label: '- Select -', value: '', disabled: true },
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
        ] }/>
        <InputSelect placeholder={'- Select -'} options={ [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
        ] } value={ null } onChange={ () => {
        } } label={ 'Select' }/>

        <InputSelectSearchable
          placeholder={'- Select -'}
          options={searchableSelectOptions}
          onSearch={(search) => searchableSelectOptions.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))}
          value={ null }
          onChange={ () => {} }
          label={ 'Select' }
        />
      </div>

    </div>
  );
};