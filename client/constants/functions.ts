import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
export function playHaptic() {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}
