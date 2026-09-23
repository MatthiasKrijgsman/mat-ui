import * as React from "react";
import { classNames } from "@/util/classnames.util.ts";
import {
  IconAlertTriangleFilled,
  IconChevronRight,
  IconCircleCheckFilled,
  IconExclamationCircleFilled,
  IconInfoCircleFilled,
  type TablerIcon,
} from "@tabler/icons-react";


export type PanelLinkStatus = 'error' | 'warning' | 'success' | 'info';

const statusIcons: Record<PanelLinkStatus, TablerIcon> = {
  error: IconExclamationCircleFilled,
  warning: IconAlertTriangleFilled,
  success: IconCircleCheckFilled,
  info: IconInfoCircleFilled,
};

const statusColorClasses: Record<PanelLinkStatus, string> = {
  error: 'mat:text-[var(--color-status-error)]',
  warning: 'mat:text-[var(--color-status-warning)]',
  success: 'mat:text-[var(--color-status-success)]',
  info: 'mat:text-[var(--color-status-info)]',
};

type PanelLinkBaseProps = {
  Icon?: TablerIcon;
  children?: React.ReactNode;
  status?: PanelLinkStatus;
}

type PanelLinkAnchorProps = PanelLinkBaseProps
  & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof PanelLinkBaseProps>
  & { href: string };

type PanelLinkButtonProps = PanelLinkBaseProps
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof PanelLinkBaseProps>
  & { href?: undefined };

export type PanelLinkProps = PanelLinkAnchorProps | PanelLinkButtonProps;

const base: string = `mat:inline-flex mat:flex-row mat:gap-3 mat:items-center mat:justify-between mat:h-10 mat:px-3 mat:font-[number:var(--font-weight-panel-link)] mat:font-[family-name:var(--font-family-base)] mat:ring-0 dropdown-item mat:rounded-[var(--border-radius-menu-item)] mat:cursor-pointer mat:transition-all mat:duration-[var(--control-transition-duration)] mat:select-none mat:focus:outline-none mat:focus:ring-0 mat:border mat:border-transparent mat:bg-transparent`;

export const PanelLink = (props: PanelLinkProps) => {

  const {
    className,
    children,
    Icon,
    status,
    ...rest
  } = props;

  const StatusIcon = status ? statusIcons[status] : null;

  const content = (
    <>
      <span className={ 'mat:inline-flex mat:flex-row mat:items-center mat:gap-3 mat:min-w-0' }>
        { Icon && <Icon className={ 'mat:h-5 mat:w-5 mat:shrink-0' }/> }
        <span className={ 'mat:truncate' }>{ children }</span>
      </span>
      <span className={ 'mat:inline-flex mat:flex-row mat:items-center mat:gap-2 mat:shrink-0' }>
        { StatusIcon && status && (
          <StatusIcon className={ classNames('mat:h-5 mat:w-5', statusColorClasses[status]) }/>
        ) }
        <IconChevronRight className={ 'mat:h-5 mat:w-5 mat:text-[var(--color-input-icon-button-icon)]' }/>
      </span>
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
