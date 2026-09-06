import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";

import { Ionicons } from "@expo/vector-icons";

// ── Types ────────────────────────────────────────────────────────────────────

type SettingsRowProps = {
  icon: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  destructive?: boolean;
};



// ── Sub-components ───────────────────────────────────────────────────────────

export const Row = ({ icon, label, sublabel, onPress, right, destructive }: SettingsRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    className="flex-row items-center px-4 py-4 border-b border-primary/5 last:border-0"
  >
    <View className={`w-9 h-9 rounded-2xl items-center justify-center mr-3 ${destructive ? "bg-primary/10" : "bg-background"}`}>
      <Ionicons name={icon as any} size={18} color={destructive ? "#e61e3f" : "#a07080"} />
    </View>
    <View className="flex-1">
      <Text className={`font-nunito-bold text-base ${destructive ? "text-primary" : "text-text"}`}>
        {label}
      </Text>
      {sublabel && (
        <Text className="font-nunito text-xs text-text/40 mt-0.5">{sublabel}</Text>
      )}
    </View>
    {right ?? (onPress && <Ionicons name="chevron-forward" size={16} color="#cbaab2" />)}
  </TouchableOpacity>
);