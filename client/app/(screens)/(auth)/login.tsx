import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

import { AnimatedInput } from "@/components/UI/Onboarding/OnInput";
import { theme } from "@/constants/constants";
import { router } from "expo-router";
import { Image } from "moti";
import { styled } from "nativewind";

import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import bennyHi from "../../../assets/images/benny-hi.png";
const SafeAreaView = styled(RNSAV);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Screen ─────────────────────────────────────────────────────────────────
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginBtn = useButtonAnimation();
  const signUpLink = useButtonAnimation();
  const forgotLink = useButtonAnimation();

  async function handleLogin() {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        router.replace("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1">
          {/* ── Illustration placeholder ── */}
          <View className="items-center justify-center w-full flex-1 pt-6 pb-2">
            <Image
              source={bennyHi as any}
              className="w-full h-100 flex-1 aspect-square"
            />
          </View>

          {/* ── Content ── */}
          <View className="flex-1 px-8 pt-2">
            {/* Heading */}
            <Text
              className="text-center text-3xl font-fredoka-semibold text-text"
              style={{ marginBottom: 4 }}
            >
              Login
            </Text>
            <Text
              className="text-center font-nunito text-base mb-6"
              style={{ color: "#6B7280" }}
            >
              Hello, welcome back
            </Text>

            {/* Inputs */}
            <AnimatedInput
              placeholder="Name"
              icon="envelope"
              value={email}
              onChangeText={setEmail}
            />
            <AnimatedInput
              placeholder="Password"
              icon="lock"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Forgot password */}
            <AnimatedPressable
              style={[
                forgotLink.animatedStyle,
                { alignSelf: "flex-end", marginBottom: 16, marginTop: -4 },
              ]}
              onPressIn={forgotLink.onPressIn}
              onPressOut={forgotLink.onPressOut}
              onPress={() => router.push("/forgot-password")}
            >
              <Text
                className="font-nunito-semibold text-sm"
                style={{ color: theme.colors.primary }}
              >
                Forgot password?
              </Text>
            </AnimatedPressable>

            {/* Log in CTA */}
            <AnimatedPressable
              style={[
                loginBtn.animatedStyle,
                {
                  backgroundColor: theme.colors.primary,
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  marginTop: 0,
                },
              ]}
              onPressIn={loginBtn.onPressIn}
              onPressOut={loginBtn.onPressOut}
              onPress={() => {
                handleLogin();
              }}
            >
              <Text className="text-white font-nunito-bold text-xl">
                Log in
              </Text>
            </AnimatedPressable>

            {/* Sign up link */}
            <View className="flex-row justify-center items-center mt-5 gap-1">
              <Text className="font-nunito text-text">
                Don&apos;t have an account?
              </Text>
              <AnimatedPressable
                style={signUpLink.animatedStyle}
                onPressIn={signUpLink.onPressIn}
                onPressOut={signUpLink.onPressOut}
                onPress={() => router.push("/onboarding/register")}
              >
                <Text
                  className="font-nunito-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  Sign Up
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Login;
