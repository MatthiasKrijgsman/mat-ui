'use client'

import { Button, Divider, DropdownButton, Panel } from "@matthiaskrijgsman/mat-ui";
import { IconDownload, IconHeart, IconPlus } from "@tabler/icons-react";
import { ShowcaseImportPath } from "@/app/_components/ShowcaseImportPath";
import { ShowcaseSection } from "@/app/_components/ShowcaseSection";

export default function Page() {
  return (
    <div className={ 'w-page-content flex flex-col gap-12 pb-24' }>
      <div className={ 'flex flex-col' }>
        <div className={ 'mt-12 font-medium font-mono text-stone-500' }>REACT · TAILWIND · FLOATING UI</div>
        <h1 className={ 'mt-3 lg:max-w-[70%]' }>Small, sturdy <span className={ 'text-sky-500' }>components</span> for
          building UI and Forms</h1>

        <div className={ 'mt-3 text-xl lg:max-w-[60%] text-stone-500' }>
          Buttons, inputs, popovers and a few opinions. Built around CSS variables so the whole system can be
          re-skinned with a handful of tokens — light, dark, or your brand.
        </div>

        <div
          className={ 'mt-6 w-fit border input-base transition-all duration-150 rounded-xl shadow-sm text-stone-500 ring-0 focus:ring-4 focus:outline-none pl-4 pr-6 py-2.5 font-mono' }>
          <span className={ 'text-stone-400 select-none' }>$ </span>pnpm install @matthiaskrijgsman/mat-ui
        </div>
      </div>

      <Divider/>

      <div className={ 'flex flex-row gap-12' }>
        <div className={ 'w-[300px] flex flex-col gap-1' }>
          <div className={ 'font-mono text-stone-500 mb-2' }>Components</div>
          <DropdownButton className={ 'w-full font-medium!' }>Buttons</DropdownButton>
        </div>
        <div className={ 'flex flex-col gap-12 flex-1' }>

          <div className={ 'flex flex-col gap-6' }>
            <h2>Buttons</h2>
            <div>Six variants, three sizes, optional leading icon. Loading and disabled states included.</div>
            <ShowcaseImportPath path={ `import { Button } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Variants' }>
                <Button variant={ 'primary' }>Primary</Button>
                <Button variant={ 'secondary' }>Secondary</Button>
                <Button variant={ 'tertiary' }>Tertiary</Button>
                <Button variant={ 'white' }>White</Button>
                <Button variant={ 'black' }>Black</Button>
                <Button variant={ 'transparent' }>Transparent</Button>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Sizes' }>
                <Button size={ 'lg' }>Large</Button>
                <Button size={ 'md' }>Medium</Button>
                <Button size={ 'sm' }>Small</Button>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'With icon' }>
                <Button Icon={ IconPlus } variant={ 'primary' }>Create</Button>
                <Button Icon={ IconDownload } variant={ 'white' }>Download</Button>
                <Button Icon={ IconHeart } variant={ 'black' }>Like</Button>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'States' }>
                <Button loading={ true } variant={ 'primary' } className={ 'w-28' }>Loading</Button>
                <Button disabled={ true } variant={ 'white' }>Disabled</Button>
              </ShowcaseSection>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
