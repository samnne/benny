import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
export function playHaptic() {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function getDaysUntil(targetDateString: string | null): number {
  // Get today's date at midnight local time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse the target date (e.g., "2026-09-11") at midnight local time
  const targetDate = new Date(`${targetDateString}T00:00:00`);

  // Calculate the difference in milliseconds
  const diffInMs = targetDate.getTime() - today.getTime();

  // Convert milliseconds back to days (1000ms * 60s * 60m * 24h)
  const msInADay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.ceil(diffInMs / msInADay);

  // Return 0 if the date has already passed
  return diffInDays > 0 ? diffInDays : 0;
}