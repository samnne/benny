import { Text, View } from "moti";
import { TextInput, type TextInputProps } from "react-native";

type AccountFieldProps = TextInputProps & {
  label: string;
};

export const AccountField = ({
  label,
  className,
  ...props
}: AccountFieldProps) => (
  <View className="mb-3">
    <Text className="font-nunito-semibold text-xs text-text/60 mb-1 ml-1">
      {label}
    </Text>
    <TextInput
      className={`border border-primary/15 rounded-2xl px-4 py-3 font-nunito text-text bg-background/40 ${
        className ?? ""
      }`}
      placeholderTextColor="#cbaab2"
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  </View>
);
