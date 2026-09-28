import { BASE_URL, requestHeader } from "@/constants/constants";
import { useAuth, usePreferences } from "@/store/zustand";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

// ── Notifications config ─────────────────────────────────────────────────────
const SafeAreaView = styled(RNSAV);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    handleRegistrationError(
      "Permission not granted to get push token for push notification!",
    );
    return;
  }
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError("Project ID not found");
  }
  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log(pushTokenString);
    return {
      granted: finalStatus,
      pushTokenString,
    };
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
    return null;
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

type NotifItem = {
  key: keyof NotificationPrefs;
  icon: string;
  label: string;
  sublabel: string;
};

type NotificationPrefs = {
  weeklySummary: boolean;
  budgetAlert: boolean;
  paydayReminder: boolean;
};

const NOTIF_ITEMS: NotifItem[] = [
  {
    key: "weeklySummary",
    icon: "bar-chart-outline",
    label: "Weekly summary",
    sublabel: "A recap of your spending every Sunday morning",
  },
  {
    key: "budgetAlert",
    icon: "alert-circle-outline",
    label: "Budget alert",
    sublabel: "Benny nudges you when you hit 75% of your budget",
  },
  {
    key: "paydayReminder",
    icon: "cash-outline",
    label: "Payday reminder",
    sublabel: "A morning heads-up on the day your pay lands",
  },
];

// ── Screen ───────────────────────────────────────────────────────────────────

const NotificationsScreen = () => {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const isOnboarding = from === "onboarding";

  const { notifications, setNotifications } = usePreferences();

  const [systemGranted, setSystemGranted] = useState<boolean | null>(null);
  const [requesting, setRequesting] = useState(false);
  const { token } = useAuth();
  // Check current system permission on mount
  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setSystemGranted(status === "granted");
    });
  }, []);

  const handleRequestPermission = async () => {
    setRequesting(true);
    const res = await registerForPushNotificationsAsync();
    setSystemGranted(res?.granted === "granted");
    console.log(res?.pushTokenString);
    setRequesting(false);

    if (!res?.granted) {
      Alert.alert(
        "Permission required",
        "Benny needs notification access to send you reminders. You can enable it in Settings.",
        [
          { text: "Not now", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  const handleToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    // If turning on a notif but system not granted, prompt first
    if (value && !systemGranted) {
      await handleRequestPermission();
      return;
    }
    setNotifications({ [key]: value });
  };

  const handleSave = () => {
    if (isOnboarding) {
      router.push("/home");
    } else {
      router.back();
    }
  };
  const sendNotiTEST = async () => {
    const res = await fetch(`${BASE_URL}/api/notifications/`, {
      ...requestHeader(token),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        {!isOnboarding && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 -ml-1"
          >
            <Ionicons name="chevron-back" size={26} color="#e61e3f" />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="font-fredoka text-3xl text-text">Notifications</Text>
          <Text className="font-nunito text-sm text-text/40 mt-0.5">
            {isOnboarding ? "Step 5 of 5" : "Manage your alerts"}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Description */}
        <Text className="font-nunito-bold text-base text-text/70 leading-6 mt-6 mb-6">
          {isOnboarding
            ? "Let Benny keep you in the loop — choose what you'd like to hear about. You can always change this later. 🐰"
            : "Choose which alerts Benny sends you."}
        </Text>
        <Pressable onPress={sendNotiTEST}>
          <Text>TEST NOTIFICATION</Text>
        </Pressable>

        {/* System permission banner */}
        {systemGranted === false && (
          <TouchableOpacity
            onPress={handleRequestPermission}
            activeOpacity={0.85}
            className="bg-accent/25 rounded-3xl px-4 py-4 mb-6 flex-row items-center gap-3"
            style={{ borderWidth: 1.5, borderColor: "rgba(237,204,94,0.5)" }}
          >
            <View className="w-9 h-9 rounded-2xl bg-accent/40 items-center justify-center">
              <Ionicons
                name="notifications-off-outline"
                size={18}
                color="#7a6400"
              />
            </View>
            <View className="flex-1">
              <Text className="font-nunito-bold text-sm text-text">
                Notifications are off
              </Text>
              <Text className="font-nunito text-xs text-text/50 mt-0.5">
                Tap to allow Benny to send alerts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c9a52a" />
          </TouchableOpacity>
        )}

        {systemGranted === true && (
          <View
            className="bg-white rounded-3xl px-4 py-3 mb-6 flex-row items-center gap-3"
            style={{ borderWidth: 1.5, borderColor: "rgba(230,30,63,0.08)" }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#e61e3f" />
            <Text className="font-nunito-bold text-sm text-text/60">
              Notifications enabled
            </Text>
          </View>
        )}

        {/* Notification toggles */}
        <Text className="font-nunito-extrabold text-xs text-primary uppercase tracking-widest mb-3">
          Alert types
        </Text>

        <View className="bg-white rounded-3xl overflow-hidden border border-primary/5">
          {NOTIF_ITEMS.map(({ key, icon, label, sublabel }, index) => (
            <View
              key={key}
              className={`flex-row items-center px-4 py-4 ${
                index < NOTIF_ITEMS.length - 1
                  ? "border-b border-primary/5"
                  : ""
              }`}
            >
              {/* Icon */}
              <View className="w-9 h-9 rounded-2xl bg-background items-center justify-center mr-3">
                <Ionicons name={icon as any} size={18} color="#a07080" />
              </View>

              {/* Labels */}
              <View className="flex-1">
                <Text className="font-nunito-bold text-base text-text">
                  {label}
                </Text>
                <Text className="font-nunito text-xs text-text/40 mt-0.5">
                  {sublabel}
                </Text>
              </View>

              {/* Toggle */}
              <Switch
                value={notifications[key]}
                onValueChange={(v) => handleToggle(key, v)}
                trackColor={{ false: "#f0d5da", true: "#e61e3f" }}
                thumbColor="#ffffff"
                disabled={systemGranted === false}
              />
            </View>
          ))}
        </View>

        {/* Settings deep-link hint */}
        {systemGranted === false && (
          <TouchableOpacity
            onPress={() => Linking.openSettings()}
            className="mt-4 flex-row items-center justify-center gap-1"
          >
            <Ionicons name="settings-outline" size={13} color="#cbaab2" />
            <Text className="font-nunito text-xs text-text/30">
              Enable in iOS Settings
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-background"
        style={{ borderTopWidth: 1, borderTopColor: "rgba(230,30,63,0.06)" }}
      >
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          className="bg-primary rounded-full py-4 items-center"
          style={{
            shadowColor: "#e61e3f",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text className="font-fredoka-semibold text-white text-xl tracking-wide">
            {isOnboarding ? "Done — Let's go!" : "Save Changes"}
          </Text>
        </TouchableOpacity>

        {isOnboarding && (
          <TouchableOpacity onPress={handleSave} className="mt-3 items-center">
            <Text className="font-nunito text-xs text-text/30">
              Skip for now
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
