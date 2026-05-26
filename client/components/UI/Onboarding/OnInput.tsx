import { theme } from "@/constants/constants";
import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
 
// ─── Input field with a subtle focus ring animation ─────────────────────────
export const AnimatedInput = ({
  placeholder,
  icon,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType,
}: {
  placeholder: string;
  icon: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "email-address" | "default";
}) => {
  const borderColor = useSharedValue(0);
 
  const animatedBorder = useAnimatedStyle(() => ({
    borderWidth: 1.5,
    borderColor:
      borderColor.value === 1
        ? theme.colors.primary   // focused → red accent
        : "#E5E7EB",             // idle   → light grey
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    gap: 10,
    marginBottom: 12,
  }));
 
  return (
    <Animated.View style={animatedBorder}>
      <SymbolView name={icon as any} size={20} tintColor="#9CA3AF" />
      <TextInput
        className="flex-1 text-base font-nunito text-text"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onFocus={() => {
          borderColor.value = withSpring(1, { damping: 15, stiffness: 200 });
        }}
        onBlur={() => {
          borderColor.value = withSpring(0, { damping: 15, stiffness: 200 });
        }}
      />
    </Animated.View>
  );
};