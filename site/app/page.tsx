'use client'

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  ButtonIconRound,
  ButtonIconSquare,
  Divider,
  DropdownButton,
  DropdownButtonGroup,
  DropdownMenu,
  Input,
  InputCheck,
  InputColor,
  InputFileMultiple,
  InputFileSingle,
  InputPassword,
  InputRadio,
  InputSelect,
  InputSelectNative,
  InputSelectSearchable,
  InputSelectSearchableAsync,
  InputTextArea,
  InputToggle,
  Modal,
  Panel,
  PanelField,
  PanelLink,
  PanelStack,
  SidebarModal,
  Spinner,
  TabButtons,
  Table,
  Tooltip,
  type BadgeColorKey,
  type TableColumnDef,
  type TableSortState,
} from "@matthiaskrijgsman/mat-ui";
import {
  IconArchive,
  IconArrowRight,
  IconBell,
  IconBrandGithub,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconDownload,
  IconHeart,
  IconLink,
  IconLogout,
  IconMail,
  IconPalette,
  IconPencil,
  IconPlus,
  IconSettings,
  IconShare,
  IconShieldLock,
  IconStar,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { ShowcaseImportPath } from "@/app/_components/ShowcaseImportPath";
import { ShowcaseSection } from "@/app/_components/ShowcaseSection";

const BADGE_COLORS: BadgeColorKey[] = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink',
  'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'white', 'black',
];

const FRAMEWORK_OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
  { label: 'Angular', value: 'angular' },
];

const CITY_OPTIONS = [
  { label: 'Amsterdam', value: 'amsterdam' },
  { label: 'Berlin', value: 'berlin' },
  { label: 'Copenhagen', value: 'copenhagen' },
  { label: 'Dublin', value: 'dublin' },
  { label: 'Edinburgh', value: 'edinburgh' },
  { label: 'Florence', value: 'florence' },
  { label: 'Geneva', value: 'geneva' },
  { label: 'Helsinki', value: 'helsinki' },
  { label: 'Istanbul', value: 'istanbul' },
  { label: 'Kyoto', value: 'kyoto' },
  { label: 'Lisbon', value: 'lisbon' },
  { label: 'Madrid', value: 'madrid' },
];

type Person = {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'invited' | 'inactive';
}

const PEOPLE: Person[] = [
  { id: 1, name: 'Alice Andersen', role: 'Designer', status: 'active' },
  { id: 2, name: 'Bram Bakker', role: 'Engineer', status: 'invited' },
  { id: 3, name: 'Chen Cao', role: 'Product Manager', status: 'active' },
  { id: 4, name: 'Daria Dvorák', role: 'Engineer', status: 'inactive' },
  { id: 5, name: 'Eitan Eilon', role: 'Designer', status: 'active' },
];

const STATUS_COLOR: Record<Person['status'], BadgeColorKey> = {
  active: 'green',
  invited: 'amber',
  inactive: 'stone',
};

type NavItem = { id: string; label: string };
const NAV_ITEMS: NavItem[] = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'icon-buttons', label: 'Icon buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'choices', label: 'Choices' },
  { id: 'selects', label: 'Selects' },
  { id: 'file', label: 'File upload' },
  { id: 'badges', label: 'Badges' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'tooltip-dropdown', label: 'Tooltip & Dropdown' },
  { id: 'modals', label: 'Modals' },
  { id: 'panels', label: 'Panels' },
  { id: 'table', label: 'Table' },
  { id: 'spinner', label: 'Spinner' },
];

