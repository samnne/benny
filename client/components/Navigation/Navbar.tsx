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
          source={navLogo}
          resizeMode="contain"
          style={{ width: 60, height: 68 }}
        />
      </View>
      <View className="flex-row justify-center items-center">
        <Text className="text-4xl leading-0 font-nunito-black tracking-wide text-primary">
          BENNY
        </Text>
        <SymbolView name="pawprint" tintColor={theme.colors.primary} size={30} />
      </View>
    </View>
  );
};

export default Navbar;
