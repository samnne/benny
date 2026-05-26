import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView as RNSAV } from "moti";
import { styled } from "nativewind";

import { SymbolView } from "expo-symbols";
import { theme } from "@/constants/constants";
import { Image } from "expo-image";

import { router } from "expo-router";
const SafeAreaView = styled(RNSAV);
const Confirm = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary/50">
      <View className="absolute bg-white bottom-0 w-full h-50 rounded-4xl">
        <View className=" p-4 items-center gap-4 flex-row w-full ">
          <Image
            source={require("../../../assets/icons/benny-two.png")}
            style={{
              width: 50,
              height: 50,
            }}
          />
          <Text className="font-nunito-bold text-xl">
            This photo looks incredible!
            <Text className="font-nunito text-xl ">
              {" "}
              Send it {"\n"}over and I&apos;ll hop right to it!
            </Text>
          </Text>
        </View>
        <View className="flex-row p-4  ">
          <TouchableOpacity
            onPress={() => {
              router.push("/receipt/loading");
            }}
            activeOpacity={0.9}
            className="p-4 gap-2 flex-row w-full justify-center items-center rounded-full bg-primary"
          >
            <SymbolView name="paperplane" tintColor={theme.colors.background} />
            <Text className="text-2xl text-background font-nunito-bold">
              Use This Photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Confirm;
