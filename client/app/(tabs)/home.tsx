import {
  Pressable,
  Text,
  View,

} from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/Navigation/Navbar";
import { SymbolView } from "expo-symbols";
import { theme } from "@/constants/constants";
import { clsx } from "clsx";
import { StatusBar } from "expo-status-bar";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MotiView, ScrollView } from "moti";
import { MotiPressable } from "moti/interactions";
import { useRouter } from "expo-router";
import { useBudget, useReceipt } from "@/store/zustand";
import { BudgetModal } from "@/components/UI/BudgetModal";

// ─── Budget setter modal ──────────────────────────────────────────────────────

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  groceries: "cart.fill",
  dining: "fork.knife",
  transport: "car.fill",
  entertainment: "film.fill",
  health: "heart.fill",
  shopping: "bag.fill",
  utilities: "bolt.fill",
  other: "square.grid.2x2.fill",
};

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { budget, setBudget } = useBudget();
  const { receipts } = useReceipt();

  const [toggled, setToggled] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  // ✅ Real totals from receipts
  const totalSpent = useMemo(
    () => receipts.reduce((acc, r) => acc + (r.total ?? 0), 0),
    [receipts],
  );
  const totalLeft = budget - totalSpent;
  const budgetPct = Math.min((totalSpent / budget) * 100, 100);
  const displayedPrice = toggled ? totalLeft.toFixed(2) : totalSpent.toFixed(2);

  // Placeholder — wire to real pay period when available
  const timePct = 70;

  const isOverBudget = totalSpent > budget;
  const onTrackLabel = isOverBudget
    ? "Over Budget"
    : budgetPct < 50
      ? "On Track"
      : "Getting Close";

  const recentReceipts = receipts.slice(-5).reverse();

  const animatePress = useMemo(
    () =>
      ({ hovered, pressed }: any) => ({
        opacity: hovered || pressed ? 0.5 : 1,
        translateY: hovered || pressed ? 10 : 0,
        scale: hovered || pressed ? 0.8 : 1,
      }),
    [],
  );

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <Navbar />
      <ScrollView
        className="flex-1 gap-4 px-4"
        contentContainerClassName="pb-30"
      >
        {/* ── Spent / Left toggle ── */}
        <View className="w-full justify-center py-12 gap-2 items-center">
          {/* ✅ Tap budget to edit it */}
          <Pressable onPress={() => setBudgetModalVisible(true)}>
            <Text className="text-lg text-text/50 justify-center items-center">
              Budget: ${budget.toFixed(2)}{" "}
              <SymbolView
                size={12}
                tintColor={theme.colors.text + "50"}
                name="pencil"
              />
            </Text>
          </Pressable>

          <MotiPressable
            onPress={() => setToggled((prev) => !prev)}
            style={{ alignItems: "center", justifyContent: "center" }}
            from={{ opacity: 0.9 }}
            animate={animatePress}
            transition={{ type: "spring", damping: 50, stiffness: 400 }}
          >
            <MotiView
              key={displayedPrice}
              from={{ opacity: 0, translateY: 10, scale: 0.8 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "spring", damping: 50, stiffness: 400 }}
              className="items-center"
            >
              <Text
                className={clsx(
                  "text-6xl font-bold",
                  toggled
                    ? totalLeft >= 0
                      ? "text-green-500"
                      : "text-red-500"
                    : isOverBudget
                      ? "text-red-500"
                      : "text-primary",
                )}
              >
                ${displayedPrice}
              </Text>
            </MotiView>
            <Text className="text-gray-400">
              {toggled ? "Left To Spend" : "Spent"}
            </Text>
          </MotiPressable>
        </View>

        {/* ── Gauges ── */}
        <View className="gap-4 justify-center items-center p-4 border-pill/20 rounded-3xl">
          <View className="relative justify-center items-center">
            <AnimatedCircularProgress
              size={200}
              style={{ height: 120, paddingTop: 20 }}
              width={15}
              fill={10}
              rotation={270}
              arcSweepAngle={180}
              lineCap="round"
              tintColor={theme.colors.primary}
              backgroundColor={theme.colors.primary + "50"}
            >
              {(fill: number) => (
                <View className="w-full justify-center items-center">
                  <Text className="text-4xl font-bold text-primary text-center">
                    {fill.toFixed(1)}%
                  </Text>
                  <Text className="text-sm text-pill/50">Time Elapsed</Text>
                </View>
              )}
            </AnimatedCircularProgress>

            <AnimatedCircularProgress
              size={250}
              style={{ height: 150, position: "absolute", top: 0 }}
              width={15}
              fill={budgetPct}
              rotation={270}
              arcSweepAngle={180}
              lineCap="round"
              tintColor={
                isOverBudget ? theme.colors.secondary : theme.colors.secondary
              }
              backgroundColor={theme.colors.secondary + "50"}
            >
              {() => <View />}
            </AnimatedCircularProgress>
          </View>

          <View
            className={clsx(
              "p-2 rounded-full px-4",
              isOverBudget ? "bg-red-100" : "bg-accent/25",
            )}
          >
            <Text
              className={clsx(
                "font-bold",
                isOverBudget ? "text-red-500" : "text-primary",
              )}
            >
              {onTrackLabel}
            </Text>
          </View>

          <View className="flex-row gap-2">
            {[
              {
                label: "Days till next Pay",
                value: "24",
                color: theme.colors.dark.pill,
              },
              {
                label: "Budget Used",
                value: `${budgetPct.toFixed(0)}%`,
                color: theme.colors.dark.pill,
              },
              {
                label: "Remaining",
                value: `$${Math.abs(totalLeft).toFixed(0)}`,
                color: isOverBudget
                  ? theme.colors.secondary
                  : theme.colors.primary,
              },
            ].map((item) => (
              <View
                key={item.label}
                className="w-30 rounded-2xl justify-between p-2 h-25 shadow"
              >
                <Text className="text-sm font-fredoka">{item.label}</Text>
                <Text
                  className="text-2xl font-nunito self-end"
                  style={{ color: item.color }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Receipt overview ── */}
        <View className="gap-4 justify-center w-full px-2 border-pill/20 rounded-3xl">
          <Text className="text-4xl font-nunito-black">Receipt Overview</Text>

          {recentReceipts.length === 0 ? (
            <View className="items-center py-8 gap-2 border-2 border-dashed border-primary/20 rounded-2xl">
              <SymbolView
                name="receipt"
                size={32}
                tintColor={theme.colors.primary + "40"}
              />
              <Text className="font-nunito text-text/40">No receipts yet</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1 flex-row"
            >
              {recentReceipts.map((receipt) => (
                <Pressable
                  key={receipt.id}
                  onPress={() => router.push("/receipts")}
                  className="mr-2 items-center p-4 gap-4 rounded-2xl flex-row justify-between border border-primary/20"
                >
                  <View className="flex-row items-center gap-2">
                    <View className="flex-row justify-center items-center bg-primary/20 rounded-full p-2">
                      <SymbolView
                        name={CATEGORY_ICONS[receipt.category] ?? "cart.fill"}
                        tintColor={theme.colors.primary}
                      />
                    </View>
                    <Text
                      className="text-2xl w-40 font-nunito-bold uppercase"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {receipt.merchant?.name ?? "Store"}
                    </Text>
                  </View>
                  <View className="justify-end items-end">
                    <Text className="text-3xl text-primary font-nunito-black">
                      ${receipt.total.toFixed(2)}
                    </Text>
                    <Text className="text-xs">{receipt.date ?? "—"}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Pressable
            onPress={() => router.push("/(screens)/new")}
            className="mr-2 items-center p-2 gap-4 rounded-2xl flex-row justify-center border-dashed border bg-background border-primary/20"
          >
            <Text
              className="text-xl flex-1 w-full text-primary/80 font-bold"
              numberOfLines={1}
            >
              Create New Receipt
            </Text>
            <View className="flex-row items-center bg-primary/10 rounded-full p-2">
              <SymbolView name="plus" tintColor={theme.colors.primary} />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
      />
      <StatusBar style="dark" />
    </View>
  );
};

export default Home;
