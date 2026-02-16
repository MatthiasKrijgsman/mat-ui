import { useState } from "react";
import {
  Button,
  ButtonIconSquare,
  ButtonIconRound,
  Input,
  InputPassword,
  InputTextArea,
  InputCheck,
  InputRadio,
  InputToggle,
  InputSelectNative,
  InputSelect,
  InputSelectSearchable,
  Badge,
  Panel,
  Divider,
  TabButtons,
  Spinner,
  Tooltip,
  Modal,
  DropdownMenu,
  DropdownButton,
  DropdownButtonGroup,
} from "@/index.tsx";
import type { ButtonVariant, ButtonSize, BadgeColorKey } from "@/types.ts";
import {
  IconPlus,
  IconSettings,
  IconTrash,
  IconEdit,
  IconCopy,
  IconDownload,
  IconSearch,
  IconStar,
  IconHeart,
  IconUser,
  IconHome,
  IconBell,
  IconCheck,
} from "@tabler/icons-react";

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'white', 'black', 'transparent'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

const selectOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Dragonfruit', value: 'dragonfruit' },
  { label: 'Elderberry', value: 'elderberry' },
];

const nativeSelectOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

const badgeColors: BadgeColorKey[] = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink',
  'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'white', 'black',
];

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Panel>
      <div className={'flex flex-col gap-1'}>
        <h2 className={'text-2xl font-bold text-gray-900'}>{ title }</h2>
        <p className={'text-gray-500'}>{ description }</p>
      </div>
      { children }
    </Panel>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={'flex flex-col gap-3'}>
      <h3 className={'text-sm font-semibold text-gray-400 uppercase tracking-wide'}>{ title }</h3>
      { children }
    </div>
  );
}

