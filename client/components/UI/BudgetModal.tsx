import { useBudget } from "@/store/zustand";
import { Text, View } from "moti";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native";

import { TextInput } from "react-native-gesture-handler";

export const BudgetModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { budget, setBudget } = useBudget();
  const [input, setInput] = useState(`${budget}`);

  function handleSave() {
    const parsed = parseFloat(input);
    if (!isNaN(parsed) && parsed > 0) {
      setBudget(parsed);
    }
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-text/20 p-4">
        <View className="bg-white rounded-3xl mb-12 p-6 gap-4">
          <Text className="text-3xl font-fredoka-semibold">Set Budget</Text>
          <Text className="font-nunito text-text/50 -mt-2">
            How much do you want to spend for each grocery trip?
          </Text>
          <View className="flex-row items-center border-2 border-primary/20 rounded-2xl px-4 py-3 gap-2">
            <Text className="text-3xl font-fredoka-semibold text-primary">
              $
            </Text>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                keyboardType="decimal-pad"
                className="text-3xl font-fredoka-semibold flex-1 text-text"
                autoFocus
                selectTextOnFocus
              />
            </KeyboardAvoidingView>
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 py-4 rounded-full border-2 border-primary/20 items-center"
            >
              <Text className="font-nunito-bold text-text/50">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="flex-1 py-4 rounded-full bg-primary items-center"
            >
              <Text className="font-nunito-bold text-white text-lg">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
