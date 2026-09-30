import { DateField, type DateFieldProps } from "@/components/inputs/input-date/DateField.tsx";

export type { Size } from "@/components/inputs/input-date/DateField.tsx";

export type InputDateTimeProps = Omit<DateFieldProps, 'withTime'>;

/* InputDate plus a time of day: the mask gains `HH:mm` and the picker gains hour and minute columns. */
export const InputDateTime = (props: InputDateTimeProps) => {
  const { format = 'dd-MM-yyyy HH:mm', ...rest } = props;
  return <DateField format={ format } withTime={ true } { ...rest }/>;
};
