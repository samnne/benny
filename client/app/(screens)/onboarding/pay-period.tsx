import { usePreferences } from "@/store/zustand";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSAV)
// ── Types ────────────────────────────────────────────────────────────────────

type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

const FREQUENCIES: { key: PayFrequency; label: string; sublabel: string }[] = [
  { key: "weekly",       label: "Weekly",       sublabel: "Every 7 days"   },
  { key: "biweekly",    label: "Bi-weekly",    sublabel: "Every 2 weeks"   },
  { key: "semimonthly", label: "Semi-monthly", sublabel: "Twice a month"   },
  { key: "monthly",     label: "Monthly",      sublabel: "Once a month"    },
];

const DAYS = [
  { key: 0, label: "Sun" },
  { key: 1, label: "Mon" },
  { key: 2, label: "Tue" },
  { key: 3, label: "Wed" },
  { key: 4, label: "Thu" },
  { key: 5, label: "Fri" },
  { key: 6, label: "Sat" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNextPaydays(freq: PayFrequency, dayOfWeek: number | null, count = 6): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stepDays = { weekly: 7, biweekly: 14, semimonthly: 15, monthly: 30 };
  const step = stepDays[freq];

  // Start from tomorrow
  let cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1);

  // If a day of week is selected, advance cursor to the next matching day
  if (dayOfWeek !== null) {
    while (cursor.getDay() !== dayOfWeek) {
      cursor.setDate(cursor.getDate() + 1 );
    }
  }

  const dates: Date[] = [];
  while (dates.length < count) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + step);
  }

  return dates;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
  });
}

// ── Screen ───────────────────────────────────────────────────────────────────

const PayPeriod = () => {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const isOnboarding = from === "onboarding";

  const { payFrequency, nextPayday, setPayFrequency, setNextPayday } = usePreferences();

  const [selectedFreq,    setSelectedFreq]    = useState<PayFrequency>(payFrequency);
  const [selectedDay,     setSelectedDay]     = useState<number | null>(null);
  const [selectedPayday,  setSelectedPayday]  = useState<string | null>(nextPayday);

  // Recompute available paydays whenever freq or day changes
  const paydays = selectedDay !== null ? getNextPaydays(selectedFreq, selectedDay) : [];

  const canSave = selectedDay !== null && selectedPayday !== null;

  const handleFreqChange = (freq: PayFrequency) => {
    setSelectedFreq(freq);
    setSelectedDay(null);
    setSelectedPayday(null);
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    setSelectedPayday(null); // reset date when day changes
  };

  
  const handleSave = () => {
    if (!canSave) return;
    setPayFrequency(selectedFreq);
    setNextPayday(selectedPayday!);

    if (isOnboarding) {
      router.push("/(screens)/onboarding/spending-goal");
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>

      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        {!isOnboarding && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3 -ml-1">
            <Ionicons name="chevron-back" size={26} color="#e61e3f" />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="font-fredoka text-3xl text-text">Pay Period</Text>
          <Text className="font-nunito text-sm text-text/40 mt-0.5">
            {isOnboarding ? "Step 2 of 5" : "Edit your pay schedule"}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* ── Frequency ── */}
        <Text className="font-nunito-extrabold text-xs text-primary uppercase tracking-widest mt-6 mb-3">
          How often do you get paid?
        </Text>

        <View className="gap-3">
          {FREQUENCIES.map(({ key, label, sublabel }) => {
            const active = selectedFreq === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => handleFreqChange(key)}
                activeOpacity={0.75}
                className={`flex-row items-center px-4 py-4 rounded-3xl border-2 ${
                  active ? "bg-primary/5 border-primary" : "bg-white border-transparent"
                }`}
                style={!active ? { shadowColor: "#e61e3f", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } } : undefined}
              >
                <View className={`w-5 h-5 rounded-full border-2 mr-4 items-center justify-center ${active ? "border-primary" : "border-text/20"}`}>
                  {active && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </View>
                <View className="flex-1">
                  <Text className={`font-nunito-bold text-base ${active ? "text-primary" : "text-text"}`}>
                    {label}
                  </Text>
                  <Text className="font-nunito text-xs text-text/40 mt-0.5">{sublabel}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={20} color="#e61e3f" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Day of week ── */}
        <Text className="font-nunito-extrabold text-xs text-primary uppercase tracking-widest mt-8 mb-3">
          Which day do you get paid?
        </Text>

        <View className="flex-row justify-between">
          {DAYS.map(({ key, label }) => {
            const active = selectedDay === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => handleDayChange(key)}
                activeOpacity={0.75}
                className={`w-11 h-11 rounded-2xl items-center justify-center border-2 ${
                  active ? "bg-primary border-primary" : "bg-white border-primary/10"
                }`}
              >
                <Text className={`font-nunito-bold text-xs ${active ? "text-white" : "text-text/60"}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Next payday ── */}
        {selectedDay !== null && (
          <>
            <Text className="font-nunito-extrabold text-xs text-primary uppercase tracking-widest mt-8 mb-1">
              When is your next payday?
            </Text>
            <Text className="font-nunito text-sm text-text/40 mb-4">
              Pick the closest upcoming date — Benny will calculate the rest.
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {paydays.map((date) => {
                const iso    = date.toISOString().split("T")[0];
                const active = selectedPayday === iso;
              
                return (
                  <TouchableOpacity
                    key={iso}
                    onPress={() => setSelectedPayday(iso)}
                    activeOpacity={0.75}
                    className={`px-4 py-2.5 rounded-full border-2 ${
                      active ? "bg-primary border-primary" : "bg-white border-primary/15"
                    }`}
                  >
                    <Text className={`font-nunito-bold text-sm ${active ? "text-white" : "text-text/70"}`}>
                      {formatDate(date)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

      </ScrollView>

      {/* ── CTA ── */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-background"
        style={{ borderTopWidth: 1, borderTopColor: "rgba(230,30,63,0.06)" }}
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.85}
          className={`rounded-full py-4 items-center ${canSave ? "bg-primary" : "bg-primary/30"}`}
          style={canSave ? { shadowColor: "#e61e3f", shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } } : undefined}
        >
          <Text className="font-fredoka-semibold text-white text-xl tracking-wide">
            {isOnboarding ? "Next — Spending Goal" : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default PayPeriod;