import { DateField, type DateFieldProps } from "@/components/inputs/input-date/DateField.tsx";

export type { Size } from "@/components/inputs/input-date/DateField.tsx";

export type InputDateProps = Omit<DateFieldProps, 'withTime' | 'minuteStep'>;

/* A masked date field with a calendar popover. The value is a local-time Date at midnight. */
export const InputDate = (props: InputDateProps) => {
  const { format = 'dd-MM-yyyy', ...rest } = props;
  return <DateField format={ format } withTime={ false } { ...rest }/>;
};
