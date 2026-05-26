import { View, Text, Pressable, Alert } from "react-native";
import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { theme } from "@/constants/constants";
import { SymbolView } from "expo-symbols";
import { useReceipt, useTrip } from "@/store/zustand";
import { router, useFocusEffect } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const SWIPE_THRESHOLD = -80;
const DELETE_THRESHOLD = -120;
const VIEW_THRESHOLD = 80; // swipe right distance to trigger view

const ReceiptCard = ({ receipt }: { receipt: Receipt }) => {
  const moreItems = receipt?.items?.slice(2, receipt.items.length)?.length;
  const { setTotal, setItems } = useTrip();

  const { setServerReceipt, deleteReceipt } = useReceipt();

  const translateX = useSharedValue(0);
  const cardHeight = useSharedValue(320);
  const cardOpacity = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      // Reset position every time the screen comes back into focus
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      cardHeight.value = 320;
      cardOpacity.value = 1;
    }, []),
  );
  function navigateToReceipt() {
    setTotal(receipt.total);
    setItems(receipt.items.map((item: ReceiptItem) => ({ ...item })));
    setServerReceipt(receipt);
    router.push("/receipt/view");
  }

  function confirmDelete() {
    Alert.alert(
      "Delete Receipt",
      `Remove the receipt from ${receipt?.merchant?.name ?? "this store"}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            translateX.value = withTiming(-400, { duration: 250 });
            cardHeight.value = withTiming(0, { duration: 300 });
            cardOpacity.value = withTiming(0, { duration: 250 }, () => {
              runOnJS(deleteReceipt)(receipt.id);
            });
          },
        },
      ],
    );
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        // Left swipe — delete direction, clamp at -140
        translateX.value = Math.max(e.translationX, -140);
      } else {
        // Right swipe — view direction, add rubber-band resistance
        translateX.value = Math.min(e.translationX * 0.4, 60);
      }
    })
    .onEnd((e) => {
      if (e.translationX > VIEW_THRESHOLD) {
        // Swiped right far enough — navigate
        translateX.value = withTiming(400, { duration: 220 }, () => {
          scheduleOnRN(navigateToReceipt);
        });
      } else if (e.translationX < DELETE_THRESHOLD) {
        // Swiped left far enough — confirm delete
        translateX.value = withSpring(SWIPE_THRESHOLD, { damping: 20 });
        scheduleOnRN(confirmDelete);
      } else if (e.translationX < SWIPE_THRESHOLD / 2) {
        // Partial left swipe — reveal delete hint
        translateX.value = withSpring(SWIPE_THRESHOLD, { damping: 20 });
      } else {
        // Neither threshold met — snap back
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });
  const wrapperStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
    overflow: "hidden" as const,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: cardOpacity.value,
  }));

  const deleteHintStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-20, -60],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      translateX.value,
      [-80, -120],
      [0.9, 1],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ scale }] };
  });

  const viewHintStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [5, 30],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      translateX.value,
      [20, 50],
      [0.85, 1],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ scale }] };
  });

  return (
    <Animated.View style={wrapperStyle}>
      {/* View hint — left side */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          viewHintStyle,
          {
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: 24,
            borderRadius: 16,
          },
        ]}
      >
        <View className="bg-secondary w-16 h-16 rounded-2xl items-center justify-center gap-1">
          <SymbolView name="eye.fill" tintColor="#ffffff" size={22} />
          <Text className="text-white text-xs font-nunito-bold">View</Text>
        </View>
      </Animated.View>

      {/* Delete hint — right side */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          deleteHintStyle,
          {
            alignItems: "flex-end",
            justifyContent: "center",
            paddingRight: 24,
            borderRadius: 16,
          },
        ]}
      >
        <View className="bg-red-500 w-16 h-16 rounded-2xl items-center justify-center gap-1">
          <SymbolView name="trash.fill" tintColor="#ffffff" size={22} />
          <Text className="text-white text-xs font-nunito-bold">Delete</Text>
        </View>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardStyle} className="w-full">
          <View className="bg-white border-primary/20 border-2 rounded-t-2xl rounded-b-lg relative z-50 w-full h-80">
            <View className="flex-row justify-between p-4 items-center w-full">
              <View className="flex-row gap-2 items-center">
                <SymbolView
                  name="storefront"
                  tintColor={theme.colors.primary}
                />
                <Text className="text-4xl line-clamp-1 w-3/5 truncate pt-2 font-bold font-nunito-bold">
                  {receipt?.merchant?.name}
                </Text>
              </View>
              <Text className="text-3xl pt-2 font-bold font-nunito-extrabold">
                ${receipt?.total.toFixed(2)}
              </Text>
            </View>

            <View className="h-px bg-pill-dark/20" />

            <View className="w-full p-4 flex-1">
              {receipt.items
                .filter((_, i) => i < 2)
                .map((item) => (
                  <View
                    key={item.id}
                    className="flex-1 flex-row justify-between w-full"
                  >
                    <Text className="text-3xl font-nunito">
                      {item?.name ?? "Item"}
                    </Text>
                    <Text className="text-3xl font-nunito">
                      ${item.total_price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              <View className="flex-row items-center w-full justify-between">
                <Text className="text-xl font-nunito">
                  {moreItems === 0
                    ? "No more items"
                    : moreItems === 1
                      ? "1 more item"
                      : `${moreItems} more items`}
                </Text>
              </View>
            </View>

            <View className="bg-primary/5 gap-2 flex-row items-center p-3 w-full">
              <SymbolView name="pawprint" tintColor={theme.colors.primary} />
              <Text className="font-semibold font-nunito-bold pr-4">
                Benny Says: {receipt.benny_message}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default ReceiptCard;
