import { type TablerIcon } from "@tabler/icons-react";
import { classNames } from "@/util/classnames.util.ts";

export type InputIconButtonProps = {
  onClick?: () => void;
  Icon: TablerIcon
}

export const InputIconButton = (props: InputIconButtonProps) => {
  const {
    onClick,
    Icon
  } = props;
  return (
    <div
      onClick={ onClick }
      className={ classNames(
        'h-6 w-6 select-none rounded-full p-0.5',
        onClick && 'ring-0 transition-all duration-150 input-icon-button-interactive active:ring-2 cursor-pointer hover:ring-4 group'
      ) }
    >
      <Icon className={ classNames('h-5 w-5 input-icon-button-icon', onClick && 'group-active:scale-[0.8] transition-transform origin-center') }/>
    </div>
  );
};