import { View, Text, Pressable } from "react-native";
import React, {  useState } from "react";
import { SymbolView } from "expo-symbols";

import { theme } from "@/constants/constants";
import {  useTrip } from "@/store/zustand";

import { TextInput } from "react-native-gesture-handler";
const ItemSlot = ({ item }: { item: ReceiptItem }) => {
  const { removeItem, updateItem, items } = useTrip();
  const liveItem = items.find((it) => it.id === item.id) ?? item;

  const [price, setPrice] = useState(`${liveItem.total_price ?? "0"}`);
  const [name, setName] = useState(liveItem.name);

  function handleChange(text: string, type: "price" | "name") {
    if (type === "price") {
      const parsed = parseFloat(text) || 0;
      setPrice(text);
      updateItem({ ...liveItem, total_price: parsed });
    } else {
   
      const safeName = text.trim() || `Item ${items.indexOf(liveItem) + 1}`;
      setName(text); // keep raw text while typing
      updateItem({ ...liveItem, name: safeName });
    }
  }


  function handleNameBlur() {
    if (!name.trim()) {
      const fallback = `Item ${items.indexOf(liveItem) + 1}`;
      setName(fallback);
      updateItem({ ...liveItem, name: fallback });
    }
  }

  return (
    <View className="flex-row w-full justify-between p-2 border-dashed border-b border-primary">
      <View className="flex-row items-center gap-4">
        <Pressable onPress={() => removeItem(liveItem)} hitSlop={10}>
          <SymbolView name="multiply" tintColor={theme.colors.primary} />
        </Pressable>
        <TextInput
          value={name}
          onChangeText={(text) => handleChange(text, "name")}
          onBlur={handleNameBlur}
          className="text-2xl font-fredoka w-3/5 line-clamp-1 truncate leading-none text-text"
          placeholder="Item name"
          placeholderTextColor={theme.colors.primary + "40"}
        />
      </View>
      <View className="flex-row items-center justify-center">
        <Text className="font-fredoka-semibold leading-0 text-xl text-primary">
          $
        </Text>
        <TextInput
          value={price}
          onChangeText={(text) => handleChange(text, "price")}
          keyboardType="decimal-pad"
          className="text-2xl font-fredoka-semibold w-1/2 leading-none text-primary"
          placeholder="0.00"
          placeholderTextColor={theme.colors.primary + "40"}
        />
      </View>
    </View>
  );
};
export default ItemSlot;
