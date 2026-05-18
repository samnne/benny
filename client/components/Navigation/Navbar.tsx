import { View, Image, TouchableOpacity, Text } from "react-native";
import React, { useMemo } from "react";
import navLogo from "@/assets/icons/benny-two.png";
import { SymbolView } from "expo-symbols";
import { theme } from "@/constants/constants";
import { MotiPressable } from "moti/interactions";
import { useRouter } from "expo-router";

const Navbar = () => {
    const router = useRouter()
  return (
    <View className="w-full px-4 flex-row justify-between items-center">
      <View className="flex-1">
        <Image
          source={navLogo}
          resizeMode="contain"
          style={{ width: 60, height: 68 }}
        />
      </View>
      <MotiPressable
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: "50%",
          padding: 10,
        }}
        onPress={() => router.push("/(screens)/price")}
        animate={useMemo(
          () =>
            ({ hovered, pressed }) => {
              "worklet";

              return {
                opacity: hovered || pressed ? 0.5 : 1,
                scale: hovered || pressed ? 1.2 : 1
              };
            },
          [],
        )}
      >
        <SymbolView name="plus" tintColor={theme.colors.background} />
      </MotiPressable>
    </View>
  );
};

export default Navbar;
