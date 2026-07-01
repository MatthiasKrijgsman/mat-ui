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
      <span className={ 'flex-1 text-left' }>{ label }</span>
      <IconChevronRight className={ 'h-5 w-5 shrink-0 -mr-1 opacity-60' }/>
    </DropdownButton>
  );
};
