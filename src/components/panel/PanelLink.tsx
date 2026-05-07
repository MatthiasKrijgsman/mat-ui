import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import { IconChevronRight, type TablerIcon } from "@tabler/icons-react";


type PanelLinkBaseProps = {
  Icon?: TablerIcon;
  children?: React.ReactNode;
}

type PanelLinkAnchorProps = PanelLinkBaseProps
  & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof PanelLinkBaseProps>
  & { href: string };

type PanelLinkButtonProps = PanelLinkBaseProps
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof PanelLinkBaseProps>
  & { href?: undefined };

export type PanelLinkProps = PanelLinkAnchorProps | PanelLinkButtonProps;

const base: string = `inline-flex flex-row gap-3 items-center justify-between h-10 px-3 font-semibold ring-0 dropdown-item rounded-lg cursor-pointer transition-all duration-150 select-none focus:outline-none focus:ring-0 border border-transparent bg-transparent`;

export const PanelLink = (props: PanelLinkProps) => {

  const {
    className,
    children,
    Icon,
    ...rest
  } = props;

  const content = (
    <>
      <span className={ 'inline-flex flex-row items-center gap-3 min-w-0' }>
        { Icon && <Icon className={ 'h-5 w-5 shrink-0' }/> }
        <span className={ 'truncate' }>{ children }</span>
      </span>
      <IconChevronRight className={ 'h-5 w-5 shrink-0 text-[var(--color-input-icon-button-icon)]' }/>
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorRest } = rest as PanelLinkAnchorProps;
    return (
      <a
        href={ href }
        className={ classNames(base, className) }
        { ...anchorRest }
      >
        { content }
      </a>
    );
  }

  return (
    <button
      className={ classNames(base, className) }
      { ...(rest as PanelLinkButtonProps) }
    >
      { content }
    </button>
  );
};
