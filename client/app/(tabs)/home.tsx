import { Pressable, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navbar from "@/components/Navigation/Navbar";
import { SymbolView } from "expo-symbols";
import { categories, theme } from "@/constants/constants";
import { clsx } from "clsx";

import Svg, { Circle } from "react-native-svg";
import CategoryCard from "@/components/UI/CategoryCard";
import { StatusBar } from "expo-status-bar";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { MotiView, ScrollView } from "moti";
import { MotiPressable } from "moti/interactions";
import { useRouter } from "expo-router";

const ITEMS_PER_PAGE = 4; // 2x2 grid = 4 items per page

const Home = () => {
  const insets = useSafeAreaInsets();
  const [displayedPrice, setDisplayedPrice] = useState("1,234");
  const [toggled, setToggled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [timePct, setTimePct] = useState(70);
  const router = useRouter()
  const [budgetPct, setBudgetPct] = useState(40);
  const animatePress = useMemo(
    () =>
      ({ hovered, pressed }) => {
        return {
          opacity: hovered || pressed ? 0.5 : 1,
          translateY: hovered || pressed ? 10 : 0,
          scale: hovered || pressed ? 0.8 : 1,
        };
      },
    [],
  );
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <Navbar />
      <ScrollView
        className="flex-1 gap-4 px-4 "
        contentContainerClassName="pb-30"
      >
        {/* Expenses For the Month */}
        <View className="w-full justify-center py-12 gap-2 items-center">
          <Pressable>
            <Text className="text-lg text-text/50 justify-center items-center">
              April 2026{" "}
              <SymbolView
                className="w-6 h-6"
                size={12}
                tintColor={theme.colors.text + "50"}
                name="arrowtriangle.down.fill"
              />
            </Text>
          </Pressable>
          <MotiPressable
            onPress={() => {
              setToggled((prev) => !prev);
              setDisplayedPrice((prev) => (prev === "1,234" ? "766" : "1,234"));
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
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
                  displayedPrice === "1,234"
                    ? "text-red-500"
                    : "text-green-500",
                )}
              >
                ${displayedPrice}
              </Text>
            </MotiView>
            <Text className="text-gray-400">
              {!toggled ? "Spent" : "Left To Spend"}
            </Text>
          </MotiPressable>
        </View>

        <View className="gap-4 justify-center items-center     p-4 border-pill/20 rounded-3xl">
          {/* <PayPeriodGauge timePct={70} budgetPct={40} /> */}
          <View className="relative justify-center items-center">
            <AnimatedCircularProgress
              size={200}
              style={{ height: 120, paddingTop: 20 }}
              width={15}
              fill={timePct} // <-- was fill={80}
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
              fill={budgetPct} // <-- was fill={80}
              rotation={270}
              arcSweepAngle={180}
              lineCap="round"
              tintColor={theme.colors.secondary}
              backgroundColor={theme.colors.secondary + "50"}
            >
              {() => <View />}
            </AnimatedCircularProgress>
          </View>
          <View className="bg-accent/25 p-2 rounded-full ">
            <Text className="font-bold text-primary">On Track</Text>
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
                value: "18%",
                color: theme.colors.dark.pill,
              },
              {
                label: "Difference",
                value: "+20%",
                color: theme.colors.primary,
              },
            ].map((item) => (
              <View
                key={item.label}
                className="w-30 rounded-2xl justify-between  p-2 h-25 shadow"
              >
                <Text className="text-sm font-fredoka">{item.label}</Text>
                <Text
                  className="text-2xl font-nunito  self-end"
                  style={{
                    color: item?.color,
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className="gap-4 justify-center w-full     px-8 border-pill/20 rounded-3xl">
          <Text className="text-4xl font-nunito-black">Reciept Overview</Text>
          <ScrollView className=" flex-1 flex-row " horizontal>
            {[
              {
                store: "Target",
                amount: "$190",
                date: "2026/04/02",
                icon: "cart",
              },
              {
                store: "Coffee Shop",
                amount: "$28",
                date: "2026/04/01",
                icon: "cup.and.saucer",
              },
              {
                store: "Amazon",
                amount: "$72",
                date: "2026/03/31",
                icon: "cart.fill",
              },
            ].map((receipt) => (
              <View
                key={`${receipt.store}-${receipt.date}`}
                className="mr-2 items-center p-4 gap-4 rounded-2xl flex-row justify-between border border-primary/20"
              >
                <View className="flex-row items-center gap-2 ">
                  <View className="flex-row justify-center items-center bg-primary/20 rounded-full p-2">
                    <SymbolView
                      name={receipt.icon}
                      tintColor={theme.colors.primary}
                    />
                  </View>
                  <Text
                    className="text-2xl w-40 font-nunito-bold uppercase"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {receipt.store}
                  </Text>
                </View>
                <View className="justify-end items-end ">
                  <Text className="text-3xl text-primary font-nunito-black">
                    {receipt.amount}
                  </Text>
                  <Text className="text-xs">{receipt.date}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <Pressable
            onPress={()=> router.push('/receipts')}
            className="mr-2 items-center p-2 gap-4 rounded-2xl flex-row justify-center border-dashed border bg-background border-primary/20"
          >
            <View className="flex-row flex-1 w-full items-center gap-2 ">
              <Text
                className="text-xl w-full text-primary/80 font-bold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Create New Receipt
              </Text>
            </View>
              <View className="flex-row  items-center bg-primary/10 rounded-full p-2">
                <SymbolView name={"plus"} tintColor={theme.colors.primary} />
              </View>
          </Pressable>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
};

export default Home;
