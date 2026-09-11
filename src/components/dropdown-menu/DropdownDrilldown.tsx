import * as React from "react";
import { useId } from "react";
import { IconChevronRight, type TablerIcon } from "@tabler/icons-react";
import { DropdownButton } from "@/components/dropdown-menu/DropdownButton.tsx";
import { useDropdownDrilldown } from "@/components/dropdown-menu/use-dropdown-drilldown.ts";

export type DropdownDrilldownProps = {
  label: React.ReactNode;
  Icon?: TablerIcon;
  children?: React.ReactNode;
  className?: string;
}

export const DropdownDrilldown = (props: DropdownDrilldownProps) => {
  const { label, Icon, children, className } = props;
  const { push } = useDropdownDrilldown();
  const id = useId();

  const handleOnClick = () => {
    push({ id, label, Icon, content: children });
  }

  return (
    <DropdownButton dismissOnClick={ false } Icon={ Icon } onClick={ handleOnClick } className={ className }>
      <span className={ 'mat:flex-1 mat:text-left' }>{ label }</span>
      <IconChevronRight className={ 'mat:h-5 mat:w-5 mat:shrink-0 mat:-mr-1 mat:opacity-60' }/>
    </DropdownButton>
  );
};
