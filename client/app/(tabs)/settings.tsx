import Navbar from "@/components/Navigation/Navbar";
import { ChattinessRow } from "@/components/UI/Settings/ChattinessRow";
import { Row } from "@/components/UI/Settings/Row";
import { Section } from "@/components/UI/Settings/Section";
import { ToggleRow } from "@/components/UI/Settings/ToggleRow";
import { auth } from "@/config/firebase";
import { usePreferences } from "@/store/zustand";
import { router } from "expo-router";

import { styled } from "nativewind";
import * as Application from "expo-application";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSAV);

const PAY_FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  semimonthly: "Semi-monthly",
  monthly: "Monthly",
};

const Settings = () => {
  const { currentUser } = auth;

  const {
    payFrequency,
    nextPayday,
    budgetPerPeriod,
    chattiness,
    notifications,
    setChattiness,
    setNotifications,
  } = usePreferences();

  const paydayLabel = nextPayday
    ? `${PAY_FREQUENCY_LABELS[payFrequency]} · Next Payday ${new Date(`${nextPayday}T00:00:00`).toDateString()}`
    : PAY_FREQUENCY_LABELS[payFrequency];
  
  const handleSignOut = () => {
    auth.signOut();
    router.replace("/(screens)/onboarding");
  };

  const handleExportData = () => {
    Alert.alert("Export receipts", "Mock export: your receipts CSV is ready.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "Mock action: your account and data would be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 16 }}>
      <Navbar />
      <View className="px-5 pt-2 pb-4">
        <Text className="font-fredoka-semibold text-6xl text-text">
          Settings
        </Text>
        <Text className="font-nunito text-sm text-text/40 mt-0.5">
          {currentUser?.email}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Section title="Profile">
          <Row
            icon="person-outline"
            label="Name"
            sublabel={currentUser?.displayName ?? "—"}
            onPress={() => {}}
          />
          <Row
            icon="mail-outline"
            label="Email"
            sublabel={currentUser?.email ?? "—"}
            onPress={() => {}}
          />
          <Row
            icon="lock-closed-outline"
            label="Change password"
            onPress={() => {}}
          />
          <Row
            icon="log-out-outline"
            label="Sign out"
            destructive
            onPress={handleSignOut}
          />
        </Section>

        <Section title="Pay Period">
          <Row
            icon="calendar-outline"
            label="Pay frequency"
            sublabel={paydayLabel}
            onPress={() => router.push("/(screens)/onboarding/pay-period")}
          />
        </Section>

        <Section title="Spending Goal">
          <Row
            icon="wallet-outline"
            label="Budget per pay period"
            sublabel={`$${budgetPerPeriod.toLocaleString()}`}
            onPress={() => router.push("/(screens)/onboarding/spending-goal")}
          />
        </Section>

        <Section title="Benny">
          <ChattinessRow value={chattiness} onChange={setChattiness} />
        </Section>

        <Section title="Notifications">
          <ToggleRow
            icon="bar-chart-outline"
            label="Weekly summary"
            sublabel="Every Sunday morning"
            value={notifications.weeklySummary}
            onChange={(v) => setNotifications({ weeklySummary: v })}
          />
          <ToggleRow
            icon="alert-circle-outline"
            label="Budget alert"
            sublabel="When you hit 75% of your limit"
            value={notifications.budgetAlert}
            onChange={(v) => setNotifications({ budgetAlert: v })}
          />
          <ToggleRow
            icon="cash-outline"
            label="Payday reminder"
            sublabel="The morning your pay lands"
            value={notifications.paydayReminder}
            onChange={(v) => setNotifications({ paydayReminder: v })}
          />
        </Section>

        <Section title="Data">
          <Row
            icon="download-outline"
            label="Export receipts as CSV"
            onPress={handleExportData}
          />
          <Row
            icon="trash-outline"
            label="Delete account"
            sublabel="Removes all your data permanently"
            destructive
            onPress={handleDeleteAccount}
          />
        </Section>

        <Section title="About">
          <Row
            icon="information-circle-outline"
            label="Version"
            sublabel={Application.nativeApplicationVersion}
          />
          <Row
            icon="document-text-outline"
            label="Privacy policy"
            onPress={() => {}}
          />
          <Row
            icon="reader-outline"
            label="Terms of service"
            onPress={() => {}}
          />
          <Row icon="star-outline" label="Rate Benny" onPress={() => {}} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
