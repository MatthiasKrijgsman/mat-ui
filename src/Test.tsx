import { useState } from "react";
import { InputPassword } from "@/InputPassword.tsx";
import { Divider } from "@/Divider.tsx";
import { Input } from "@/Input.tsx";
import { InputRadio } from "@/InputRadio.tsx";
import { IconMail } from "@tabler/icons-react";

export const Test = () => {

  const [ value, setValue ] = useState('');

  return (
    <div className={ 'flex flex-col gap-4' }>
      <Input
        label={ 'E-mailadres' }
        Icon={ IconMail }
        value={ value }
        onChange={ (e) => setValue(e.target.value) }
      />
      <InputPassword
        label={ 'Password' }
        value={ value }
        onChange={ (e) => setValue(e.target.value) }
        placeholder={ 'Enter your password' }
        enableShowPasswordToggle={ true }
      />
      <Divider/>

      <Divider/>
      <div className={ 'flex flex-row items-center gap-4' }>
        <div className={ 'flex flex-col flex-1' }>
          <InputRadio
            name={ 'option' }
            id={ 'option1' }
            label={ 'Option 1' }
            value={ 'option1' }
          />
        </div>
        <div className={ 'flex flex-col flex-1' }>
          <InputRadio
            name={ 'option' }
            id={ 'option2' }
            label={ 'Option 2' }
            value={ 'option2' }
          />
        </div>
      </div>
    </div>
  );
};