import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "moti";
import { TouchableOpacity } from "react-native";


export const ChattinessRow = ({ value, onChange }: { value: number; onChange: (v: any) => void }) => {
  const levels = ["Quiet", "Friendly", "Chatty"];
  return (
    <View className="px-4 py-4">
      <View className="flex-row items-center mb-3">
        <View className="w-9 h-9 rounded-2xl items-center justify-center mr-3 bg-background">
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#a07080" />
        </View>
        <View className="flex-1">
          <Text className="font-nunito-bold text-base text-text">Benny's personality</Text>
          <Text className="font-nunito text-xs text-text/40 mt-0.5">How often Benny cheers you on</Text>
        </View>
      </View>
      <View className="flex-row justify-between gap-2 ml-12">
        {levels.map((label, i) => (
          <TouchableOpacity
            key={label}
            onPress={() => onChange(i)}
            className={`flex-1 py-2 rounded-full items-center border ${
              value === i
                ? "bg-primary border-primary"
                : "bg-transparent border-primary/15"
            }`}
          >
            <Text className={`font-nunito-bold text-xs ${value === i ? "text-white" : "text-text/50"}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};