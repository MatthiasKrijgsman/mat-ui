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
    InputPassword,
    InputRadio,
    InputSelect,
    InputSelectNative,
    InputSelectSearchable,
    InputSelectSearchableAsync,
    InputTextArea,
    InputToggle,
    Panel,
    Spinner,
    TabButtons,
    Tooltip,
} from "../../src";
import {
    IconDownload,
    IconHeart,
    IconHome,
    IconMail,
    IconPlus,
    IconSearch,
    IconSettings,
    IconStar,
    IconTrash,
    IconUser,
} from "@tabler/icons-react";
import { ModalDemo } from "./ModalDemo";

const selectOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Grape', value: 'grape' },
    { label: 'Mango', value: 'mango' },
    { label: 'Orange', value: 'orange' },
    { label: 'Peach', value: 'peach' },
    { label: 'Strawberry', value: 'strawberry' },
];

const searchFilter = (query: string) =>
    selectOptions.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

const asyncFetchByQuery = (query: string) =>
    new Promise(resolve => setTimeout(() => resolve(searchFilter(query)), 400));

const asyncFetchByValue = (value: string) =>
    new Promise(resolve => setTimeout(() => resolve(selectOptions.find(o => o.value === value)), 200));

export const Showcase = () => {
    return (
        <div className={'flex flex-col'} style={{ gap: 48 }}>

          <div className={'text-[2rem] font-bold'}>MatUI Showcase</div>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Buttons</h2>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Variants</div>
                    <div className={'flex flex-row flex-wrap items-center gap-3'}>
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="tertiary">Tertiary</Button>
                        <Button variant="white">White</Button>
                        <Button variant="black">Black</Button>
                        <Button variant="transparent">Transparent</Button>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Sizes</div>
                    <div className={'flex flex-row flex-wrap items-center gap-3'}>
                        <Button variant="primary" size="sm">Small</Button>
                        <Button variant="primary" size="md">Medium</Button>
                        <Button variant="primary" size="lg">Large</Button>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>With icon</div>
                    <div className={'flex flex-row flex-wrap items-center gap-3'}>
                        <Button variant="primary" Icon={IconPlus}>Create</Button>
                        <Button variant="white" Icon={IconDownload}>Download</Button>
                        <Button variant="black" Icon={IconHeart}>Like</Button>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Loading & disabled</div>
                    <div className={'flex flex-row flex-wrap items-center gap-3'}>
                        <Button variant="primary" loading>Loading</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Icon Buttons</h2>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Square</div>
                    <div className={'flex flex-row flex-wrap items-center gap-3'}>
                        <ButtonIconSquare variant="primary" Icon={IconPlus}/>
                        <ButtonIconSquare variant="secondary" Icon={IconSettings}/>
                        <ButtonIconSquare variant="tertiary" Icon={IconTrash}/>
                        <ButtonIconSquare variant="white" Icon={IconSearch}/>
                        <ButtonIconSquare variant="black" Icon={IconDownload}/>
                        <ButtonIconSquare variant="transparent" Icon={IconHeart}/>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Round</div>
                    <div className={'flex flex-row flex-wrap items-center gap-3'}>
                        <ButtonIconRound variant="primary" Icon={IconPlus}/>
                        <ButtonIconRound variant="secondary" Icon={IconSettings}/>
                        <ButtonIconRound variant="tertiary" Icon={IconTrash}/>
                        <ButtonIconRound variant="white" Icon={IconSearch}/>
                        <ButtonIconRound variant="black" Icon={IconDownload}/>
                        <ButtonIconRound variant="transparent" Icon={IconHeart}/>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Sizes</div>
                    <div className={'flex flex-row flex-wrap items-center gap-3'}>
                        <ButtonIconSquare variant="primary" size="sm" Icon={IconPlus}/>
                        <ButtonIconSquare variant="primary" size="md" Icon={IconPlus}/>
                        <ButtonIconSquare variant="primary" size="lg" Icon={IconPlus}/>
                        <ButtonIconRound variant="primary" size="sm" Icon={IconPlus}/>
                        <ButtonIconRound variant="primary" size="md" Icon={IconPlus}/>
                        <ButtonIconRound variant="primary" size="lg" Icon={IconPlus}/>
                    </div>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Text Inputs</h2>

                <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                    <Input label="Default" placeholder="Enter text..."/>
                    <Input label="With icon" placeholder="Search..." Icon={IconSearch}/>
                    <Input label="With error" placeholder="Enter email..." error="This field is required"/>
                    <Input label="With description" placeholder="Enter text..."
                           description="This is a helpful description"/>
                    <Input label="Disabled" placeholder="Disabled input" disabled/>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Password Input</h2>

                <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                    <InputPassword label="Password" placeholder="Enter password..."/>
                    <InputPassword label="Without toggle" placeholder="Enter password..."
                                   enableShowPasswordToggle={false}/>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Text Area</h2>

                <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                    <InputTextArea label="Default" placeholder="Enter text..."/>
                    <InputTextArea label="With error" placeholder="Enter text..." error="This field is required"/>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Checkbox, Radio & Toggle</h2>

                <div className={'flex flex-col gap-4'}>
                    <InputCheck label="Unchecked" checked={false} readOnly/>
                    <InputCheck label="Checked" checked={true} readOnly/>
                    <InputCheck label="With description" description="A helpful description" checked={false} readOnly/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <InputRadio label="Option A" name="demo-radio" value="a" checked={true} readOnly/>
                    <InputRadio label="Option B" name="demo-radio" value="b" readOnly/>
                    <InputRadio label="Option C" name="demo-radio" value="c" readOnly/>
                </div>

                <div className={'flex flex-col gap-4'}>
                    <InputToggle label="Off" checked={false} readOnly/>
                    <InputToggle label="On" checked={true} readOnly/>
                    <InputToggle label="With description" description="Toggle this setting" checked={true} readOnly/>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Select Inputs</h2>

                <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                    <InputSelectNative
                        label="Native select"
                        options={[
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' },
                        ]}
                    />
                    <InputSelect
                        label="Custom select"
                        placeholder="Choose a fruit..."
                        options={selectOptions}
                        value={null}
                        onChange={() => {}}
                    />
                    <InputSelectSearchable
                        label="Searchable select"
                        placeholder="Search for a fruit..."
                        options={selectOptions}
                        onSearch={searchFilter}
                        value={null}
                        onChange={() => {}}
                    />
                    <InputSelectSearchableAsync
                        label="Async searchable select"
                        placeholder="Search (async)..."
                        fetchOptionsByQuery={asyncFetchByQuery}
                        fetchOptionByValue={asyncFetchByValue}
                        value={null}
                        onChange={() => {}}
                    />
                    <InputSelect
                        label="With error"
                        placeholder="Choose an option..."
                        options={selectOptions}
                        value={null}
                        onChange={() => {}}
                        error="Please select an option"
                    />
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Badges</h2>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Colors</div>
                    <div className={'flex flex-row flex-wrap items-center gap-2'}>
                        <Badge color="red">Red</Badge>
                        <Badge color="orange">Orange</Badge>
                        <Badge color="amber">Amber</Badge>
                        <Badge color="yellow">Yellow</Badge>
                        <Badge color="lime">Lime</Badge>
                        <Badge color="green">Green</Badge>
                        <Badge color="emerald">Emerald</Badge>
                        <Badge color="teal">Teal</Badge>
                        <Badge color="cyan">Cyan</Badge>
                        <Badge color="sky">Sky</Badge>
                        <Badge color="blue">Blue</Badge>
                        <Badge color="indigo">Indigo</Badge>
                        <Badge color="violet">Violet</Badge>
                        <Badge color="purple">Purple</Badge>
                        <Badge color="fuchsia">Fuchsia</Badge>
                        <Badge color="pink">Pink</Badge>
                        <Badge color="rose">Rose</Badge>
                        <Badge color="gray">Gray</Badge>
                        <Badge color="black">Black</Badge>
                        <Badge color="white">White</Badge>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>With icon</div>
                    <div className={'flex flex-row flex-wrap items-center gap-2'}>
                        <Badge color="blue" Icon={IconStar}>Featured</Badge>
                        <Badge color="green" Icon={IconHeart}>Liked</Badge>
                        <Badge color="purple" Icon={IconMail}>Inbox</Badge>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <div className={'text-sm font-semibold text-gray-500'}>Clickable</div>
                    <div className={'flex flex-row flex-wrap items-center gap-2'}>
                        <Badge color="blue" onClick={() => {}}>Click me</Badge>
                        <Badge color="red" onClick={() => {}} showCloseIcon>Removable</Badge>
                        <Badge color="green" onClick={() => {}} Icon={IconPlus}>Add tag</Badge>
                    </div>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Tab Buttons</h2>

                <div className={'flex flex-col gap-4'}>
                    <TabButtons tabs={[
                        { label: 'Overview', active: true },
                        { label: 'Details' },
                        { label: 'Settings' },
                    ]}/>
                    <TabButtons tabs={[
                        { label: 'Home', Icon: IconHome, active: true },
                        { label: 'Users', Icon: IconUser },
                        { label: 'Settings', Icon: IconSettings },
                    ]}/>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Spinner</h2>

                <div className={'flex flex-row items-center gap-6'}>
                    <Spinner className={'h-5 w-5 text-gray-900'}/>
                    <Spinner className={'h-8 w-8 text-blue-600'}/>
                    <Spinner className={'h-12 w-12 text-purple-600'}/>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Tooltip</h2>

                <div className={'flex flex-row items-center gap-6'}>
                    <Tooltip content="This is a tooltip" placement="top">
                        <Button variant="white">Hover me (top)</Button>
                    </Tooltip>
                    <Tooltip content="This is a tooltip" placement="bottom">
                        <Button variant="white">Hover me (bottom)</Button>
                    </Tooltip>
                    <Tooltip content="This is a tooltip" placement="right">
                        <Button variant="white">Hover me (right)</Button>
                    </Tooltip>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Dropdown Menu</h2>

                <div className={'flex flex-row items-start gap-6'}>
                    <DropdownMenu
                        placement="bottom-start"
                        trigger={<Button variant="white" Icon={IconSettings}>Menu</Button>}
                    >
                        <DropdownButton Icon={IconPlus}>Add new</DropdownButton>
                        <DropdownButton Icon={IconDownload}>Download</DropdownButton>
                        <DropdownButton Icon={IconTrash}>Delete</DropdownButton>
                    </DropdownMenu>

                    <DropdownMenu
                        placement="bottom-start"
                        trigger={<ButtonIconSquare variant="white" Icon={IconSettings}/>}
                    >
                        <DropdownButtonGroup label="Actions">
                            <DropdownButton Icon={IconPlus}>Create</DropdownButton>
                            <DropdownButton Icon={IconDownload}>Export</DropdownButton>
                        </DropdownButtonGroup>
                        <DropdownButtonGroup label="Danger" className="mt-2">
                            <DropdownButton Icon={IconTrash}>Delete</DropdownButton>
                        </DropdownButtonGroup>
                    </DropdownMenu>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Modal</h2>

                <ModalDemo/>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Panel</h2>

                <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                    <Panel className={'gap-3!'}>
                        <div className={'text-[1.41rem] font-bold text-gray-900'}>Panel title</div>
                        <div className={'text-gray-500'}>This is a panel component that can contain any content. It
                            provides a bordered card layout with padding and shadow.
                        </div>
                    </Panel>
                </div>
            </section>

            <section className={'flex flex-col'} style={{ gap: 24 }}>
                <h2 className={'text-2xl font-bold text-gray-900'}>Divider</h2>

                <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                    <div className={'text-sm text-gray-500'}>Content above</div>
                    <Divider/>
                    <div className={'text-sm text-gray-500'}>Content below</div>
                </div>

                <div className={'flex flex-row items-center gap-4'} style={{ height: 40 }}>
                    <div className={'text-sm text-gray-500'}>Left</div>
                    <Divider vertical/>
                    <div className={'text-sm text-gray-500'}>Right</div>
                </div>
            </section>
        </div>
    );
};
