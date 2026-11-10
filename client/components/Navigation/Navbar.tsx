import { View, Image, TouchableOpacity, Text } from "react-native";
import React, { useMemo } from "react";
import navLogo from "@/assets/icons/benny-two.png";
import { SymbolView } from "expo-symbols";
import { theme } from "@/constants/constants";
import { MotiPressable } from "moti/interactions";
import { useRouter } from "expo-router";

const Navbar = () => {
  const router = useRouter();
  return (
    <View className="w-full px-4 flex-row justify-between items-center">
      <View className="flex-1">
        <Image
          source={navLogo as any}
          resizeMode="contain"
          style={{ width: 60, height: 68 }}
        />
      </View>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity
          onPress={() => router.push("/(screens)/payday/payday")}
          accessibilityRole="button"
          accessibilityLabel="Log a paycheck"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <SymbolView
            name="banknote"
            tintColor={theme.colors.primary}
            size={32}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(screens)/new")}
          accessibilityRole="button"
          accessibilityLabel="Create new receipt"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <SymbolView
            name="doc.viewfinder"
            tintColor={theme.colors.primary}
            size={32}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;
