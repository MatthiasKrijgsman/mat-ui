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
        'mat:h-6 mat:w-6 mat:select-none mat:rounded-full mat:p-0.5',
        onClick && 'mat:ring-0 mat:transition-all mat:duration-[var(--control-transition-duration)] input-icon-button-interactive mat:active:ring-[length:var(--control-ring-width-active)] mat:cursor-pointer mat:hover:ring-[length:var(--control-ring-width)] mat:group mat:pointer-events-auto'
      ) }
    >
      <Icon className={ classNames('mat:h-5 mat:w-5 input-icon-button-icon', onClick && 'mat:group-active:scale-[0.8] mat:transition-transform mat:duration-[var(--control-transition-duration)] mat:origin-center') }/>
    </div>
  );
};