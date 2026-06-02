'use client'

import { useEffect, useState } from "react";
import { DropdownButton } from "@matthiaskrijgsman/mat-ui";
import { classNames } from "../../../src/util/classnames.util";

type NavItem = { id: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'icon-buttons', label: 'Icon buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'choices', label: 'Choices' },
  { id: 'selects', label: 'Selects' },
  { id: 'rich-text', label: 'Rich text' },
  { id: 'file', label: 'File upload' },
  { id: 'badges', label: 'Badges' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'tooltip-dropdown', label: 'Tooltip & Dropdown' },
  { id: 'modals', label: 'Modals' },
  { id: 'panels', label: 'Panels' },
  { id: 'table', label: 'Table' },
  { id: 'auto-scroll', label: 'Auto scroll' },
  { id: 'spinner', label: 'Spinner' },
];

const ACTIVE_OFFSET = 100;

export const NavComponents = () => {

  const [ activeId, setActiveId ] = useState<string>(NAV_ITEMS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      let next = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET <= 0) {
          next = item.id;
        } else {
          break;
        }
      }
      setActiveId(next);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={ 'w-[240px] shrink-0' }>
      <div className={ 'sticky top-[86px] flex flex-col gap-1' }>
        <div className={ 'font-mono text-stone-500 mb-2' }>Components</div>
        { NAV_ITEMS.map(item => (
          <DropdownButton
            key={ item.id }
            className={ classNames(
              'w-full font-medium!',
              activeId === item.id && 'dark:bg-stone-800! bg-stone-200!',
            ) }
            onClick={ () => {
              if (typeof window !== 'undefined') window.location.hash = item.id;
            } }
          >
            { item.label }
          </DropdownButton>
        )) }
      </div>
    </div>
  );
};
