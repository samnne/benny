import { usePreferences } from "@/store/zustand";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSAV);
const QUICK_AMOUNTS = [500, 1000, 1500, 2000, 3000, 5000];

const SpendingGoal = () => {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const isOnboarding = from === "onboarding";

  const { budgetPerPeriod, setBudgetPerPeriod } = usePreferences();

  const [amount, setAmount] = useState<string>(
    budgetPerPeriod ? budgetPerPeriod.toString() : "",
  );

  const inputRef = useRef<TextInput>(null);

  const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
  const isValid = !isNaN(numericAmount) && numericAmount > 0;

  const handleInput = (val: string) => {
    // Strip anything that isn't a digit or single dot
    const cleaned = val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setAmount(cleaned);
  };

  const handleQuickPick = (val: number) => {
    setAmount(val.toString());
    inputRef.current?.blur();
  };

  const handleSave = () => {
    if (!isValid) return;
    setBudgetPerPeriod(numericAmount);

    if (isOnboarding) {
      router.push("/home");
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            <Text className="font-fredoka text-3xl text-text">
              Spending Goal
            </Text>
            <Text className="font-nunito text-sm text-text/40 mt-0.5">
              {isOnboarding ? "Step 3 of 5" : "Edit your budget"}
            </Text>
          </View>
        </View>

        <View className="flex-1 px-5 pt-6">
          {/* Description */}
          <Text className="font-nunito-bold text-base text-text/70 leading-6 mb-8">
            How much do you want to spend per pay period? Benny will let you
            know when you're getting close. 🐰
          </Text>

          {/* Big input */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            className="bg-white rounded-3xl px-6 py-5 mb-3 flex-row items-center"
            style={{
              shadowColor: "#e61e3f",
              shadowOpacity: isValid ? 0.12 : 0.04,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              borderWidth: 2,
              borderColor: isValid ? "#e61e3f" : "rgba(230,30,63,0.08)",
            }}
          >
            <Text className="font-fredoka text-4xl text-primary mr-1">$</Text>
            <TextInput
              ref={inputRef}
              value={amount}
              onChangeText={handleInput}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#e0b0bb"
              className="font-fredoka text-4xl text-text flex-1"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            {isValid && (
              <Ionicons name="checkmark-circle" size={24} color="#e61e3f" />
            )}
          </TouchableOpacity>

          {/* Per period hint */}
          <Text className="font-nunito text-xs text-text/40 text-center mb-8">
            per pay period
          </Text>

          {/* Quick pick */}
          <Text className="font-nunito-extrabold text-xs text-primary uppercase tracking-widest mb-3">
            Quick pick
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {QUICK_AMOUNTS.map((val) => {
              const active = numericAmount === val;
              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => handleQuickPick(val)}
                  activeOpacity={0.75}
                  className={`px-5 py-2.5 rounded-full border-2 ${
                    active
                      ? "bg-primary border-primary"
                      : "bg-white border-primary/15"
                  }`}
                >
                  <Text
                    className={`font-nunito-bold text-sm ${
                      active ? "text-white" : "text-text/70"
                    }`}
                  >
                    ${val.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Budget feel hint */}
          {isValid && (
            <View className="mt-8 bg-accent/20 rounded-2xl px-4 py-3 flex-row items-center gap-3">
              <Text className="text-xl">
                {numericAmount <= 500
                  ? "🌱"
                  : numericAmount <= 1500
                    ? "🐰"
                    : numericAmount <= 3000
                      ? "💛"
                      : "✨"}
              </Text>
              <Text className="font-nunito-bold text-sm text-text/70 flex-1 leading-5">
                {numericAmount <= 500
                  ? "Tight and intentional, Benny will keep a close eye!"
                  : numericAmount <= 1500
                    ? "A solid budget, plenty of room to track well."
                    : numericAmount <= 3000
                      ? "Generous budget, Benny will cheer every milestone."
                      : "Big spender! Benny's ready for the challenge. ✨"}
              </Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <View
          className="px-5 pb-10 pt-4 bg-background"
          style={{ borderTopWidth: 1, borderTopColor: "rgba(230,30,63,0.06)" }}
        >
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid}
            activeOpacity={0.85}
            className={`rounded-full py-4 items-center ${
              isValid ? "bg-primary" : "bg-primary/30"
            }`}
            style={
              isValid
                ? {
                    shadowColor: "#e61e3f",
                    shadowOpacity: 0.25,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                  }
                : undefined
            }
          >
            <Text className="font-fredoka-semibold text-white text-xl tracking-wide">
              {isOnboarding ? "Next, Meet Benny" : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SpendingGoal;
