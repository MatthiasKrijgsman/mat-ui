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
        onClick && 'ring-0 transition-all duration-[var(--control-transition-duration)] input-icon-button-interactive active:ring-[length:var(--control-ring-width-active)] cursor-pointer hover:ring-[length:var(--control-ring-width)] group pointer-events-auto'
      ) }
    >
      <Icon className={ classNames('h-5 w-5 input-icon-button-icon', onClick && 'group-active:scale-[0.8] transition-transform duration-[var(--control-transition-duration)] origin-center') }/>
    </div>
  );
};