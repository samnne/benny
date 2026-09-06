import Navbar from "@/components/Navigation/Navbar";
import ReceiptCard from "@/components/UI/Receipt/ReceiptCard";
import ReceiptCardSkeleton from "@/components/UI/Receipt/ReceiptCardSkeleton";
import { theme } from "@/constants/constants";
import { useReceipt } from "@/store/zustand";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ScrollView } from "moti";
import { styled } from "nativewind";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSAV);

const Reciepts = () => {
  const router = useRouter();

  const { receipts, isLoading, getReceipts, deleteReceipt } = useReceipt();
  useEffect(()=> {
    try {
      
      void getReceipts();
    } catch (error) {
      console.log(error)
    }
  }, [])
  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 16 }}>
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
