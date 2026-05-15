import { InputCheck, Panel } from "@matthiaskrijgsman/mat-ui";

const items: { label: string; checked: boolean }[] = [
  { label: 'Input Text', checked: true },
  { label: 'Input Password (With show Icon)', checked: true },
  { label: 'Input Checkbox', checked: true },
  { label: 'Input Date', checked: false },
  { label: 'Input Time', checked: false },
  { label: 'Input Datetime', checked: false },
  { label: 'Input Textarea', checked: true },
  { label: 'Input Textarea (autogrow)', checked: false },
  { label: 'Input Tags', checked: false },
  { label: 'Input File', checked: false },
  { label: 'Input Radio', checked: true },
  { label: 'Input Toggle', checked: true },
  { label: 'Input Select', checked: true },
  { label: 'Input Select (Native)', checked: true },
  { label: 'Input Searchable Select', checked: true },
  { label: 'Input Searchable Select (API)', checked: true },
  { label: 'Panel', checked: true },
  { label: 'Tabs', checked: true },
  { label: 'Tooltip', checked: true },
  { label: 'Modal (centered)', checked: true },
  { label: 'Modal (sidebar)', checked: true },
  { label: 'Dialog', checked: false },
  { label: 'Popover', checked: true },
  { label: 'Dropdown', checked: true },
  { label: 'Dropdown Buttons', checked: true },
  { label: 'Collapsible', checked: false },
  { label: 'Divider', checked: true },
  { label: 'ScrollArea', checked: true },
  { label: 'Table', checked: false },
  { label: 'DataTable', checked: false },
  { label: 'Table Toolbar', checked: false },
  { label: 'Table Pagination', checked: false },
  { label: 'Status Messages (Error, Warning, Success, Info)', checked: false },
  { label: 'App Notifications', checked: false },
  { label: 'Key Value List', checked: false },
  { label: 'Formik Input Control', checked: false },
  { label: 'Sortable List (Horizontal)', checked: false },
  { label: 'Sortable List (Vertical)', checked: false },
  { label: 'Badge', checked: true },
];

export default function TodoPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col mx-auto w-[600px] gap-12">
        <Panel>
          {items.map((item) => (
            <InputCheck key={item.label} label={item.label} checked={item.checked} readOnly />
          ))}
        </Panel>
      </div>
    </div>
  );
}
