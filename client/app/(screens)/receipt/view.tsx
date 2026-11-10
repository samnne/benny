// ReceiptViewConfirm.tsx

import { SafeAreaView as RNSAV, ScrollView, View } from "moti";
import { styled } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView as RNScrollView,
  Text,
  TextInput,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import ItemSlot from "@/components/UI/ItemSlot";
import { CATEGORY_ICONS, theme } from "@/constants/constants";
import { SymbolView } from "expo-symbols";

import { Pill } from "@/components/UI/Pill";
import ReceiptViewSkeleton from "@/components/UI/Receipt/ReceiptViewSkeleton";
import TripModal from "@/components/UI/TripModal";
import { usePreferences, useReceipt, useTrip } from "@/store/zustand";
import { useRouter } from "expo-router";

const SafeAreaView = styled(RNSAV);

// ─── Category label map ───────────────────────────────────────────────────────

// ─── Main screen ──────────────────────────────────────────────────────────────
const ReceiptViewConfirm = () => {
  const { items, updateTotal, total } = useTrip();
  const { serverReceipt, isLoading, updateMerchantName, setServerReceipt } =
    useReceipt();
  const { budgetPerPeriod } = usePreferences();
  const [percentage, setPercentage] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [displayedPrice, setDisplayedPrice] = useState(total);
  const [view, setView] = useState<"left" | "used">("used");
  const router = useRouter();
  const [merchantName, setMerchantName] = useState(
    serverReceipt?.merchant?.name ?? "",
  );

  const todayDate = new Date().toISOString().split("T")[0];
  const [receiptDate, setReceiptDate] = useState(
    serverReceipt?.date ?? todayDate,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      const formatted = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1,
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      setReceiptDate(formatted);
      setServerReceipt({
        ...serverReceipt,
        date: formatted,
        currency: serverReceipt?.currency ?? "CAD",
        discounts: serverReceipt?.discounts ?? null,
      });
    }
  };

  const dateValue = useMemo(() => {
    if (receiptDate && !isNaN(Date.parse(receiptDate))) {
      return new Date(`${receiptDate}T00:00:00`);
    }
    return new Date();
  }, [receiptDate]);

  useEffect(() => {
    if (serverReceipt?.date) {
      setReceiptDate(serverReceipt.date);
    } else {
      setReceiptDate(todayDate);
      setServerReceipt({
        ...serverReceipt,
        date: todayDate,
        currency: serverReceipt?.currency ?? "CAD",
        discounts: serverReceipt?.discounts ?? null,
      });
    }
  }, [serverReceipt?.date]);
  useEffect(() => {
    setMerchantName(serverReceipt?.merchant?.name ?? "");
  }, [serverReceipt?.merchant?.name]);

  useEffect(() => {
    updateTotal(items);
    setPercentage((total / budgetPerPeriod) * 100);
    setDisplayedPrice(total);
  }, [items, updateTotal, budgetPerPeriod, total]);

  const format = (n: number | null | undefined) =>
    n != null ? n?.toFixed(2) : null;

  const isFormValid =
    merchantName.trim().length > 0 &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.name &&
        item.name.trim().length > 0 &&
        typeof item.total_price === "number" &&
        !isNaN(item.total_price) &&
        item.total_price > 0,
    );

  return (
    <>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 ">
          {isLoading && items.length === 0 ? (
            <ReceiptViewSkeleton />
          ) : (
            <View className="flex-1 p-4 gap-4">
              {/* ── HEADER ── */}
              <View className="w-full pt-4 gap-1">
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
                  className="text-4xl font-fredoka-semibold w-full "
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
                      setDisplayedPrice((prev) => budgetPerPeriod - prev);
                      setView((prev) => (prev === "left" ? "used" : "left"));
                    }}
                  >
                    <Text
                      className={`text-6xl font-fredoka-semibold leading-none ${
                        view === "left" ? "text-secondary" : "text-primary"
                      }`}
                    >
                      {displayedPrice?.toFixed(2)}
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
                    ${}
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
                  value={serverReceipt?.currency ?? "CAD"}
                  symbol="banknote"
                />
                {/* Date Pill Button */}
                <Pressable
                  onPress={() => setShowDatePicker((prev) => !prev)}
                  accessibilityRole="button"
                  accessibilityLabel="Choose date"
                  className="flex-row items-center gap-1.5 px-3 py-2 rounded-full border bg-secondary/10 border-secondary/20"
                >
                  <SymbolView
                    name="calendar"
                    size={13}
                    tintColor={theme.colors.secondary}
                  />
                  <Text className="text-xs font-nunito-bold uppercase tracking-widest text-secondary/60">
                    Date
                  </Text>
                  <Text className="text-sm font-fredoka-semibold text-secondary">
                    {receiptDate || "Select Date"}
                  </Text>
                </Pressable>
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

              {showDatePicker && (
                <View className="bg-white rounded-2xl p-2 my-2 border border-secondary/20">
                  <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={onDateChange}
                    themeVariant="light"
                    textColor="#0e0104"
                    style={
                      Platform.OS === "ios"
                        ? { height: 216, width: "100%" }
                        : undefined
                    }
                  />
                  {Platform.OS === "ios" && (
                    <Pressable
                      onPress={() => setShowDatePicker(false)}
                      className="py-2 items-center"
                    >
                      <Text className="font-fredoka-semibold text-primary">
                        Done
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}

              {/* ── ITEMS ── */}
              <View className="gap-4 pb-100">
                <Text className="text-4xl  font-fredoka tracking-wide">
                  Your List
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
            disabled={!isFormValid}
            onPress={() => setModalVisible(true)}
            className={`flex-row p-4 rounded-full gap-2 flex-1 justify-center items-center ${
              isFormValid
                ? "bg-secondary opacity-100"
                : "bg-secondary/40 opacity-50"
            }`}
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
