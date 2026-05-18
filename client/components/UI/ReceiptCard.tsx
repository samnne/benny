import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { theme } from "@/constants/constants";
import { SymbolView } from "expo-symbols";
const Triangle = () => {
  return <View style={styles.triangle} />;
};

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10, // Half of total width
    borderRightWidth: 10, // Half of total width
    borderBottomWidth: 20, // Total height
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    transform: "rotate(180deg)",
    borderBottomColor: theme.colors.pill, // Triangle color
  },
});
const ReceiptCard = ({
  receipt,
}: {
  receipt: { name: string; price: number };
}) => {
  return (
    <View key={receipt.name} className="w-full   overflow-hidden">
      <View className="bg-white  border-primary/20 border-2  rounded-t-2xl rounded-b-lg relative z-50 w-full h-80">
        <View className="flex-row justify-between p-4 items-center w-full">
          <View className="flex-row gap-2  justify-center items-center">
            <SymbolView name="storefront" tintColor={theme.colors.primary} />
            <Text className="text-4xl pt-2 font-bold font-nunito-bold  ">{receipt?.name}</Text>
          </View>
          <Text className="text-3xl pt-2 font-bold font-nunito-extrabold   ">${receipt?.price}</Text>
        </View>
        <View className="h-px bg-pill-dark/20"></View>
        <View className="w-full p-4 flex-1">
          <View className="flex-1  flex-row justify-between w-full">
            <Text className="text-3xl font-nunito">Item 1</Text>
            <Text className="text-3xl font-nunito">$5.99</Text>
          </View>
          <View className="flex-row items-center w-full justify-between">
            <Text className="text-xl font-nunito">+3 more items</Text>
            <Text className="text-5xl pt-2 font-nunito-bold">$170</Text>
          </View>
        </View>
        <View className="bg-primary/5 gap-2 flex-row items-center p-3 w-full ">
            <SymbolView name="pawprint" tintColor={theme.colors.primary}  /> 
            <Text className="font-semibold font-nunito-bold">
                Benny Says: The Milk prices are increasing??
            </Text>
        </View>
      </View>
    

      {/* <View className="flex-row  -translate-x-5">
        {[1, 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((val, i) => (
          <Triangle key={i} />
        ))}
      </View> */}
    </View>
  );
};

export default ReceiptCard;
