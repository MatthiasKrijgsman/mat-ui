import { useEffect, useMemo, useState } from "react";
import {
    AutoScroll,
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
    Panel,
    PanelField,
    PanelLink,
    PanelStack,
    Spinner,
    TabButtons,
    Tooltip,
} from "../../src";
import { Table, type TableColumnDef, type TableSortState } from "../../src/table/Table";
import {
    IconDownload,
    IconHeart,
    IconHome,
    IconMail,
    IconMoon,
    IconPlus,
    IconSearch,
    IconSettings,
    IconStar,
    IconSun,
    IconTrash,
    IconUser,
} from "@tabler/icons-react";
import { ModalDemo } from "./ModalDemo";
import { SidebarModalDemo } from "./SidebarModalDemo";

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

type DemoUser = {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    status: 'active' | 'invited' | 'suspended';
};

const demoUsers: DemoUser[] = [
    { id: 1, name: 'Ada Lovelace',     email: 'ada@example.com',     role: 'Admin',  status: 'active' },
    { id: 2, name: 'Alan Turing',      email: 'alan@example.com',    role: 'Editor', status: 'active' },
    { id: 3, name: 'Grace Hopper',     email: 'grace@example.com',   role: 'Admin',  status: 'invited' },
    { id: 4, name: 'Linus Torvalds',   email: 'linus@example.com',   role: 'Editor', status: 'active' },
    { id: 5, name: 'Margaret Hamilton',email: 'margaret@example.com',role: 'Viewer', status: 'suspended' },
    { id: 6, name: 'Donald Knuth',     email: 'donald@example.com',  role: 'Viewer', status: 'active' },
    { id: 7, name: 'Edsger Dijkstra',  email: 'edsger@example.com',  role: 'Editor', status: 'invited' },
];

const statusBadgeColor: Record<DemoUser['status'], 'green' | 'amber' | 'red'> = {
    active: 'green',
    invited: 'amber',
    suspended: 'red',
};

const demoColumns: TableColumnDef<DemoUser>[] = [
    { id: 'name',   header: 'Name',   sortable: true, defaultWidth: 220, renderCell: (row) => row.name },
    { id: 'email',  header: 'Email',  sortable: true, defaultWidth: 280, renderCell: (row) => row.email },
    { id: 'role',   header: 'Role',   sortable: true, defaultWidth: 140, renderCell: (row) => row.role },
    { id: 'status', header: 'Status', sortable: true, defaultWidth: 140, renderCell: (row) => (
        <Badge color={statusBadgeColor[row.status]}>{row.status}</Badge>
    )},
];

