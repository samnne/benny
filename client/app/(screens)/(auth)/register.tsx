import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

import { AnimatedInput } from "@/components/UI/Onboarding/OnInput";
import { auth } from "@/config/firebase";
import { theme } from "@/constants/constants";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Image } from "moti";
import { styled } from "nativewind";
import bennyHi from "../../../assets/images/benny-hi.png";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SafeAreaView = styled(RNSAV);

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (user) {
        router.replace("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const createBtn = useButtonAnimation();
  const loginLink = useButtonAnimation();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* ── Illustration placeholder ── */}
        <View className="items-center justify-center w-full flex-1 pt-6 pb-2">
          <Image
            source={bennyHi as any}
            className="w-full flex-1 aspect-square"
          />
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
            placeholder="Name"
            icon="at"
            value={name}
            onChangeText={setName}
          />
          <AnimatedInput
            placeholder="Email"
            icon="envelope"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
            onPress={() => {
              handleSignUp();
            }}
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateAccount;
