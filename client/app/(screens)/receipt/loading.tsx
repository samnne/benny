import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { BASE_URL, theme } from "@/constants/constants";
import { useAuth, useReceipt, useTrip } from "@/store/zustand";
import { randomUUID } from "expo-crypto";

const MAX_DURATION = 5000;
const SLOW_TOAST_AT = 12000;

const STAGES = [
  {
    at: 0,
    pct: 0,
    label: "Reading receipt",
    msg: "Scanning your receipt...",
    benny: "Hang tight! I'm reading every line so you don't have to.",
  },
  {
    at: 1000,
    pct: 15,
    label: "Detecting text",
    msg: "Finding the text...",
    benny: "Receipt quality looks good, this should be quick!",
  },
  {
    at: 2500,
    pct: 30,
    label: "Parsing items",
    msg: "Reading your items...",
    benny: "Ooh, interesting haul. Let me get the details right.",
  },
  {
    at: 4500,
    pct: 50,
    label: "Calculating totals",
    msg: "Crunching the numbers...",
    benny: "Tax, subtotal, total, I've got my eye on all of it.",
  },
  {
    at: 6500,
    pct: 65,
    label: "Categorising",
    msg: "Sorting the category...",
    benny: "Groceries? Dining? Let me figure out what this one is.",
  },
  {
    at: 8500,
    pct: 80,
    label: "Wrapping up",
    msg: "Putting it all together...",
    benny: "Almost there, just double-checking everything for you.",
  },
  {
    at: 10500,
    pct: 92,
    label: "Finishing",
    msg: "Final checks...",
    benny: "Taking a little longer than usual, nearly there!",
  },
] as const;

async function fakeParseReceipt(token: string): Promise<void | null> {
  try {
    console.log(token)
    const response = await fetch(`${BASE_URL}/api/receipt/`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
    if (!response?.success) return new Promise((res) => res(response));
    return new Promise((res) => res(response.data));
  } catch (error) {
    console.log(error);
    return new Promise((res) => res(null));
  }
}

const ReceiptLoading = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [showSlowToast, setShowSlowToast] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const msgOpacity = useRef(new Animated.Value(1)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const isDone = useRef(false);
  const { setItems, setTotal } = useTrip();
  const { token } = useAuth();
  const { addReceipt, setServerReceipt, setIsLoading } = useReceipt();
  const stage = STAGES[stageIndex];

  const showToast = () => {
    setShowSlowToast(true);
    Animated.spring(toastOpacity, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
    }).start();
  };

  const navigateAway = () => {
    if (isDone.current) return;
    isDone.current = true;
    Animated.timing(progress, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/receipt/view");
    });
  };

  const bumpStage = (index: number) => {
    if (isDone.current) return;
    Animated.timing(msgOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setStageIndex(index);
      Animated.timing(msgOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    Animated.timing(progress, {
      toValue: STAGES[index].pct / 100,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    // Mark global loading as true when scan starts
    setIsLoading(true);

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    ).start();

    const stageTimers = STAGES.map((s, i) => {
      if (i === 0) return null;
      return setTimeout(() => bumpStage(i), s.at);
    }).filter(Boolean) as ReturnType<typeof setTimeout>[];

    const maxTimer = setTimeout(navigateAway, MAX_DURATION);

    const slowToastTimer = setTimeout(showToast, SLOW_TOAST_AT);

    fakeParseReceipt(token).then((data: any) => {
      if (data) {
        const rid = randomUUID();
        const newItems = data.items?.map((item: ReceiptItem) => ({
          ...item,
          id: randomUUID(),
        }));
        setTotal(data.total);
        setItems(newItems);
        const receipt = { ...data, items: newItems, id: rid };
        addReceipt(receipt);
        setServerReceipt(receipt);
      }
      stageTimers.forEach(clearTimeout);
      clearTimeout(maxTimer);
      clearTimeout(slowToastTimer);

      setIsLoading(false);
      navigateAway();
    });

    return () => {
      stageTimers.forEach(clearTimeout);
      clearTimeout(maxTimer);
      clearTimeout(slowToastTimer);
      isDone.current = true;
      // If user navigates away manually, keep isLoading true so skeleton shows
    };
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-primary items-center justify-center px-7">
      <View className="flex-1 items-center justify-center w-full gap-0">
        <View
          className="w-20 h-20 rounded-full bg-text/10 items-center justify-center mb-8"
          style={{ position: "relative" }}
        >
          <Animated.View
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 40,
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.15)",
              borderTopColor: theme.colors.background,
              transform: [{ rotate: spin }],
            }}
          />
          <SymbolView name="receipt" tintColor={theme.colors.background} />
        </View>

        <Animated.View style={{ opacity: msgOpacity, alignItems: "center" }}>
          <Text
            className="font-nunito-bold text-background/70 tracking-widest mb-2"
            style={{ fontSize: 11, textTransform: "uppercase" }}
          >
            {stage.label}
          </Text>
          <Text
            className="font-fredoka-semibold text-white text-center mb-10"
            style={{ fontSize: 28, lineHeight: 36 }}
          >
            {stage.msg}
          </Text>
        </Animated.View>

        <View
          className="w-full bg-white/10 rounded-full overflow-hidden"
          style={{ height: 4 }}
        >
          <Animated.View
            className="bg-background rounded-full"
            style={{ height: 4, width: barWidth }}
          />
        </View>
        <Text className="font-nunito text-white/50 mt-2 text-xl">
          {stage.pct}%
        </Text>
      </View>

      {/* Slow Benny toast */}
      {showSlowToast && (
        <Animated.View
          style={{ opacity: toastOpacity }}
          className="w-full bg-white/15 border border-white/20 rounded-2xl p-4 flex-row items-start mb-4"
        >
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-3">
            <SymbolView name="face.smiling" tintColor="#ffffff" size={16} />
          </View>
          <View className="flex-1">
            <Text className="font-nunito-bold text-white text-sm mb-0.5">
              Benny here, still on it!
            </Text>
            <Text className="font-nunito text-white/70 text-sm leading-5">
              This receipt&apos;s giving me a workout. I haven&apos;t given up, promise!
            </Text>
          </View>
        </Animated.View>
      )}

      <Animated.View
        className="w-full bg-white/5 rounded-2xl p-4 flex-row items-start mb-8"
        style={{ gap: 10, opacity: msgOpacity }}
      >
        <View className="w-8 h-8 rounded-full bg-text/20 items-center justify-center">
          <SymbolView
            name="magnifyingglass"
            size={18}
            tintColor={theme.colors.background}
          />
        </View>
        <Text
          className="font-nunito text-white/60 flex-1"
          style={{ fontSize: 13, lineHeight: 20 }}
        >
          {stage.benny}
        </Text>
      </Animated.View>
    </View>
  );
};

export default ReceiptLoading;
