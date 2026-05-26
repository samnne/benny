import { theme } from "@/constants/constants";
import { SymbolView } from "expo-symbols";
import { Text, View } from "moti";

interface PillProps {
  label: string;
  value: string | null | undefined;
  symbol?: string;
  accent?: boolean;
}

export const Pill = ({ label, value, symbol, accent }: PillProps) => {
  if (value === null || value === undefined) return null;
  return (
    <View
      className={`flex-row items-center gap-1.5 px-3 py-2 rounded-full border ${
        accent
          ? "bg-primary/10 border-primary/20"
          : "bg-secondary/10 border-secondary/20"
      }`}
    >
      {symbol && (
        <SymbolView
          name={symbol as any}
          size={13}
          tintColor={accent ? theme.colors.primary : theme.colors.secondary}
        />
      )}
      <Text
        className={`text-xs font-nunito-bold uppercase tracking-widest ${
          accent ? "text-primary/60" : "text-secondary/60"
        }`}
      >
        {label}
      </Text>
      <Text
        className={`text-sm font-fredoka-semibold ${
          accent ? "text-primary" : "text-secondary"
        }`}
      >
        {value}
      </Text>
    </View>
  );
};
