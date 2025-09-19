import { useState } from "react";
import { Input, type InputProps } from "@/components/inputs/Input.tsx";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { InputIconButton } from "@/components/inputs/InputIconButton.tsx";


export type InputPasswordProps = InputProps & {
  enableShowPasswordToggle?: boolean;
}


export const InputPassword = (props: InputPasswordProps) => {

  const {
    type = 'password',
    enableShowPasswordToggle = true,
    ...rest
  } = props;

  const [ showPassword, setShowPassword ] = useState<boolean>(false);

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <Input
      type={ showPassword ? 'text' : type }
      buttonTray={
        enableShowPasswordToggle ? (
          <InputIconButton Icon={ showPassword ? IconEyeOff : IconEye } onClick={ handleToggleShowPassword }/>
        ) : undefined
      }
      { ...rest }
    />
  );
};