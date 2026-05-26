import { theme } from "@/constants/constants";
import { TextInput } from "react-native";

export function FieldInput({
  text,
  setText,
  className,
  onChange,
}: {
  text: string;
  className: string;
  setText: (text: string) => void;
  onChange: (text: string) => void;
}) {
  return (
    <TextInput
      value={text}
      hitSlop={12}
      onChangeText={onChange}
      className={className}
      placeholder="Total"
      
      placeholderClassName="text-primary leading-none "
      placeholderTextColor={theme.colors.primary + "40"}
    />
  );
}
