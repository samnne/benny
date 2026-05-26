// ReceiptViewConfirm.tsx

import {
  Pressable,
  Text,
  ScrollView as RNScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView as RNSAV, ScrollView, View } from "moti";
import { styled } from "nativewind";

import ItemSlot from "@/components/UI/ItemSlot";
import { SymbolView } from "expo-symbols";
import { CATEGORY_ICONS, theme } from "@/constants/constants";

import { useRouter } from "expo-router";
import { useBudget, useReceipt, useTrip } from "@/store/zustand";
import TripModal from "@/components/UI/TripModal";
import ReceiptViewSkeleton from "@/components/UI/Receipt/ReceiptViewSkeleton";
import { Pill } from "@/components/UI/Pill";

const SafeAreaView = styled(RNSAV);

// ─── Category label map ───────────────────────────────────────────────────────


// ─── Main screen ──────────────────────────────────────────────────────────────
const ReceiptViewConfirm = () => {
  const { items, updateTotal, total } = useTrip();
  const { serverReceipt, isLoading, updateMerchantName } =
    useReceipt();
  const { budget } = useBudget();
  const [percentage, setPercentage] = useState(0);
 
  const [modalVisible, setModalVisible] = useState(false);
  const [displayedPrice, setDisplayedPrice] = useState(total);
  const [view, setView] = useState<"left" | "used">("used");
  const router = useRouter();
  const [merchantName, setMerchantName] = useState(
    serverReceipt?.merchant?.name ?? "",
  );
  useEffect(() => {
    setMerchantName(serverReceipt?.merchant?.name ?? "");
  }, [serverReceipt?.merchant?.name]);

  useEffect(() => {
    updateTotal(items);
    setPercentage(((total) / budget) * 100);
    setDisplayedPrice(total);
  }, [items, updateTotal, budget, total]);

  const format = (n: number | null | undefined) =>
    n != null ? n.toFixed(2) : null;

  return (
    <>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {isLoading && items.length === 0 ? (
            <ReceiptViewSkeleton />
          ) : (
            <View className="flex-1 p-4 gap-4">
              {/* ── HEADER ── */}
              <View className="w-full gap-1">
                {/* Store name */}
                <TextInput
                  value={merchantName}
                  onChangeText={(text) => {
                    setMerchantName(text);
                    updateMerchantName(text);
                  }}
                  onBlur={() => {
                    // Fallback if user clears it entirely
                    if (!merchantName.trim()) {
                      setMerchantName("Current Trip");
                      updateMerchantName("Current Trip");
                    }
                  }}
                  placeholder="Store name"
                  placeholderTextColor={theme.colors.primary + "40"}
                  className="text-6xl font-fredoka-semibold w-full leading-none"
                />

                {/*  Address under store name */}
                {serverReceipt?.merchant?.address && (
                  <View className="flex-row items-center gap-1">
                    <SymbolView
                      name="mappin"
                      size={12}
                      tintColor={theme.colors.primary + "80"}
                    />
                    <Text
                      className="text-sm font-nunito text-primary/50 line-clamp-1"
                      numberOfLines={1}
                    >
                      {serverReceipt.merchant.address}
                    </Text>
                  </View>
                )}

                {/* Total / budget toggle */}
                <View className="flex-row self-end justify-center items-center mt-1">
                  <Text
                    className={`text-6xl font-fredoka-semibold leading-none ${
                      view === "left" ? "text-secondary" : "text-primary"
                    }`}
                  >
                    $
                  </Text>
                  <Pressable
                    onPress={() => {
                      setDisplayedPrice((prev) => budget - prev);
                      setView((prev) => (prev === "left" ? "used" : "left"));
                    }}
                  >
                    <Text
                      className={`text-6xl font-fredoka-semibold leading-none ${
                        view === "left" ? "text-secondary" : "text-primary"
                      }`}
                    >
                      {displayedPrice.toFixed(2)}
                    </Text>
                  </Pressable>
                </View>

                {/* Progress bar */}
                <View className="w-full h-4 rounded-full bg-secondary/25">
                  <View
                    style={{
                      width: percentage > 100 ? "100%" : `${percentage}%`,
                    }}
                    className="h-4 bg-primary rounded-full"
                  />
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xl p-1 text-primary font-nunito-bold">
                    $0
                  </Text>
                  <Text className="text-xl p-1 text-primary font-nunito-bold">
                    ${budget}
                  </Text>
                </View>
              </View>

              {/* PILLS ROW ── */}
              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
              >
                <Pill
                  label="Total"
                  value={format(serverReceipt?.total)}
                  symbol="dollarsign.circle.fill"
                  accent
                />
                <Pill
                  label="Subtotal"
                  value={format(serverReceipt?.subtotal)}
                  symbol="list.bullet.rectangle"
                />
                <Pill
                  label="Tax"
                  value={format(serverReceipt?.tax)}
                  symbol="percent"
                />
                <Pill
                  label="Tip"
                  value={format(serverReceipt?.tip)}
                  symbol="heart.fill"
                />
                <Pill
                  label="Savings"
                  value={format(serverReceipt?.discounts)}
                  symbol="tag.fill"
                  accent
                />
                <Pill
                  label="Currency"
                  value={serverReceipt?.currency}
                  symbol="banknote"
                />
                <Pill
                  label="Date"
                  value={serverReceipt?.date ?? undefined}
                  symbol="calendar"
                />
                <Pill
                  label="Category"
                  value={
                    serverReceipt?.category
                      ? serverReceipt.category.charAt(0).toUpperCase() +
                        serverReceipt.category.slice(1)
                      : undefined
                  }
                  symbol={CATEGORY_ICONS[serverReceipt?.category ?? "other"]}
                />
                {serverReceipt?.payment_method && (
                  <Pill
                    label="Paid via"
                    value={serverReceipt.payment_method}
                    symbol="creditcard.fill"
                  />
                )}
              </RNScrollView>

              {/* ── ITEMS ── */}
              <View className="gap-4">
                <Text className="text-4xl font-fredoka tracking-wide">
                  List
                </Text>
                {items.map((val) => (
                  <ItemSlot key={val.id} item={val} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View className="w-full gap-2 flex-row p-4">
          <Pressable
            onPress={() => router.push("/(screens)/price")}
            className="p-4 rounded-full bg-primary flex-1 justify-center items-center"
          >
            <SymbolView name="plus" tintColor={theme.colors.background} />
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="flex-row p-4 rounded-full bg-secondary gap-2 flex-1 justify-center items-center"
          >
            <Text className="text-background text-2xl font-nunito-bold">
              Done
            </Text>
            <SymbolView name="checkmark" tintColor={theme.colors.background} />
          </Pressable>
        </View>
      </SafeAreaView>

      <TripModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

export default ReceiptViewConfirm;
