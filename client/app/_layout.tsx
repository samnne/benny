import { ErrorBoundaryProps, Stack } from "expo-router";
import "react-native-reanimated";
import "../globals.css";

import { useFonts } from "expo-font";
import { Text } from "moti";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-3 text-center text-2xl font-bold text-gray-900">
        Something went wrong
      </Text>
      <Text className="mb-6 text-center text-base text-gray-600">
        {error.message}
      </Text>
      <Pressable
        className="rounded-xl bg-blue-600 px-6 py-3 active:bg-blue-700"
        onPress={retry}
      >
        <Text className="text-base font-semibold text-white">Try Again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Fredoka-Bold": require("@/assets/fonts/Fredoka-Bold.ttf"),
    "Fredoka-Light": require("@/assets/fonts/Fredoka-Light.ttf"),
    "Fredoka-Medium": require("@/assets/fonts/Fredoka-Medium.ttf"),
    "Fredoka-Regular": require("@/assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka-SemiBold": require("@/assets/fonts/Fredoka-SemiBold.ttf"),
    "Nunito-Black": require("@/assets/fonts/Nunito-Black.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("@/assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-ExtraLight": require("@/assets/fonts/Nunito-ExtraLight.ttf"),
    "Nunito-Light": require("@/assets/fonts/Nunito-Light.ttf"),
    "Nunito-Medium": require("@/assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Regular": require("@/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("@/assets/fonts/Nunito-SemiBold.ttf"),
  });
  useEffect(() => {
    if (fontError) {
      console.log("Font error", fontError);
    }
  }, [fontError]);

  return (
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
