'use client'

import { IconBrandGithubFilled } from "@tabler/icons-react";
import { ButtonIconSquare } from "@matthiaskrijgsman/mat-ui";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import Link from "next/link";

export const Nav = () => {
  return (
    <div
      className={ 'border-b border-stone-200 dark:border-stone-700! h-[70px] sticky top-0 bg-stone-100/50 dark:bg-stone-700/50 backdrop-blur-xl z-10' }>
      <div className={ 'w-page-content flex flex-row w-full h-full items-center justify-between' }>
        <div className={ 'flex flex-row items-center gap-3' }>
          <div className={ 'h-8 w-8 rounded-xl bg-black text-white font-bold grid place-items-center' }>M</div>
          <div className={ 'font-semibold' }>mat-ui</div>
          <div
            className={ 'font-mono text-stone-600 dark:text-stone-300 rounded-full border text-sm border-stone-300 dark:border-stone-600 px-2 py-0.5' }
          >
            v0.0.37
          </div>
        </div>

        <div className={ 'flex flex-row items-center gap-3' }>
          <Link href={ 'https://github.com/MatthiasKrijgsman/mat-ui' } target={ '_blank' }>
            <ButtonIconSquare variant={ 'transparent' } Icon={ IconBrandGithubFilled }/>
          </Link>
          <ThemeToggle/>
        </div>
      </div>
    </div>
  );
};