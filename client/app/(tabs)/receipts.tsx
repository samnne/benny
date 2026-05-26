import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";
import { styled } from "nativewind";
import Navbar from "@/components/Navigation/Navbar";
import { ScrollView } from "moti";
import { SymbolView } from "expo-symbols";
import { theme } from "@/constants/constants";
import ReceiptCard from "@/components/UI/Receipt/ReceiptCard";
import { useRouter } from "expo-router";
import { useReceipt } from "@/store/zustand";
import ReceiptCardSkeleton from "@/components/UI/Receipt/ReceiptCardSkeleton";

const SafeAreaView = styled(RNSAV);

const Reciepts = () => {
  const router = useRouter();

  const { receipts, isLoading } = useReceipt();

  return (
    <SafeAreaView>
      <Navbar />
      <ScrollView contentContainerClassName="p-4 gap-4 pb-40">
        <Pressable
          onPress={() => {
            router.push("/new");
          }}
          className="w-full  p-4 flex-row gap-4 justify-center  items-center border-primary/50 bg-primary/5 border-dashed border-2 rounded-2xl"
        >
          <Text className="text-2xl text-center  text-primary/50 ">
            Start Tracking
          </Text>
          <SymbolView
            name="plus"
            tintColor={theme.colors.primary + "80"}
            size={20}
          />
        </Pressable>
        <View className="w-full gap-4">
          <Text className="font-fredoka-semibold text-5xl font-bold">
            Past Trips
          </Text>

          {isLoading && <ReceiptCardSkeleton />}

          {receipts.map((receipt: Receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reciepts;