export const Showcase = () => {
    const [dark, setDark] = useState(false);
    const [tableSort, setTableSort] = useState<TableSortState | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeFileSm, setResumeFileSm] = useState<File | null>(null);
    const [resumeFileLg, setResumeFileLg] = useState<File | null>(null);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [messages, setMessages] = useState<string[]>([
        'Welcome to the AutoScroll demo.',
        'Click the button below to add a new message.',
    ]);

    const handleAddMessage = () => {
        setMessages((prev) => [...prev, `Message ${prev.length + 1} — ${new Date().toLocaleTimeString()}`]);
    };

    const fakeUpload = (file: File) =>
        new Promise<void>((resolve) => {
            setTimeout(() => {
                setUploadedUrls((prev) => [...prev, `https://cdn.example.com/${file.name}`]);
                resolve();
            }, 1500);
        });

    const sortedDemoUsers = useMemo(() => {
        if (!tableSort) return demoUsers;
        const { columnId, direction } = tableSort;
        return [...demoUsers].sort((a, b) => {
            const av = String((a as Record<string, unknown>)[columnId] ?? '');
            const bv = String((b as Record<string, unknown>)[columnId] ?? '');
            return direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
    }, [tableSort]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        return () => { document.documentElement.classList.remove('dark'); };
    }, [dark]);

    return (
        <div className={'flex flex-col transition-colors duration-300 p-8 rounded-2xl'} style={{ gap: 48 }}>

                <div className={'flex flex-row items-center justify-between'}>
                    <div className={'text-[2rem] font-bold text-gray-900 dark:text-gray-100'}>MatUI Showcase</div>
                    <Button
                        variant="white"
                        Icon={dark ? IconSun : IconMoon}
                        onClick={() => setDark(d => !d)}
                    >
                        {dark ? 'Light mode' : 'Dark mode'}
                    </Button>
                </div>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Buttons</h2>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Variants</div>
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
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Sizes</div>
                        <div className={'flex flex-row flex-wrap items-center gap-3'}>
                            <Button variant="primary" size="sm">Small</Button>
                            <Button variant="primary" size="md">Medium</Button>
                            <Button variant="primary" size="lg">Large</Button>
                        </div>
                    </div>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>With icon</div>
                        <div className={'flex flex-row flex-wrap items-center gap-3'}>
                            <Button variant="primary" Icon={IconPlus}>Create</Button>
                            <Button variant="white" Icon={IconDownload}>Download</Button>
                            <Button variant="black" Icon={IconHeart}>Like</Button>
                        </div>
                    </div>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Loading & disabled</div>
                        <div className={'flex flex-row flex-wrap items-center gap-3'}>
                            <Button variant="primary" loading>Loading</Button>
                            <Button variant="primary" disabled>Disabled</Button>
                        </div>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Icon Buttons</h2>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Square</div>
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
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Round</div>
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
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Sizes</div>
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
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Text Inputs</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                        <Input label="Default" placeholder="Enter text..."/>
                        <Input label="With icon" placeholder="Search..." Icon={IconSearch}/>
                        <Input label="With error" placeholder="Enter email..." error="This field is required"/>
                        <Input label="With description" placeholder="Enter text..."
                               description="This is a helpful description"/>
                        <Input label="Disabled" placeholder="Disabled input" disabled/>
                    </div>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Sizes</div>
                        <div className={'flex flex-col gap-3'} style={{ maxWidth: 400 }}>
                            <Input size="sm" label="Small" placeholder="Small input..." Icon={IconSearch}/>
                            <Input size="md" label="Medium" placeholder="Medium input..." Icon={IconSearch}/>
                            <Input size="lg" label="Large" placeholder="Large input..." Icon={IconSearch}/>
                        </div>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Password Input</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                        <InputPassword label="Password" placeholder="Enter password..."/>
                        <InputPassword label="Without toggle" placeholder="Enter password..."
                                       enableShowPasswordToggle={false}/>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Text Area</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                        <InputTextArea label="Default" placeholder="Enter text..."/>
                        <InputTextArea label="With error" placeholder="Enter text..." error="This field is required"/>
                        <InputTextArea label="Autogrow" placeholder="Type to grow..." autogrow/>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>File Input</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                        <InputFileSingle
                            label="Résumé"
                            description="PDF or DOCX, up to 5 MB"
                            accept={{
                                'application/pdf': ['.pdf'],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                            }}
                            maxSize={5 * 1024 * 1024}
                            value={resumeFile}
                            onChange={setResumeFile}
                            isUploading={false}
                            isUploaded={true}
                        />
                        <InputFileSingle
                            label="With error"
                            value={null}
                            onChange={() => {}}
                            error="Please upload your résumé"
                        />
                        <InputFileSingle
                            label="Disabled"
                            value={null}
                            onChange={() => {}}
                            disabled
                        />
                    </div>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Sizes</div>
                        <div className={'flex flex-col gap-3'} style={{ maxWidth: 400 }}>
                            <InputFileSingle
                                size="sm"
                                label="Small"
                                value={resumeFileSm}
                                onChange={setResumeFileSm}
                            />
                            <InputFileSingle
                                size="md"
                                label="Medium"
                                value={resumeFile}
                                onChange={setResumeFile}
                            />
                            <InputFileSingle
                                size="lg"
                                label="Large"
                                value={resumeFileLg}
                                onChange={setResumeFileLg}
                            />
                        </div>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>File Input (Multiple)</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 600 }}>
                        <InputFileMultiple
                            label="Attachments"
                            hint="PNG, JPG, PDF, ZIP · up to 50.0 MB"
                            accept={{
                                'image/png': ['.png'],
                                'image/jpeg': ['.jpg', '.jpeg'],
                                'application/pdf': ['.pdf'],
                                'application/zip': ['.zip'],
                            }}
                            maxSize={50 * 1024 * 1024}
                            onUpload={fakeUpload}
                            onFileRemoved={(file) =>
                                setUploadedUrls((prev) =>
                                    prev.filter((u) => u !== `https://cdn.example.com/${file.name}`),
                                )
                            }
                        />

                        <InputFileMultiple
                            label="With error"
                            error="At least one attachment is required"
                        />

                        <InputFileMultiple
                            label="Disabled"
                            disabled
                        />
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Checkbox, Radio & Toggle</h2>

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
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Select Inputs</h2>

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

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Sizes</div>
                        <div className={'flex flex-col gap-3'} style={{ maxWidth: 400 }}>
                            <InputSelect
                                size="sm"
                                label="Small"
                                placeholder="Small select..."
                                options={selectOptions}
                                value={null}
                                onChange={() => {}}
                            />
                            <InputSelect
                                size="md"
                                label="Medium"
                                placeholder="Medium select..."
                                options={selectOptions}
                                value={null}
                                onChange={() => {}}
                            />
                            <InputSelect
                                size="lg"
                                label="Large"
                                placeholder="Large select..."
                                options={selectOptions}
                                value={null}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Badges</h2>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Colors</div>
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
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>With icon</div>
                        <div className={'flex flex-row flex-wrap items-center gap-2'}>
                            <Badge color="blue" Icon={IconStar}>Featured</Badge>
                            <Badge color="green" Icon={IconHeart}>Liked</Badge>
                            <Badge color="purple" Icon={IconMail}>Inbox</Badge>
                        </div>
                    </div>

                    <div className={'flex flex-col gap-3'}>
                        <div className={'text-sm font-semibold text-gray-500 dark:text-gray-400'}>Clickable</div>
                        <div className={'flex flex-row flex-wrap items-center gap-2'}>
                            <Badge color="blue" onClick={() => {}}>Click me</Badge>
                            <Badge color="red" onClick={() => {}} showCloseIcon>Removable</Badge>
                            <Badge color="green" onClick={() => {}} Icon={IconPlus}>Add tag</Badge>
                        </div>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Tab Buttons</h2>

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
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Spinner</h2>

                    <div className={'flex flex-row items-center gap-6'}>
                        <Spinner className={'h-5 w-5 text-gray-900 dark:text-gray-100'}/>
                        <Spinner className={'h-8 w-8 text-blue-600 dark:text-blue-400'}/>
                        <Spinner className={'h-12 w-12 text-purple-600 dark:text-purple-400'}/>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Tooltip</h2>

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
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Dropdown Menu</h2>

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
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Modal</h2>

                    <ModalDemo/>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Sidebar Modal</h2>

                    <SidebarModalDemo/>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Panel</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                        <Panel className={'gap-3!'}>
                            <div className={'text-[1.41rem] font-bold text-gray-900 dark:text-gray-100'}>Panel title</div>
                            <div className={'text-gray-500 dark:text-gray-400'}>This is a panel component that can contain any content. It
                                provides a bordered card layout with padding and shadow.
                            </div>
                        </Panel>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Panel Stack</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                        <PanelStack>
                            <PanelLink Icon={IconHome} href={'#home'}>Home</PanelLink>
                            <Divider/>
                            <PanelLink Icon={IconUser} onClick={() => console.log('profile clicked')}>Profile</PanelLink>
                            <Divider/>
                            <PanelLink Icon={IconSettings} onClick={() => console.log('settings clicked')}>Settings</PanelLink>
                            <Divider/>
                            <PanelLink onClick={() => console.log('logout clicked')}>Sign out</PanelLink>
                        </PanelStack>

                        <PanelStack>
                            <PanelLink Icon={IconUser} status={'error'} onClick={() => {}}>Account verification failed</PanelLink>
                            <Divider/>
                            <PanelLink Icon={IconSettings} status={'warning'} onClick={() => {}}>Storage almost full</PanelLink>
                            <Divider/>
                            <PanelLink Icon={IconDownload} status={'success'} onClick={() => {}}>Backup complete</PanelLink>
                            <Divider/>
                            <PanelLink Icon={IconMail} status={'info'} onClick={() => {}}>3 unread messages</PanelLink>
                        </PanelStack>

                        <PanelStack>
                            <PanelField label={'Name'} orientation={'horizontal'}>Matthias Krijgsman</PanelField>
                            <Divider/>
                            <PanelField label={'Email'} orientation={'horizontal'}>matthiaskrijgsman@gmail.com</PanelField>
                            <Divider/>
                            <PanelField label={'A very long label that should clamp'} orientation={'horizontal'}>
                                A correspondingly long value that should also clamp to a single line and break-all
                            </PanelField>
                            <Divider/>
                            <PanelField label={'Bio'}>
                                Vertical orientation puts the label on top and the value below.
                            </PanelField>
                        </PanelStack>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Table</h2>

                    <div style={{ height: 360 }}>
                        <Table
                            columns={demoColumns}
                            rows={sortedDemoUsers}
                            getRowId={(row) => row.id}
                            onRowClick={(row) => console.log('row clicked', row)}
                            sort={tableSort}
                            onSortChange={setTableSort}
                        />
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Auto Scroll</h2>

                    <div className={'flex flex-col gap-4 h-[400px]'} style={{ maxWidth: 400 }}>
                        <Panel className={'p-0! h-full! min-h-0'}>
                            <AutoScroll
                              className={'p-4 h-full mat-ui-hide-scrollbars'}
                            >
                                <div className={'flex flex-col gap-4'}>
                                    {messages.map((message, index) => (
                                      <div
                                        key={index}
                                        className={'text-sm text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3'}
                                      >
                                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                      </div>
                                    ))}
                                </div>
                            </AutoScroll>
                        </Panel>
                        <Button variant={'primary'} Icon={IconPlus} onClick={handleAddMessage}>
                            Add message
                        </Button>
                    </div>
                </section>

                <section className={'flex flex-col'} style={{ gap: 24 }}>
                    <h2 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Divider</h2>

                    <div className={'flex flex-col gap-4'} style={{ maxWidth: 400 }}>
                        <div className={'text-sm text-gray-500 dark:text-gray-400'}>Content above</div>
                        <Divider/>
                        <div className={'text-sm text-gray-500 dark:text-gray-400'}>Content below</div>
                    </div>

                    <div className={'flex flex-row items-center gap-4'} style={{ height: 40 }}>
                        <div className={'text-sm text-gray-500 dark:text-gray-400'}>Left</div>
                        <Divider vertical/>
                        <div className={'text-sm text-gray-500 dark:text-gray-400'}>Right</div>
                    </div>
                </section>
            </div>
    );
};
