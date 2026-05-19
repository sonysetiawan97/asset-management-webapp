import { Text } from "./Text";

interface TextInputProps {
  name: string;
  label?: string;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
}

export const TextInput = (props: TextInputProps) => <Text {...props} />;