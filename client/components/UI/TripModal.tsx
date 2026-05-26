import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { getBennyMessage, theme } from "@/constants/constants";
import { useBudget, useReceipt, useTrip } from "@/store/zustand";
import { useRouter } from "expo-router";
import { randomUUID } from "expo-crypto";

interface TripModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const TripModal = ({ modalVisible, setModalVisible }: TripModalProps) => {
  const { total, items, reset } = useTrip();
  const { budget } = useBudget();
  const {
    receipts,
    addReceipt,
    serverReceipt,
    updateReceipt,
    setServerReceipt,
  } = useReceipt();
  const router = useRouter();

  const saved = budget - total;
  const isUnder = saved > 0;
  const percentage = Math.min((total / budget) * 100, 100);

  const handleDone = () => {
    setModalVisible(false);
    const newItems = items.map((item, i) => ({
      ...item,
      name: item.name ?? `Item ${i}`,
    }));
    const newReceipt: Receipt = {
      ...serverReceipt,
      items: newItems,
      benny_message: getBennyMessage("standard"),

      total: total || +serverReceipt.total.toFixed(2),
    };
    if (!serverReceipt.id) {
      addReceipt({ ...newReceipt, id: randomUUID() });
    } else {
      updateReceipt({ ...newReceipt, total });
    }
    setServerReceipt({});

    reset();
    router.replace("/receipts");
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-end p-4  bg-text/25">
        <View className="bg-white rounded-[40px]  overflow-hidden">
          {/* Close button */}
          <Pressable
            onPress={() => setModalVisible(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary/10 items-center justify-center z-10"
          >
            <SymbolView
              name="xmark"
              tintColor={theme.colors.primary}
              size={16}
            />
          </Pressable>

          {/* Header */}
          <View className="items-center pt-8 px-6 pb-0">
            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-4">
              <SymbolView
                name={isUnder ? "trophy.fill" : "exclamationmark.triangle.fill"}
                tintColor={theme.colors.background}
                size={28}
              />
            </View>

            <Text className="text-xs font-nunito-bold text-primary tracking-widest uppercase mb-1">
              This is what you saved!
            </Text>
            <Text className="text-5xl font-fredoka-semibold text-black leading-tight">
              ${Math.abs(saved).toFixed(2)}
            </Text>
            <Text className="text-sm font-nunito text-black/40 mt-1 mb-6">
              {isUnder ? "under budget this trip" : "over budget this trip"}
            </Text>
          </View>

          {/* Breakdown card */}
          <View className="mx-5 bg-primary/5 rounded-2xl border border-primary/10 p-4">
            <View className="flex-row justify-between py-1">
              <Text className="text-sm font-nunito text-black/40">
                Your budget
              </Text>
              <Text className="text-sm font-nunito-bold text-black">
                ${budget.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-sm font-nunito text-black/40">
                Total spent
              </Text>
              <Text className="text-sm font-nunito-bold text-black">
                ${total.toFixed(2)}
              </Text>
            </View>

            {/* Progress bar */}
            <View className="mt-3 mb-1">
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs font-nunito text-black/30">$0</Text>
                <Text className="text-xs font-nunito text-black/30">
                  ${budget.toFixed(2)}
                </Text>
              </View>
              <View className="w-full h-2.5 rounded-full bg-primary/15">
                <View
                  className="h-2.5 rounded-full bg-primary"
                  style={{ width: `${percentage}%` }}
                />
              </View>
            </View>

            <View className="h-px bg-primary/10 my-2" />

            <View className="flex-row justify-between py-1">
              <Text className="text-sm font-nunito-bold text-black">
                {isUnder ? "Under budget" : "Over budget"}
              </Text>
              <Text className="text-sm font-nunito-bold text-primary">
                ${Math.abs(saved).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Mascot message */}
          <View className="mx-5 mt-4 bg-primary rounded-2xl p-4 flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
              <SymbolView name="face.smiling" tintColor="#ffffff" size={17} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-nunito-bold text-sm">
                {percentage.toFixed(0)}% of budget used!
              </Text>
              <Text className="text-white/85 font-nunito text-sm leading-5 mt-0.5">
                {isUnder
                  ? "You stayed under, treat yourself to something small. You earned it."
                  : "A little over this time. You've got this next trip!"}
              </Text>
            </View>
          </View>

          {/* Done button */}
          <View className="p-5">
            <Pressable
              onPress={handleDone}
              className="bg-primary rounded-full py-4 items-center justify-center"
            >
              <Text className="text-background text-xl font-nunito-bold">
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TripModal;