export default function Page() {
  // Inputs
  const [ email, setEmail ] = useState('');
  const [ color, setColor ] = useState('#0EA5E9');

  // Choices
  const [ check, setCheck ] = useState(true);
  const [ toggle, setToggle ] = useState(true);
  const [ plan, setPlan ] = useState('monthly');

  // Selects
  const [ framework, setFramework ] = useState<string | null>('react');
  const [ frameworkSearchable, setFrameworkSearchable ] = useState<string | null>(null);
  const [ city, setCity ] = useState<string | null>('berlin');
  const [ nativeFramework, setNativeFramework ] = useState('react');

  // File
  const [ singleFile, setSingleFile ] = useState<File | null>(null);

  // Tabs
  const [ tab, setTab ] = useState<'overview' | 'activity' | 'settings'>('overview');

  // Modals
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ sidebarOpen, setSidebarOpen ] = useState(false);

  // Table
  const [ sort, setSort ] = useState<TableSortState | null>(null);
  const sortedPeople = useMemo(() => {
    if (!sort) return PEOPLE;
    const dir = sort.direction === 'asc' ? 1 : -1;
    const key = sort.columnId as keyof Person;
    return [ ...PEOPLE ].sort((a, b) =>
      String(a[key]).localeCompare(String(b[key])) * dir
    );
  }, [ sort ]);

  const columns: TableColumnDef<Person>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      defaultWidth: 220,
      renderCell: (row) => <span className={ 'font-medium' }>{ row.name }</span>,
    },
    {
      id: 'role',
      header: 'Role',
      sortable: true,
      defaultWidth: 200,
      renderCell: (row) => row.role,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      defaultWidth: 160,
      renderCell: (row) => (
        <Badge color={ STATUS_COLOR[row.status] }>{ row.status }</Badge>
      ),
    },
  ], []);

  // Async select — fake fetch
  const fetchCitiesByQuery = async (search: string) => {
    await new Promise(r => setTimeout(r, 400));
    const q = search.toLowerCase();
    return CITY_OPTIONS.filter(o => o.label.toLowerCase().includes(q));
  };
  const fetchCityByValue = async (value: string) => {
    await new Promise(r => setTimeout(r, 200));
    return CITY_OPTIONS.find(o => o.value === value) ?? { label: value, value };
  };

  const handleSearchFramework = (search: string) => {
    const q = search.toLowerCase();
    return FRAMEWORK_OPTIONS.filter(o => o.label.toLowerCase().includes(q));
  };

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
        <div className={ 'w-[240px] shrink-0' }>
          <div className={ 'sticky top-[86px] flex flex-col gap-1' }>
            <div className={ 'font-mono text-stone-500 mb-2' }>Components</div>
            { NAV_ITEMS.map(item => (
              <DropdownButton
                key={ item.id }
                className={ 'w-full font-medium!' }
                onClick={ () => {
                  if (typeof window !== 'undefined') window.location.hash = item.id;
                } }
              >
                { item.label }
              </DropdownButton>
            )) }
          </div>
        </div>

        <div className={ 'flex flex-col gap-16 flex-1 min-w-0' }>

          {/* Buttons */ }
          <section id={ 'buttons' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
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
          </section>

          {/* Icon buttons */ }
          <section id={ 'icon-buttons' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Icon buttons</h2>
            <div>Square and round icon buttons share the same variants and sizes as Button.</div>
            <ShowcaseImportPath path={ `import { ButtonIconSquare, ButtonIconRound } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Square — variants' }>
                <ButtonIconSquare Icon={ IconHeart } variant={ 'primary' }/>
                <ButtonIconSquare Icon={ IconHeart } variant={ 'secondary' }/>
                <ButtonIconSquare Icon={ IconHeart } variant={ 'tertiary' }/>
                <ButtonIconSquare Icon={ IconHeart } variant={ 'white' }/>
                <ButtonIconSquare Icon={ IconHeart } variant={ 'black' }/>
                <ButtonIconSquare Icon={ IconHeart } variant={ 'transparent' }/>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Round — variants' }>
                <ButtonIconRound Icon={ IconHeart } variant={ 'primary' }/>
                <ButtonIconRound Icon={ IconHeart } variant={ 'secondary' }/>
                <ButtonIconRound Icon={ IconHeart } variant={ 'tertiary' }/>
                <ButtonIconRound Icon={ IconHeart } variant={ 'white' }/>
                <ButtonIconRound Icon={ IconHeart } variant={ 'black' }/>
                <ButtonIconRound Icon={ IconHeart } variant={ 'transparent' }/>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Sizes' }>
                <ButtonIconSquare Icon={ IconStar } size={ 'lg' }/>
                <ButtonIconSquare Icon={ IconStar } size={ 'md' }/>
                <ButtonIconSquare Icon={ IconStar } size={ 'sm' }/>
                <ButtonIconRound Icon={ IconStar } size={ 'lg' }/>
                <ButtonIconRound Icon={ IconStar } size={ 'md' }/>
                <ButtonIconRound Icon={ IconStar } size={ 'sm' }/>
              </ShowcaseSection>
            </Panel>
          </section>

          {/* Inputs */ }
          <section id={ 'inputs' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Text inputs</h2>
            <div>Text, password, textarea and a hue/sat/value color picker — all share label, description, error and size.</div>
            <ShowcaseImportPath path={ `import { Input, InputPassword, InputTextArea, InputColor } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Sizes' } layout={ 'vertical' } narrow={ true }>
                <Input size={ 'lg' } placeholder={ 'Large' } className={ 'w-full' }/>
                <Input size={ 'md' } placeholder={ 'Medium' } className={ 'w-full' }/>
                <Input size={ 'sm' } placeholder={ 'Small' } className={ 'w-full' }/>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'With label, icon and helper text' } layout={ 'vertical' } narrow={ true }>
                <Input
                  label={ 'Email' }
                  description={ "We'll never share it." }
                  placeholder={ 'you@example.com' }
                  Icon={ IconMail }
                  value={ email }
                  onChange={ (e) => setEmail(e.target.value) }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Error state' } layout={ 'vertical' } narrow={ true }>
                <Input
                  label={ 'Username' }
                  placeholder={ 'Your handle' }
                  defaultValue={ 'invalid name' }
                  error={ 'Only letters and numbers are allowed.' }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Password' } layout={ 'vertical' } narrow={ true }>
                <InputPassword
                  label={ 'Password' }
                  description={ 'At least 8 characters.' }
                  placeholder={ '••••••••' }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Textarea' } layout={ 'vertical' } narrow={ true }>
                <InputTextArea
                  label={ 'Bio' }
                  description={ 'A short introduction. Autogrows as you type.' }
                  placeholder={ 'Tell us about yourself…' }
                  autogrow
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Color' } layout={ 'vertical' } narrow={ true }>
                <InputColor
                  label={ 'Brand color' }
                  description={ 'Click the input to open the HSV picker.' }
                  value={ color }
                  onChange={ (e) => setColor(e.target.value) }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
            </Panel>
          </section>

          {/* Choices */ }
          <section id={ 'choices' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Choices</h2>
            <div>Checkbox, radio and toggle. Each accepts a label, description and error.</div>
            <ShowcaseImportPath path={ `import { InputCheck, InputRadio, InputToggle } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Checkbox' } layout={ 'vertical' }>
                <InputCheck
                  id={ 'check-news' }
                  label={ 'Email me product updates' }
                  description={ 'About once a month, nothing more.' }
                  checked={ check }
                  onChange={ (e) => setCheck(e.target.checked) }
                />
                <InputCheck id={ 'check-disabled' } label={ 'Disabled' } disabled/>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Radio' } layout={ 'vertical' }>
                <InputRadio
                  id={ 'plan-monthly' }
                  name={ 'plan' }
                  label={ 'Monthly — $12 / month' }
                  checked={ plan === 'monthly' }
                  onChange={ () => setPlan('monthly') }
                />
                <InputRadio
                  id={ 'plan-yearly' }
                  name={ 'plan' }
                  label={ 'Yearly — $99 / year' }
                  description={ 'Save 30% compared to monthly.' }
                  checked={ plan === 'yearly' }
                  onChange={ () => setPlan('yearly') }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Toggle' } layout={ 'vertical' }>
                <InputToggle
                  id={ 'toggle-notify' }
                  label={ 'Push notifications' }
                  checked={ toggle }
                  onChange={ (e) => setToggle(e.target.checked) }
                />
                <InputToggle id={ 'toggle-disabled' } label={ 'Disabled' } disabled/>
              </ShowcaseSection>
            </Panel>
          </section>

          {/* Selects */ }
          <section id={ 'selects' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Selects</h2>
            <div>Four flavours: a native &lt;select&gt;, a styled popover select, a searchable variant, and an async-fetch variant.</div>
            <ShowcaseImportPath path={ `import { InputSelect, InputSelectNative, InputSelectSearchable, InputSelectSearchableAsync } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Native' } layout={ 'vertical' } narrow={ true }>
                <InputSelectNative
                  label={ 'Framework' }
                  options={ FRAMEWORK_OPTIONS }
                  value={ nativeFramework }
                  onChange={ (e) => setNativeFramework(e.target.value) }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Popover' } layout={ 'vertical' } narrow={ true }>
                <InputSelect
                  label={ 'Framework' }
                  description={ 'Click X to clear.' }
                  placeholder={ 'Pick one…' }
                  options={ FRAMEWORK_OPTIONS }
                  value={ framework }
                  onChange={ setFramework }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Searchable' } layout={ 'vertical' } narrow={ true }>
                <InputSelectSearchable
                  label={ 'Framework' }
                  placeholder={ 'Type to filter…' }
                  options={ FRAMEWORK_OPTIONS }
                  onSearch={ handleSearchFramework }
                  value={ frameworkSearchable }
                  onChange={ setFrameworkSearchable }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Searchable (async)' } layout={ 'vertical' } narrow={ true }>
                <InputSelectSearchableAsync
                  label={ 'City' }
                  description={ 'Simulated 400ms fetch on each search.' }
                  placeholder={ 'Search a city…' }
                  fetchOptionsByQuery={ fetchCitiesByQuery }
                  fetchOptionByValue={ fetchCityByValue }
                  value={ city }
                  onChange={ setCity }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
            </Panel>
          </section>

          {/* File */ }
          <section id={ 'file' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>File upload</h2>
            <div>Single-file picker styled like an input, or a drop-zone for multiple files with per-file tiles.</div>
            <ShowcaseImportPath path={ `import { InputFileSingle, InputFileMultiple } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Single' } layout={ 'vertical' } narrow={ true }>
                <InputFileSingle
                  label={ 'Avatar' }
                  description={ 'PNG or JPG, up to 2 MB.' }
                  value={ singleFile }
                  onChange={ setSingleFile }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Multiple' } layout={ 'vertical' } narrow={ true }>
                <InputFileMultiple
                  label={ 'Attachments' }
                  hint={ 'or click to browse' }
                  className={ 'w-full' }
                />
              </ShowcaseSection>
            </Panel>
          </section>

          {/* Badges */ }
          <section id={ 'badges' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Badges</h2>
            <div>Compact pills in 24 colors. Optionally clickable, with leading icon or a close affordance.</div>
            <ShowcaseImportPath path={ `import { Badge } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Colors' }>
                <div className={ 'flex flex-row flex-wrap gap-2' }>
                  { BADGE_COLORS.map(color => (
                    <Badge key={ color } color={ color }>{ color }</Badge>
                  )) }
                </div>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'With icon' }>
                <Badge color={ 'green' } Icon={ IconCheck }>Verified</Badge>
                <Badge color={ 'amber' } Icon={ IconBell }>Pending</Badge>
                <Badge color={ 'blue' } Icon={ IconStar }>Featured</Badge>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Clickable / dismissable' }>
                <Badge color={ 'sky' } onClick={ () => {} }>Clickable</Badge>
                <Badge color={ 'rose' } onClick={ () => {} } showCloseIcon>Remove me</Badge>
              </ShowcaseSection>
            </Panel>
          </section>

          {/* Tabs */ }
          <section id={ 'tabs' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Tabs</h2>
            <div>A simple segmented control. Pass an array of tab descriptors with optional icons.</div>
            <ShowcaseImportPath path={ `import { TabButtons } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Basic' } layout={ 'vertical' }>
                <TabButtons
                  tabs={ [
                    { label: 'Overview', active: tab === 'overview', onClick: () => setTab('overview') },
                    { label: 'Activity', active: tab === 'activity', onClick: () => setTab('activity') },
                    { label: 'Settings', active: tab === 'settings', onClick: () => setTab('settings') },
                  ] }
                />
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'With icons' } layout={ 'vertical' }>
                <TabButtons
                  tabs={ [
                    { label: 'Profile', Icon: IconUser, active: tab === 'overview', onClick: () => setTab('overview') },
                    { label: 'Notifications', Icon: IconBell, active: tab === 'activity', onClick: () => setTab('activity') },
                    { label: 'Security', Icon: IconShieldLock, active: tab === 'settings', onClick: () => setTab('settings') },
                  ] }
                />
              </ShowcaseSection>
            </Panel>
          </section>

          {/* Tooltip & Dropdown */ }
          <section id={ 'tooltip-dropdown' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Tooltip & Dropdown</h2>
            <div>Both built on the same Floating UI popover. Tooltip is hover-only; DropdownMenu is click-and-dismiss.</div>
            <ShowcaseImportPath path={ `import { Tooltip, DropdownMenu, DropdownButton, DropdownButtonGroup } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Tooltip' }>
                <Tooltip content={ 'Copy to clipboard' }>
                  <ButtonIconSquare Icon={ IconCopy } variant={ 'white' }/>
                </Tooltip>
                <Tooltip content={ 'Share this page' } placement={ 'right' }>
                  <ButtonIconSquare Icon={ IconShare } variant={ 'white' }/>
                </Tooltip>
                <Tooltip content={ 'Open in a new tab' } placement={ 'bottom' }>
                  <Button variant={ 'white' } Icon={ IconLink }>Hover me</Button>
                </Tooltip>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'Dropdown menu' }>
                <DropdownMenu
                  trigger={ <Button variant={ 'white' } Icon={ IconSettings }>Actions</Button> }
                  placement={'bottom-start'}
                >
                  <DropdownButtonGroup label={ 'Manage' }>
                    <DropdownButton Icon={ IconPencil }>Edit</DropdownButton>
                    <DropdownButton Icon={ IconCopy }>Duplicate</DropdownButton>
                    <DropdownButton Icon={ IconArchive }>Archive</DropdownButton>
                  </DropdownButtonGroup>
                  <DropdownButtonGroup label={ 'Danger zone' }>
                    <DropdownButton Icon={ IconTrash } className={ 'text-red-600' }>Delete</DropdownButton>
                  </DropdownButtonGroup>
                </DropdownMenu>
              </ShowcaseSection>
            </Panel>
          </section>

          {/* Modals */ }
          <section id={ 'modals' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Modals</h2>
            <div>A centered modal and a right-side sheet. Both support outside-click and Escape dismissal.</div>
            <ShowcaseImportPath path={ `import { Modal, SidebarModal } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Open' }>
                <Button variant={ 'primary' } onClick={ () => setModalOpen(true) }>Open modal</Button>
                <Button variant={ 'white' } onClick={ () => setSidebarOpen(true) }>Open sidebar</Button>
              </ShowcaseSection>
            </Panel>

            <Modal
              open={ modalOpen }
              onDismiss={ () => setModalOpen(false) }
              enableDismissOnOutsideClick
              enableDismissOnEscKey
              enableDismissButton
            >
              <h3>Are you sure?</h3>
              <div className={ 'mt-3 text-stone-500' }>
                This action will archive the project. You can restore it later from the trash.
              </div>
              <div className={ 'mt-6 flex flex-row gap-3 justify-end' }>
                <Button variant={ 'white' } onClick={ () => setModalOpen(false) }>Cancel</Button>
                <Button variant={ 'primary' } onClick={ () => setModalOpen(false) }>Archive</Button>
              </div>
            </Modal>

            <SidebarModal
              open={ sidebarOpen }
              onDismiss={ () => setSidebarOpen(false) }
              enableDismissOnOutsideClick
              enableDismissOnEscKey
              enableDismissButton
            >
              <h3>Edit profile</h3>
              <div className={ 'mt-6 flex flex-col gap-4' }>
                <Input label={ 'Name' } defaultValue={ 'Matthias Krijgsman' }/>
                <Input label={ 'Email' } defaultValue={ 'matthias@example.com' } Icon={ IconMail }/>
                <InputTextArea label={ 'Bio' } defaultValue={ 'Building small, sturdy UI.' } autogrow/>
              </div>
              <div className={ 'mt-8 flex flex-row gap-3 justify-end' }>
                <Button variant={ 'white' } onClick={ () => setSidebarOpen(false) }>Cancel</Button>
                <Button variant={ 'primary' } onClick={ () => setSidebarOpen(false) }>Save</Button>
              </div>
            </SidebarModal>
          </section>

          {/* Panels */ }
          <section id={ 'panels' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Panels</h2>
            <div>A standard padded container, a tighter stack for fields and links, plus PanelField and PanelLink for settings-style layouts.</div>
            <ShowcaseImportPath path={ `import { Panel, PanelStack, PanelField, PanelLink } from "@matthiaskrijgsman/mat-ui"` }/>

            <div className={ 'grid grid-cols-1 lg:grid-cols-2 gap-6' }>
              <div className={ 'flex flex-col gap-3' }>
                <div className={ 'text-sm text-stone-400' }>PanelField — horizontal</div>
                <PanelStack>
                  <PanelField label={ 'Name' } orientation={ 'horizontal' }>Matthias Krijgsman</PanelField>
                  <Divider />
                  <PanelField label={ 'Email' } orientation={ 'horizontal' }>matthias@example.com</PanelField>
                  <Divider />
                  <PanelField label={ 'Role' } orientation={ 'horizontal' }>Admin</PanelField>
                  <Divider />
                  <PanelField label={ 'Plan' } orientation={ 'horizontal' }>
                    <Badge color={ 'sky' }>Pro</Badge>
                  </PanelField>
                </PanelStack>
              </div>

              <div className={ 'flex flex-col gap-3' }>
                <div className={ 'text-sm text-stone-400' }>PanelField — vertical</div>
                <PanelStack>
                  <PanelField label={ 'Name' } orientation={ 'vertical' }>Matthias Krijgsman</PanelField>
                  <Divider />
                  <PanelField label={ 'Email' } orientation={ 'vertical' }>matthias@example.com</PanelField>
                  <Divider />
                  <PanelField label={ 'Role' } orientation={ 'vertical' }>Admin</PanelField>
                  <Divider />
                  <PanelField label={ 'Plan' } orientation={ 'vertical' }>
                    <Badge color={ 'sky' }>Pro</Badge>
                  </PanelField>
                </PanelStack>
              </div>

              <div className={ 'flex flex-col gap-3' }>
                <div className={ 'text-sm text-stone-400' }>PanelStack with PanelLink</div>
                <PanelStack>
                  <PanelLink Icon={ IconUser }>Account</PanelLink>
                  <Divider />
                  <PanelLink Icon={ IconBell } status={ 'warning' }>Notifications</PanelLink>
                  <Divider />
                  <PanelLink Icon={ IconShieldLock } status={ 'success' }>Security</PanelLink>
                  <Divider />
                  <PanelLink Icon={ IconPalette }>Appearance</PanelLink>
                  <Divider />
                  <PanelLink Icon={ IconLogout } status={ 'error' }>Sign out</PanelLink>
                </PanelStack>
              </div>
            </div>
          </section>

          {/* Table */ }
          <section id={ 'table' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Table</h2>
            <div>Column-defined, resizable headers and controlled sort state. The consumer is responsible for sorting rows.</div>
            <ShowcaseImportPath path={ `import { Table } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <div style={ { height: 320 } }>
                <Table
                  columns={ columns }
                  rows={ sortedPeople }
                  getRowId={ (row) => row.id }
                  sort={ sort }
                  onSortChange={ setSort }
                />
              </div>
            </Panel>
          </section>

          {/* Spinner */ }
          <section id={ 'spinner' } className={ 'flex flex-col gap-6 scroll-mt-24' }>
            <h2>Spinner</h2>
            <div>Indeterminate progress indicator. Inherits color via currentColor; size is set with className.</div>
            <ShowcaseImportPath path={ `import { Spinner } from "@matthiaskrijgsman/mat-ui"` }/>
            <Panel>
              <ShowcaseSection title={ 'Sizes' }>
                <Spinner className={ 'h-4 w-4 text-stone-500' }/>
                <Spinner className={ 'h-6 w-6 text-stone-500' }/>
                <Spinner className={ 'h-8 w-8 text-stone-500' }/>
                <Spinner className={ 'h-10 w-10 text-sky-500' }/>
              </ShowcaseSection>
              <Divider/>
              <ShowcaseSection title={ 'In context' }>
                <Button variant={ 'primary' } loading className={ 'w-32' }>Saving</Button>
                <div className={ 'inline-flex flex-row items-center gap-2 text-stone-500' }>
                  <Spinner className={ 'h-4 w-4' }/>
                  Loading…
                </div>
                <Button variant={ 'white' } Icon={ IconArrowRight }>Continue</Button>
                <ButtonIconRound variant={ 'transparent' } Icon={ IconBrandGithub }/>
                <Tooltip content={ 'Pick a date' }>
                  <ButtonIconSquare variant={ 'white' } Icon={ IconCalendar }/>
                </Tooltip>
              </ShowcaseSection>
            </Panel>
          </section>

        </div>
      </div>
    </div>
  );
}
