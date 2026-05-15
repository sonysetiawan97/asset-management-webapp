export interface ListOption<
  Value,
  Label extends React.ReactNode = React.ReactNode
> {
  value: Value;
  label: Label;
}