export const ShowcaseContent = () => {
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [searchableSelectValue, setSearchableSelectValue] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [toggleChecked, setToggleChecked] = useState(false);
  const [checkChecked, setCheckChecked] = useState(false);

  return (
    <div className={'flex flex-col gap-8 max-w-4xl'}>
      <div className={'flex flex-col gap-1'}>
        <h1 className={'text-4xl font-bold text-gray-900'}>Component Showcase</h1>
        <p className={'text-lg text-gray-500'}>All mat-ui components organized by category.</p>
      </div>

      {/* Buttons */}
      <Section title="Buttons" description="Standard buttons, icon buttons, and their variants.">
        <SubSection title="Button variants">
          <div className={'flex flex-row flex-wrap gap-3'}>
            { variants.map(v => (
              <Button key={ v } variant={ v }>{ v }</Button>
            )) }
          </div>
        </SubSection>

        <SubSection title="Button sizes">
          <div className={'flex flex-row flex-wrap items-center gap-3'}>
            { sizes.map(s => (
              <Button key={ s } variant="primary" size={ s }>{ s }</Button>
            )) }
          </div>
        </SubSection>

        <SubSection title="Button with icon">
          <div className={'flex flex-row flex-wrap gap-3'}>
            <Button variant="primary" Icon={ IconPlus }>Create</Button>
            <Button variant="secondary" Icon={ IconDownload }>Download</Button>
            <Button variant="white" Icon={ IconSearch }>Search</Button>
          </div>
        </SubSection>

        <SubSection title="Button loading">
          <div className={'flex flex-row flex-wrap gap-3'}>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="secondary" loading>Loading</Button>
            <Button variant="white" loading>Loading</Button>
          </div>
        </SubSection>

        <SubSection title="Button disabled">
          <div className={'flex flex-row flex-wrap gap-3'}>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </SubSection>

        <SubSection title="ButtonIconSquare">
          <div className={'flex flex-row flex-wrap gap-3'}>
            { variants.map(v => (
              <ButtonIconSquare key={ v } variant={ v } Icon={ IconSettings }/>
            )) }
          </div>
        </SubSection>

        <SubSection title="ButtonIconRound">
          <div className={'flex flex-row flex-wrap gap-3'}>
            { variants.map(v => (
              <ButtonIconRound key={ v } variant={ v } Icon={ IconHeart }/>
            )) }
          </div>
        </SubSection>
      </Section>

      {/* Text Inputs */}
      <Section title="Text Inputs" description="Text fields, password fields, and text areas.">
        <div className={'grid grid-cols-2 gap-4'}>
          <Input placeholder="Default input" />
          <Input label="With label" description="A helpful description" placeholder="Type here..." />
          <Input label="With icon" Icon={ IconSearch } placeholder="Search..." />
          <Input label="With error" error="This field is required" placeholder="Invalid input" />
          <Input label="Disabled" disabled placeholder="Can't touch this" />
          <InputPassword label="Password" placeholder="Enter password..." />
        </div>
        <SubSection title="TextArea">
          <InputTextArea label="Message" description="Write your message below" placeholder="Type your message..." rows={ 3 } />
        </SubSection>
      </Section>

      {/* Selection Inputs */}
      <Section title="Selection Inputs" description="Checkboxes, radios, toggles, and select dropdowns.">
        <div className={'grid grid-cols-2 gap-6'}>
          <div className={'flex flex-col gap-4'}>
            <SubSection title="Checkbox">
              <InputCheck
                label="Accept terms and conditions"
                checked={ checkChecked }
                onChange={ () => setCheckChecked(!checkChecked) }
              />
            </SubSection>
            <SubSection title="Radio">
              <div className={'flex flex-col gap-2'}>
                <InputRadio name="demo-radio" label="Option one" defaultChecked />
                <InputRadio name="demo-radio" label="Option two" />
                <InputRadio name="demo-radio" label="Option three" />
              </div>
            </SubSection>
            <SubSection title="Toggle">
              <InputToggle
                label="Enable notifications"
                checked={ toggleChecked }
                onChange={ () => setToggleChecked(!toggleChecked) }
              />
            </SubSection>
          </div>

          <div className={'flex flex-col gap-4'}>
            <SubSection title="Native Select">
              <InputSelectNative label="Choose option" options={ nativeSelectOptions } />
            </SubSection>
            <SubSection title="Custom Select">
              <InputSelect
                label="Pick a fruit"
                options={ selectOptions }
                value={ selectValue }
                onChange={ setSelectValue }
                placeholder="Select a fruit..."
              />
            </SubSection>
            <SubSection title="Searchable Select">
              <InputSelectSearchable
                label="Search fruits"
                options={ selectOptions }
                onSearch={ (search) => selectOptions.filter(o => String(o.label).toLowerCase().includes(search.toLowerCase())) }
                value={ searchableSelectValue }
                onChange={ setSearchableSelectValue }
                placeholder="Type to search..."
              />
            </SubSection>
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges" description="Color-coded badges with optional icons and actions.">
        <SubSection title="All colors">
          <div className={'flex flex-row flex-wrap gap-2'}>
            { badgeColors.map(c => (
              <Badge key={ c } color={ c }>{ c }</Badge>
            )) }
          </div>
        </SubSection>
        <SubSection title="With icon">
          <div className={'flex flex-row flex-wrap gap-2'}>
            <Badge color="blue" Icon={ IconStar }>Featured</Badge>
            <Badge color="green" Icon={ IconCheck }>Verified</Badge>
            <Badge color="red" Icon={ IconBell }>Alert</Badge>
            <Badge color="purple" Icon={ IconUser }>Admin</Badge>
          </div>
        </SubSection>
        <SubSection title="Clickable with close icon">
          <div className={'flex flex-row flex-wrap gap-2'}>
            <Badge color="blue" onClick={ () => {} } showCloseIcon>Removable</Badge>
            <Badge color="emerald" onClick={ () => {} } showCloseIcon Icon={ IconStar }>Starred</Badge>
          </div>
        </SubSection>
      </Section>

      {/* Layout */}
      <Section title="Layout" description="Panels, dividers, and tab navigation.">
        <SubSection title="Panel">
          <Panel>
            <p className={'text-gray-600'}>This is content inside a nested Panel component.</p>
          </Panel>
        </SubSection>

        <SubSection title="Divider">
          <div className={'flex flex-col gap-3'}>
            <p className={'text-gray-600'}>Horizontal divider below:</p>
            <Divider />
            <div className={'flex flex-row items-center gap-4 h-10'}>
              <span className={'text-gray-600'}>Left</span>
              <Divider vertical />
              <span className={'text-gray-600'}>Right</span>
            </div>
          </div>
        </SubSection>

        <SubSection title="TabButtons">
          <TabButtons tabs={[
            { label: 'Overview', active: activeTab === 0, onClick: () => setActiveTab(0), Icon: IconHome },
            { label: 'Settings', active: activeTab === 1, onClick: () => setActiveTab(1), Icon: IconSettings },
            { label: 'Users', active: activeTab === 2, onClick: () => setActiveTab(2), Icon: IconUser },
          ]} />
        </SubSection>
      </Section>

      {/* Feedback */}
      <Section title="Feedback" description="Spinners, tooltips, and modals.">
        <SubSection title="Spinner">
          <div className={'flex flex-row items-center gap-6'}>
            <Spinner className={'h-6 w-6 text-gray-900'} />
            <Spinner className={'h-8 w-8 text-blue-600'} />
            <Spinner className={'h-10 w-10 text-emerald-600'} />
          </div>
        </SubSection>

        <SubSection title="Tooltip">
          <div className={'flex flex-row gap-4'}>
            <Tooltip content="This is a tooltip!" placement="top">
              <Button variant="white">Hover me (top)</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" placement="bottom">
              <Button variant="white">Hover me (bottom)</Button>
            </Tooltip>
          </div>
        </SubSection>

        <SubSection title="Modal">
          <Button variant="primary" onClick={ () => setModalOpen(true) }>Open Modal</Button>
          <Modal
            open={ modalOpen }
            onDismiss={ () => setModalOpen(false) }
            enableDismissButton
            enableDismissOnOutsideClick
            enableDismissOnEscKey
          >
            <h3 className={'text-xl font-bold text-gray-900 mb-2'}>Modal Title</h3>
            <p className={'text-gray-600 mb-6'}>This is the modal content. You can place any component here.</p>
            <div className={'flex flex-row gap-3 justify-end'}>
              <Button variant="white" onClick={ () => setModalOpen(false) }>Cancel</Button>
              <Button variant="primary" onClick={ () => setModalOpen(false) }>Confirm</Button>
            </div>
          </Modal>
        </SubSection>
      </Section>

      {/* Dropdown Menu */}
      <Section title="Dropdown Menu" description="Contextual menus with grouped actions.">
        <div className={'flex flex-row gap-4'}>
          <DropdownMenu
            placement={'top-start'}
            trigger={ <Button variant="white" Icon={ IconSettings }>Actions</Button> }
          >
            <DropdownButtonGroup label="Edit">
              <DropdownButton Icon={ IconEdit }>Rename</DropdownButton>
              <DropdownButton Icon={ IconCopy }>Duplicate</DropdownButton>
            </DropdownButtonGroup>
            <DropdownButtonGroup label="Danger">
              <DropdownButton Icon={ IconTrash }>Delete</DropdownButton>
            </DropdownButtonGroup>
          </DropdownMenu>

          <DropdownMenu
            placement={'top-start'}
            trigger={ <ButtonIconSquare variant="white" Icon={ IconPlus } /> }
          >
            <DropdownButton Icon={ IconEdit }>New document</DropdownButton>
            <DropdownButton Icon={ IconDownload }>Import file</DropdownButton>
          </DropdownMenu>
        </div>
      </Section>
    </div>
  );
};
