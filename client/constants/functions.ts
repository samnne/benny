import * as Haptics from "expo-haptics";
import {
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
} from "expo-notifications";
import { Platform } from "react-native";

/** Stable identifier so the payday reminder is only ever scheduled once. */
export const PAYDAY_REMINDER_ID = "benny.payday-reminder";

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

export async function scheduleLocalNotification(waitTime = 5) {
  await scheduleNotificationAsync({
    content: {
      title: "It's Benny, you got paid today!",
      body: "Log it today to not lose track!",
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: waitTime, // Firing after 5 seconds
    },
  });
}

// ── Payday reminder ──────────────────────────────────────────────────────────

type SchedulePaydayOptions = {
  /** Change this to keep multiple independent payday reminders. */
  identifier?: string;
  /** Local hour to fire at (24h). Defaults to 9 AM. */
  hour?: number;
  minute?: number;
  title?: string;
  body?: string;
};

/**
 * Schedules a one-off reminder for the given next payday.
 *
 * Only one notification per `identifier` is kept:
 * - if it's already scheduled for the same day, nothing happens (no duplicates)
 * - if the payday moved, the stale reminder is replaced
 *
 * Returns the notification identifier, or `null` when nothing was scheduled
 * (invalid/past date).
 */
export async function schedulePaydayReminder(
  nextPayday: string,
  {
    identifier = PAYDAY_REMINDER_ID,
    hour = 9,
    minute = 0,
    title = "It's payday! 🎉",
    body = "Your pay should land today. Log it now so you don't lose track.",
  }: SchedulePaydayOptions = {},
): Promise<string | null> {
  const payday = new Date(`${nextPayday}T00:00:00`);
  if (Number.isNaN(payday.getTime())) return null;

  payday.setHours(hour, minute, 0, 0);
  if (payday.getTime() <= Date.now()) return null;

  const scheduled = await getAllScheduledNotificationsAsync();
  const existing = scheduled.find((n) => n.identifier === identifier);

  if (existing) {
    // The scheduled date lives in the content payload so this check works on
    // both iOS and Android (their native triggers read back differently).
    if (existing.content.data?.nextPayday === nextPayday) {
      // Already scheduled for this exact payday — don't create a duplicate.
      return existing.identifier;
    }
    // The payday changed, so replace the old reminder.
    await cancelScheduledNotificationAsync(identifier);
  }

  return scheduleNotificationAsync({
    identifier,
    content: {
      title,
      body,
      sound: true,
      data: { type: "payday-reminder", nextPayday },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: payday,
    },
  });
}