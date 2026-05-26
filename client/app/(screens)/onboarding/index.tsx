import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image, SafeAreaView as RNSAV } from "moti";
import { styled } from "nativewind";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import benny from "../../../assets/images/benny_head.png";
import { router } from "expo-router";
import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import Animated from "react-native-reanimated";
const SafeAreaView = styled(RNSAV);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OnboardingIndex = () => {
  const insets = useSafeAreaInsets();
  const button = useButtonAnimation()
  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <View className="h-80 w-60">
        <Image
          animate={{
            top: [100, -200],
          }}
          transition={{
            type: "spring",
            stiffness: 300,
          }}
          source={benny as any}
          className="w-full relative  flex-1"
        />
      </View>
      <View className="absolute justify-around  left-1/2  items-center -translate-x-1/2 bottom-0 h-4/7 rounded-t-full bg-white w-[150%]">
        <View>
          <Text className="text-4xl text-center  text-text font-nunito-bold">
            Hey, Im{" "}
            <Text className="text-primary font-nunito-black">Benny !</Text>
          </Text>
          <Text className="text-2xl text-center  text-text font-nunito-bold">
            Your friendly budgeting bunny!
          </Text>
          <Text className="text-base pt-12 text-center w-100  text-text ">
            Where I never let your receipts go unnoticed. Never get surprised
            when out shopping!
          </Text>
        </View>

        <AnimatedPressable
          style={button.animatedStyle}
          onPressIn={button.onPressIn}
          onPressOut={button.onPressOut}
          onPress={() => router.push("/(screens)/onboarding/welcome")}
          className=" w-100   rounded-full  justify-center items-center bg-primary py-4 px-2 "
        >
          <Text className="text-background font-bold text-2xl">Hi Benny!</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
};

export default OnboardingIndex;
