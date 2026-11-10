import Navbar from "@/components/Navigation/Navbar";
import { ChangePasswordModal } from "@/components/UI/Settings/ChangePasswordModal";
import { ChattinessRow } from "@/components/UI/Settings/ChattinessRow";
import { EditEmailModal } from "@/components/UI/Settings/EditEmailModal";
import { EditNameModal } from "@/components/UI/Settings/EditNameModal";
import { Row } from "@/components/UI/Settings/Row";
import { Section } from "@/components/UI/Settings/Section";
import { ToggleRow } from "@/components/UI/Settings/ToggleRow";
import { auth } from "@/config/firebase";
import { usePaychecks } from "@/store/paychecks";
import { usePreferences, useReceipt } from "@/store/zustand";
import { hasPasswordProvider } from "@/utils/auth";
import { sharePaychecksCsv, shareReceiptsCsv } from "@/utils/export";
import { Redirect, router } from "expo-router";
import { deleteUser, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import * as Application from "expo-application";
import { styled } from "nativewind";
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
  const {
    payFrequency,
    nextPayday,
    budgetPerPeriod,
    chattiness,
    notifications,
    setChattiness,
    setNotifications,
  } = usePreferences();

  const [accountModal, setAccountModal] = useState<
    "name" | "email" | "password" | null
  >(null);
  const [profile, setProfile] = useState({
    name: auth.currentUser?.displayName ?? "",
    email: auth.currentUser?.email ?? "",
  });

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setProfile({
        name: user?.displayName ?? "",
        email: user?.email ?? "",
      });
    });
  }, []);

  const refreshProfile = () => {
    const user = auth.currentUser;
    setProfile({
      name: user?.displayName ?? "",
      email: user?.email ?? "",
    });
  };

  const handleChangePassword = () => {
    if (!hasPasswordProvider()) {
      Alert.alert(
        "No password to change",
        "You signed in with Google or Apple. Use that provider to sign in.",
      );
      return;
    }

    setAccountModal("password");
  };

  const getReceipts = useReceipt((s) => s.getReceipts);
  const getPaychecks = usePaychecks((s) => s.getPaychecks);
  const [exporting, setExporting] = useState<"receipts" | "paychecks" | null>(
    null,
  );

  const paydayLabel = nextPayday
    ? `${PAY_FREQUENCY_LABELS[payFrequency]} · Next Payday ${new Date(`${nextPayday}T00:00:00`).toDateString()}`
    : PAY_FREQUENCY_LABELS[payFrequency];

  const handleSignOut = () => {
    auth.signOut();
    router.replace("/(screens)/onboarding");
  };

  const handleExportReceipts = async () => {
    if (exporting) return;

    setExporting("receipts");
    try {
      await getReceipts();
      const receipts = useReceipt.getState().receipts;

      if (receipts.length === 0) {
        Alert.alert("Nothing to export", "You don't have any receipts yet.");
        return;
      }

      await shareReceiptsCsv(receipts);
    } catch (error) {
      Alert.alert(
        "Export failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setExporting(null);
    }
  };

  const handleExportPaychecks = async () => {
    if (exporting) return;

    setExporting("paychecks");
    try {
      await getPaychecks();
      const { paychecks, error } = usePaychecks.getState();

      // Fall back to the cached paychecks if the refresh failed.
      if (paychecks.length === 0) {
        Alert.alert(
          error ? "Couldn't load paychecks" : "Nothing to export",
          error ?? "You haven't logged any paychecks yet.",
        );
        return;
      }

      await sharePaychecksCsv(paychecks);
    } catch (error) {
      Alert.alert(
        "Export failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setExporting(null);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "Your account and data would be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const { currentUser } = auth;
            if (!currentUser) {
              return <Redirect href={"/(screens)/(auth)/login"} />;
            }
            deleteUser(currentUser);
          },
        },
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
          {profile.email}
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
            sublabel={profile.name || "Add your name"}
            onPress={() => setAccountModal("name")}
          />
          <Row
            icon="mail-outline"
            label="Email"
            sublabel={profile.email || "—"}
            onPress={() => setAccountModal("email")}
          />
          <Row
            icon="lock-closed-outline"
            label="Change password"
            onPress={handleChangePassword}
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
          <Row
            icon="cash-outline"
            label="Log a paycheck"
            onPress={() => router.push("/(screens)/payday/payday")}
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
          <Row
            icon="notifications-outline"
            label="Handle Notifications"
            onPress={() => router.push("/(screens)/(notis)/notification")}
          />
        </Section>

        <Section title="Data">
          <Row
            icon="download-outline"
            label="Export receipts as CSV"
            sublabel={exporting === "receipts" ? "Preparing…" : undefined}
            onPress={exporting ? undefined : handleExportReceipts}
          />
          <Row
            icon="cash-outline"
            label="Export paychecks as CSV"
            sublabel={exporting === "paychecks" ? "Preparing…" : undefined}
            onPress={exporting ? undefined : handleExportPaychecks}
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
            sublabel={Application.nativeApplicationVersion ?? "—"}
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

      {accountModal === "name" ? (
        <EditNameModal
          visible
          currentName={profile.name}
          onClose={() => setAccountModal(null)}
          onSaved={refreshProfile}
        />
      ) : null}
      {accountModal === "email" ? (
        <EditEmailModal
          visible
          currentEmail={profile.email}
          onClose={() => setAccountModal(null)}
          onSaved={refreshProfile}
        />
      ) : null}
      {accountModal === "password" ? (
        <ChangePasswordModal visible onClose={() => setAccountModal(null)} />
      ) : null}
    </SafeAreaView>
  );
};

export default Settings;
