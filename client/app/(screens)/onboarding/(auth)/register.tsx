import {
  KeyboardAvoidingView,
  Text,
  Platform,
  Pressable,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { useButtonAnimation } from "@/hooks/useButtonAnimation";

import { theme } from "@/constants/constants";
import { router } from "expo-router";
import { AnimatedInput } from "@/components/UI/Onboarding/OnInput";
import { styled } from "nativewind";
import bennyHi from "../../../../assets/images/benny-hi.png";
import { Image } from "moti";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SafeAreaView = styled(RNSAV);

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const createBtn = useButtonAnimation();
  const loginLink = useButtonAnimation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ── Illustration placeholder ── */}
        <View className="items-center justify-center w-full flex-1 pt-6 pb-2">
          <Image source={bennyHi as any} className="w-full flex-1 aspect-square" />
        </View>

        {/* ── Content ── */}
        <View className="flex-2 px-8 pt-2">
          {/* Heading */}
          <Text
            className="text-center text-3xl font-fredoka-semibold text-text"
            style={{ marginBottom: 4 }}
          >
            Sign up
          </Text>
          <Text
            className="text-center font-nunito text-base mb-6"
            style={{ color: "#6B7280" }}
          >
            Just a few quick things to get started
          </Text>

          {/* Inputs */}
          <AnimatedInput
            placeholder="Email"
            icon="envelope"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AnimatedInput
            placeholder="Username"
            icon="at"
            value={username}
            onChangeText={setUsername}
          />
          <AnimatedInput
            placeholder="Password"
            icon="lock"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Create account CTA */}
          <AnimatedPressable
            style={[
              createBtn.animatedStyle,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 16,
                marginTop: 8,
              },
            ]}
            onPressIn={createBtn.onPressIn}
            onPressOut={createBtn.onPressOut}
            onPress={() => router.push("/home")}
          >
            <Text className="text-white font-nunito-bold text-xl">
              Create account
            </Text>
          </AnimatedPressable>

          {/* Log in link */}
          <View className="flex-row justify-center items-center mt-5 gap-1">
            <Text className="font-nunito text-text">
              Already have an account?
            </Text>
            <AnimatedPressable
              style={loginLink.animatedStyle}
              onPressIn={loginLink.onPressIn}
              onPressOut={loginLink.onPressOut}
              onPress={() => router.push("/onboarding/login")}
            >
              <Text
                className="font-nunito-semibold"
                style={{ color: theme.colors.primary }}
              >
                Log in
              </Text>
            </AnimatedPressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAccount;
