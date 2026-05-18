'use client'

import { IconBrandGithubFilled, IconMoon } from "@tabler/icons-react";
import { ButtonIconSquare } from "@matthiaskrijgsman/mat-ui";

export const Nav = () => {
  return (
    <div className={ 'border-b border-stone-200 h-[70px] sticky top-0 bg-stone-100/50 backdrop-blur-xl' }>
      <div className={'w-page-content flex flex-row w-full h-full items-center justify-between'}>
        <div className={ 'flex flex-row items-center gap-3' }>
          <div className={ 'h-8 w-8 rounded-xl bg-black text-white font-bold grid place-items-center' }>M</div>
          <div className={ 'font-semibold' }>mat-ui</div>
          <div className={ 'font-mono text-stone-600 rounded-full border text-sm border-stone-300 px-2 py-0.5' }>v0.0.18
          </div>
        </div>

        <div className={ 'flex flex-row items-center gap-3' }>
          <ButtonIconSquare variant={ 'transparent' } Icon={ IconBrandGithubFilled }/>
          <ButtonIconSquare variant={ 'transparent' } Icon={ IconMoon }/>
        </div>
      </div>
    </div>
  );
};