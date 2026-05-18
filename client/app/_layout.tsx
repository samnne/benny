import { Stack } from "expo-router";
import "../globals.css";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
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
  if (!fontsLoaded){
    alert("Fonts Failed to Load")
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
