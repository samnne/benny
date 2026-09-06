import { appleProvider, auth } from "@/config/firebase";
import { theme } from "@/constants/constants";
import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Image, SafeAreaView as RNSAV, View } from "moti";
import { styled } from "nativewind";
import { KeyboardAvoidingView, Platform, Pressable, Text } from "react-native";
import Animated from "react-native-reanimated";
import bennyHi from "../../../assets/images/benny-hi.png";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { signInWithCredential } from "@firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
const SafeAreaView = styled(RNSAV);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Register = () => {
  const google = useButtonAnimation();
  const apple = useButtonAnimation();
  const email = useButtonAnimation();
  const login = useButtonAnimation();

  const { request, promptAsync } = useGoogleAuth();
  async function handleGoogle() {
    try {
      await promptAsync();
    } catch (error) {
      console.log(error);
    }
  }
  async function handleAppleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned");
      }

      const authCredential = appleProvider.credential({
        idToken: credential.identityToken,
      });

      const { user } = await signInWithCredential(auth, authCredential);
      console.log("Apple Sign-In successful, user:", user);
    } catch (error: Error | any) {
      if (error.code === "ERR_CANCELED") {
        // Handle that the user canceled the sign-in flow
      }

      console.log(error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 w-full">
          <Image source={bennyHi as any} className="w-full flex-1" />
        </View>
        <View className="flex-1 w-full items-center">
          <Text className="text-center text-4xl font-nunito">
            Let&apos;s get started shall we?
          </Text>
          <View className="p-8 gap-4">
            <AnimatedPressable
              style={google.animatedStyle}
              onPressIn={google.onPressIn}
              onPressOut={google.onPressOut}
              onPress={() => handleGoogle()}
              disabled={!request}
              className="ob-button bg-primary"
            >
              <FontAwesome name="google" size={25} color={theme.colors.pill} />
              <Text className="text-white leading-none font-nunito-bold text-2xl">
                Continue with Google
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={apple.animatedStyle}
              onPressIn={apple.onPressIn}
              onPressOut={apple.onPressOut}
              onPress={() => handleAppleSignIn()}
              className="ob-button bg-black"
            >
              <SymbolView
                name="applelogo"
                tintColor={theme.colors.pill}
                size={25}
              />
              <Text className="text-white leading-none font-nunito-bold text-2xl">
                Continue with Apple
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={email.animatedStyle}
              onPressIn={email.onPressIn}
              onPressOut={email.onPressOut}
              onPress={() => router.push("/(screens)/(auth)/register")}
              className="ob-button bg-secondary"
            >
              <SymbolView
                name="envelope"
                tintColor={theme.colors.pill}
                size={25}
              />
              <Text className="text-white leading-none font-nunito-bold text-2xl">
                Continue with Email
              </Text>
            </AnimatedPressable>

            <View className="flex-row gap-2 justify-center">
              <Text className="text-text font-nunito">
                Already have an account?
              </Text>
              <AnimatedPressable
                style={login.animatedStyle}
                onPressIn={login.onPressIn}
                onPressOut={login.onPressOut}
                onPress={() => router.push("/(screens)/(auth)/login")}
              >
                <Text className="font-nunito-semibold text-primary">
                  Log in
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
