import { IconFolderFilled } from "@tabler/icons-react";
import { Badge } from "@/Badge.tsx";

export const Test = () => {

  return (
    <div className={ 'flex flex-col gap-3' }>
      <div className={ 'space-x-2 space-y-2' }>
        <Badge onClick={ () => {} } color={ 'orange' }>Orange</Badge>
        <Badge color={ 'orange' }>Orange</Badge>
        <Badge Icon={ IconFolderFilled } showCloseIcon={true} onClick={ () => {} } color={ 'red' }>Red</Badge>
        <Badge Icon={ IconFolderFilled } color={ 'red' }>Red</Badge>
        <Badge showCloseIcon={true} color={ 'red' }>Red</Badge>
      </div>
    </div>
  );
};